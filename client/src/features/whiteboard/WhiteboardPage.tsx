import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "@/hooks/useSocket";
import { Toolbar } from "./components/Toolbar";
import type { Tool } from "./components/Toolbar";
import type { Point, WhiteboardObject } from "@/lib/types/whiteboard";

export const WhiteboardPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { socket } = useSocket();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [objects, setObjects] = useState<WhiteboardObject[]>([]);
  const [undoStack, setUndoStack] = useState<WhiteboardObject[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);

  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#000000");
  const [width, setWidth] = useState(5);

  const drawObject = (ctx: CanvasRenderingContext2D, obj: WhiteboardObject) => {
    const { shape } = obj;

    ctx.globalCompositeOperation = "source-over";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (shape.type) {
      case "path": {
        if (shape.points.length < 2) return;
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.width;
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.stroke();
        break;
      }

      case "erase": {
        if (shape.points.length < 2) return;
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = shape.width;
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
        break;
      }

      case "line": {
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.width;
        ctx.beginPath();
        ctx.moveTo(shape.start.x, shape.start.y);
        ctx.lineTo(shape.end.x, shape.end.y);
        ctx.stroke();
        break;
      }

      case "rect": {
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.strokeWidth;
        ctx.beginPath();
        ctx.strokeRect(shape.start.x, shape.start.y, shape.width, shape.height);
        break;
      }

      case "circle": {
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.strokeWidth;
        ctx.beginPath();
        ctx.arc(shape.center.x, shape.center.y, shape.radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const obj of objects) {
      drawObject(ctx, obj);
    }
  }, [objects]);

  // Socket wiring
  useEffect(() => {
    if (!socket || !roomId) return;
    socket.emit("join-whiteboard-room", roomId);

    const onFinished = (data: { roomId: string; object: WhiteboardObject }) => {
      setObjects((prev) => [...prev, data.object]);
    };
    const onCleared = () => setObjects([]);
    const onUndid = (pathId: string) =>
      setObjects((prev) => prev.filter((o) => o.id !== pathId));
    const onRedid = (obj: WhiteboardObject) =>
      setObjects((prev) => [...prev, obj]);

    socket.on("user-finished-drawing", onFinished);
    socket.on("canvas-cleared", onCleared);
    socket.on("user-undid", onUndid);
    socket.on("user-redid", onRedid);

    return () => {
      socket.off("user-finished-drawing", onFinished);
      socket.off("canvas-cleared", onCleared);
      socket.off("user-undid", onUndid);
      socket.off("user-redid", onRedid);
    };
  }, [socket, roomId]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const pt: Point = { x: offsetX, y: offsetY };
    setIsDrawing(true);
    setStartPoint(pt);

    const id = `${Date.now()}-${socket?.id ?? "local"}`;
    let newObj: WhiteboardObject;

    switch (tool) {
      case "pen":
        newObj = {
          id,
          shape: { type: "path", points: [pt], color, width },
        };
        break;
      case "eraser":
        newObj = {
          id,
          shape: { type: "erase", points: [pt], width },
        };
        break;
      case "line":
        newObj = {
          id,
          shape: { type: "line", start: pt, end: pt, color, width },
        };
        break;
      case "rect":
        newObj = {
          id,
          shape: {
            type: "rect",
            start: pt,
            width: 0,
            height: 0,
            color,
            strokeWidth: width,
          },
        };
        break;
      case "circle":
        newObj = {
          id,
          shape: {
            type: "circle",
            center: pt,
            radius: 0,
            color,
            strokeWidth: width,
          },
        };
        break;
    }

    setObjects((prev) => [...prev, newObj!]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const curr: Point = { x: offsetX, y: offsetY };

    setObjects((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const currentObj = updated[updated.length - 1];
      const s = currentObj.shape;

      switch (s.type) {
        case "path":
          s.points.push(curr);
          break;
        case "erase":
          s.points.push(curr);
          break;
        case "line":
          currentObj.shape = { ...s, end: curr };
          break;
        case "rect":
          currentObj.shape = {
            ...s,
            width: curr.x - startPoint.x,
            height: curr.y - startPoint.y,
          };
          break;
        case "circle": {
          const radius = Math.hypot(
            curr.x - startPoint.x,
            curr.y - startPoint.y
          );
          currentObj.shape = { ...s, radius };
          break;
        }
      }
      return updated;
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStartPoint(null);

    const last = objects[objects.length - 1];
    if (last && roomId) {
      socket?.emit("finish-drawing", { roomId, object: last });
    }
  };

  // Toolbar actions
  const handleClear = () => {
    setObjects([]);
    setUndoStack([]);
    if (roomId) socket?.emit("clear-canvas", roomId);
  };

  const handleUndo = () => {
    if (!objects.length) return;
    const last = objects[objects.length - 1];
    setObjects((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, last]);
    if (roomId) socket?.emit("undo", { roomId, pathId: last.id });
  };

  const handleRedo = () => {
    if (!undoStack.length) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setObjects((prev) => [...prev, last]);
    if (roomId) socket?.emit("redo", { roomId, path: last });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Toolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        width={width}
        setWidth={setWidth}
        onClear={handleClear}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      <div className="flex-1 p-4">
        <canvas
          ref={canvasRef}
          width={window.innerWidth - 32}
          height={window.innerHeight - 100}
          className="bg-white rounded-lg shadow-md"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </div>
  );
};
