export class ChartInfo {
    tagname: 'graph';
    children: [
        {
            tagname: string; //'title',
            title: string
        },
        {
            tagname: string; //'y'
            min: number,
            max: number,
            label: string,
            unit: string,
            lines: any[],
            ranges: any[],
        },
        {
            tagname: string; //'x',
            children: {tagname: string; /* tick */}[]
            label: string;
            lines: any[];
            ranges: any[];
        },
        {
            tagname: string; //'legend',
            children: {
                tagname: string /*item*/,
                item: string,
                trendline: boolean
            }[]
        },
        {
            tagname: string; //'marks',
            children: {
                tagname: string /*'bargroup'*/,
                name: string,
                relationalRanges: any[],
                children: {
                    tagname: string /*'bar'*/,
                    key: string,
                    value: number,
                    relationalRanges: any[],
                    highlighted: boolean
                }[]
            }[]
        },
        {
            tagname: string; //'annotations',
            children: any[]
        }
    ]
}
