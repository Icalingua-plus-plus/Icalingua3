export interface ITextElem {
  type: 'text';
  text: string;
}

export interface IFaceElem {
  type: 'face';
  id: number;
}

export type MessageElem = ITextElem | IFaceElem;
