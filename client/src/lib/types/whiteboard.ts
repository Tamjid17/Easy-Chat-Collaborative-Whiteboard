export interface Point {
  x: number;
  y: number;
}

export type Shape =
  | { type: "path"; points: Point[]; color: string; width: number }
  | { type: "erase"; points: Point[]; width: number }
  | { type: "line"; start: Point; end: Point; color: string; width: number }
  | {
      type: "rect";
      start: Point;
      width: number;
      height: number;
      color: string;
      strokeWidth: number;
    }
  | {
      type: "circle";
      center: Point;
      radius: number;
      color: string;
      strokeWidth: number;
    };

export interface WhiteboardObject {
  id: string;
  shape: Shape;
}
