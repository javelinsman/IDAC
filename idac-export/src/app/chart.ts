export class InputSpecValue {
  id?: string;
  selector: string;
  data?: any;
  orderBy?: string;
  subFrame?: { [key: string]: InputSpecValue };
}

export class InputSpec {
  svg: string;
  chartType: 'bar-chart' | 'line-chart' | 'scatterplot';
  title: InputSpecValue;
  y: InputSpecValue;
  x: InputSpecValue;
  legend: InputSpecValue;
  marks: InputSpecValue;
  annotations: InputSpecValue[];
}

export class Chart {
    id: number;
    title: string;
    src_png?: string;
    src_json?: string;
    src_svg: string;
    svg_only?: boolean;
    spec?: InputSpec;
}
