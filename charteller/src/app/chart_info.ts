export class ChartInfo {
    title: string;
    x: {
        ticks: {tick}[]
    };
    y: {
        min: number,
        max: number,
        label: string,
        unit: string
    };
    legend: {
        items: string[]
    };
    marks: {
        bargroups: {
            name: string;
            bars: {
                key: string,
                value: number
            }[]
        }[]
    };
    annotations: {

    }
}