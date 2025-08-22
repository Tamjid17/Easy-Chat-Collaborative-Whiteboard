import { Button } from "@/components/ui/button";
import {
  Minus,
  Plus,
  Palette,
  Trash2,
  Undo,
  Redo,
  Pen,
  Eraser,
  Slash,
  Circle,
  RectangleHorizontal,
} from "lucide-react";

export type Tool = "pen" | "eraser" | "line" | "rect" | "circle";

interface ToolbarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  color: string;
  setColor: (color: string) => void;
  width: number;
  setWidth: (width: number) => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

export const Toolbar = ({
  tool,
  setTool,
  color,
  setColor,
  width,
  setWidth,
  onClear,
  onUndo,
  onRedo,
}: ToolbarProps) => {
  const colors = ["#000000", "#EF4444", "#22C55E", "#3B82F6", "#F59E0B"];

  return (
    <div className="flex flex-wrap items-center gap-4 p-3 bg-white border-b shadow-sm">
      {/* Tools */}
      <div className="flex items-center gap-2">
        <Button
          variant={tool === "pen" ? "default" : "outline"}
          size="icon"
          onClick={() => setTool("pen")}
        >
          <Pen className="h-4 w-4" />
        </Button>
        <Button
          variant={tool === "eraser" ? "default" : "outline"}
          size="icon"
          onClick={() => setTool("eraser")}
        >
          <Eraser className="h-4 w-4" />
        </Button>
        <Button
          variant={tool === "line" ? "default" : "outline"}
          size="icon"
          onClick={() => setTool("line")}
        >
          <Slash className="h-4 w-4" />
        </Button>
        <Button
          variant={tool === "rect" ? "default" : "outline"}
          size="icon"
          onClick={() => setTool("rect")}
        >
          <RectangleHorizontal className="h-4 w-4" />
        </Button>
        <Button
          variant={tool === "circle" ? "default" : "outline"}
          size="icon"
          onClick={() => setTool("circle")}
        >
          <Circle className="h-4 w-4" />
        </Button>
      </div>

      {/* Color Palette (for pen and shapes) */}
      {tool !== "eraser" && (
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-gray-600" />
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c}
                className={`w-7 h-7 rounded-full border-2 ${
                  color === c ? "border-blue-500" : "border-gray-300"
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Brush/Eraser Size */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">
          {tool === "eraser" ? "Eraser" : "Stroke"} Size:
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setWidth(Math.max(1, width - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="min-w-[30px] text-center text-sm font-semibold">
          {width}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setWidth(Math.min(50, width + 1))}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Undo/Redo and Clear */}
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm" onClick={onUndo}>
          <Undo className="h-4 w-4 mr-2" />
          Undo
        </Button>
        <Button variant="outline" size="sm" onClick={onRedo}>
          <Redo className="h-4 w-4 mr-2" />
          Redo
        </Button>
        <Button variant="destructive" size="sm" onClick={onClear}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>
    </div>
  );
};
