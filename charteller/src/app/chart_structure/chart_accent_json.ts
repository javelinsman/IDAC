class ItemsTarget {
  type: "items";
  items: {
    elements: string,
    items: string[]
  }[];
}

class RangeTarget {
  type: "range";
  axis: string;
  range: string;
}

export class Annotation {
    target: ItemsTarget | RangeTarget;
    target_inherit: {
        mode: string;
        serieses: string[]
    } | undefined;
    components: {
        type: string;
        visible: boolean;
        style: Object;
    }[]
}
export class ChartAccentJSON {
    annotations: {annotations: Annotation[]};
    chart: {
        title: {text: string},
        xLabel: {text: string},
        yLabel: {text: string},
        yColumns: string[],
        yScale: {min: number, max: number}
    };
    dataset: {
        columns;
        rows;
    };
}
