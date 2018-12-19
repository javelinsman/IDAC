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
            unit: string
        },
        {
            tagname: string; //'x',
            children: {tagname: string; /* tick */}[]
            label: string;
        },
        {
            tagname: string; //'legend',
            children: {tagname: string /*item*/, item: string}[]
        },
        {
            tagname: string; //'marks',
            children: {
                tagname: string /*'bargroup'*/,
                name: string,
                children: {
                    tagname: string /*'bar'*/,
                    key: string,
                    value: number
                }[]
            }[]
        },
        {
            tagname: string /*'annotations'*/,
            children: {
                tagname: string /*'annotation'*/,
            }[]
        }
    ]
}