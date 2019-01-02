export interface Tag {
  tagname: string;
  children?: Tag[];
  parentId?: number;
  _id?: number;
  fetchAnnotations?: (...args: any[]) => void;
}
