interface Tag {
  tagname: string;
}

export interface AnnotatedTag {
  tagname: string;
  children?: (AnnotatedTag | Tag)[];
  fetchAnnotations: (...args: any[]) => void;
}
