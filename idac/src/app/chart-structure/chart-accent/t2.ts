// Generated by https://quicktype.io

export interface ChartAccentJSON {
  dataset:     Dataset;
  chart:       Chart;
  annotations: Annotations;
  timestamp:   number;
}

export interface Annotations {
  annotations: Annotation[];
}

export interface Annotation {
  target:          Target;
  target_inherit?: TargetInherit;
  components:      Component[];
  visible:         boolean;
  id:              string;
}

export interface Component {
  type:           string;
  visible:        boolean;
  style:          Style;
  text?:          string;
  anchor?:        string;
  anchor_offset?: AnchorOffset;
}

export interface AnchorOffset {
  x: number;
  y: number;
}

export interface Style {
  fill:               Stroke | null;
  paint_order?:       string;
  stroke:             Stroke;
  stroke_width:       number;
  line_stroke:        LineStroke | null;
  font_family?:       string;
  font_size?:         number;
  line_stroke_width?: number;
}

export interface Stroke {
  r?:     number;
  g?:     number;
  b?:     number;
  a?:     number;
  mode?:  string;
  value?: number;
}

export interface LineStroke {
  mode:  string;
  value: number;
}

export interface Target {
  _id:    string;
  type:   string;
  axis?:  string;
  range?: string;
  items?: Item[];
}

export interface Item {
  elements: string;
  items:    string[];
}

export interface TargetInherit {
  mode:     string;
  serieses: string[];
}

export interface Chart {
  type:        string;
  title:       LegendLabel;
  width:       number;
  height:      number;
  xColumn:     string;
  yColumns:    string[];
  xLabel:      LegendLabel;
  yLabel:      LegendLabel;
  xScale:      XScale;
  yScale:      YScale;
  legendLabel: LegendLabel;
  colors:      string[];
}

export interface LegendLabel {
  text:       string;
  fontFamily: string;
  fontSize:   number;
  fontStyle:  string;
  color:      string;
}

export interface XScale {
  type: string;
}

export interface YScale {
  min:  number;
  max:  null;
  type: string;
}

export interface Dataset {
  columns:  Column[];
  rawFile:  string;
  fileName: string;
  rows:     Row[];
  type:     string;
}

export interface Column {
  name:    string;
  type:    string;
  format?: string;
}

export interface Row {
  국가:     string;
  ' 자살률': number;
}