export function translate(x: number, y: number) {
    return `translate(${x}, ${y})`;
}

export type d3Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;
