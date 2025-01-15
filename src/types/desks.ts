export interface DeskObject {
  readonly id: number;
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly vertical: boolean;
  readonly selectable: boolean;
  readonly adjustableDesk: boolean;
  readonly rotation: 0 | 90 | 180 | 270;
}

export interface DeskGroupObject {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly desks: DeskObject[];
}
