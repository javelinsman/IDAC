import * as d3 from 'd3';

function translate(x: number, y: number) {
    return `translate(${x}, ${y})`;
}

function make_offset(stack, key) {
    return stack.map((d, i, a) => {
        if (i === 0) {
            d.offset = 0;
        } else {
            d.offset = a[i - 1].offset + a[i - 1].value;
        }
        d.key = key;
        return d;
    });
}

function if_exists(value, default_value = '') {
    return value ? value : default_value;
}

function react_on_hover(selection) {
    return selection
        .on('mouseover', function() { d3.select(this).classed('focused', true); })
        .on('mouseout', function() { d3.select(this).classed('focused', false); });
}

export function render(spec, svgId) {
    const svg = d3.select(svgId);
    const svgWidth = parseFloat(svg.style('width'));
    const legendHeight = 30 * (Object.keys(spec.meta.colors).length + 1);
    const margin = {
            top: 50,
            left: 50,
            right: 50,
            bottom: 100,
        };
    const svgHeight = margin.top + svgWidth + margin.bottom + legendHeight;
    const width = svgWidth - margin.left - margin.right,
        height = svgHeight - margin.top - margin.bottom - legendHeight;

    svg.attr('width', svgWidth).attr('height', svgHeight);
    svg.selectAll('*').remove();

    const viewBackground = svg.append('rect').attr('transform', translate(margin.left, margin.top))
        .attr('width', width).attr('height', height)
        .style('fill', 'rgb(230, 230, 230)');

    const view = svg.append('g').attr('transform', translate(margin.left, margin.top));

    const bar_heights = spec.marks.map(d => {
        if (d.type === 'stacked_bar') {
            return d.stacks.reduce((a, b) => a + +b.value, 0);
        } else if (d.type === 'grouped_bar') {
            return d3.max(d.groups.map(t => +t.bar.value));
        } else {
            return +d.bar.value;
        }
    });

    const title = svg.append('text')
        .attr('transform', translate(svgWidth / 2, 35))
        .style('text-anchor', 'middle')
        .style('font-size', '150%')
        .style('font-weight', 'bold')
        .text(spec.meta.title)
        .call(react_on_hover);

    const x = d3.scaleBand().domain(spec.marks.map(d => d.key)).range([0, width]).padding(0.1);
    const y = d3.scaleLinear().domain([
        spec.meta.y_min ? spec.meta.y_min : 0,
        spec.meta.y_max ? spec.meta.y_max : +d3.max(bar_heights) * 1.1
    ]).range([height, 0]);
    const x_axis = d3.axisBottom(x);
    const y_axis = d3.axisLeft(y);
    const x_axis_g = svg.append('g').attr('id', 'x-axis')
            .attr('transform', translate(margin.left, margin.top + height)).call(x_axis);
    const x_ticks = x_axis_g
            .selectAll('.tick').call(react_on_hover);
    if (spec.meta.x_tick_rotate) {
        x_ticks.selectAll('text')
        .attr('transform', 'rotate(' + spec.meta.x_tick_rotate + ')')
        .style('text-anchor', 'start');
    }
    svg.append('g').attr('id', 'y-axis')
        .attr('transform', translate(margin.left, margin.top)).call(y_axis)
        .selectAll('.tick').call(react_on_hover);

    const title_and_unit = (_title, _unit) => {
        if (_title && _unit) {
            return _title + ' (' + _unit + ')';
        } else {
            return if_exists(_title) + if_exists(_unit);
        }
    };

    const x_title = svg.append('text')
        .attr('transform', translate(svgWidth / 2, margin.top + height + 2 * margin.bottom / 3))
        .style('text-anchor', 'middle')
        .style('font-size', '100%')
        .text(title_and_unit(spec.meta.x_title, spec.meta.x_unit))
        .call(react_on_hover);

    const y_title = svg.append('text')
        .attr('transform', translate(margin.left / 3, margin.top + height / 2) + ' rotate(-90)')
        .style('text-anchor', 'middle')
        .style('font-size', '100%')
        .text(title_and_unit(spec.meta.y_title, spec.meta.y_unit))
        .call(react_on_hover);

    if (['horizontal', 'grid'].indexOf(spec.meta.gridline) >= 0) {
        view.append('g')
            .attr('class', 'grid')
            .call(y_axis
                .tickSize(-width)
                .tickFormat(() => '')
            );
    }

    if (['vertical', 'grid'].indexOf(spec.meta.gridline) >= 0) {
        view.append('g')
            .attr('class', 'grid')
            .attr('transform', 'translate(' + (x.bandwidth() / (1 - x.padding()) / 2) + ',' + height + ')')
            .call(x_axis
                .tickSize(-height)
                .tickFormat(() => '')
            );
    }

    const bars = view.append('g').selectAll('g').data(spec.marks);
    if (spec.marks.length && spec.marks[0].type === 'grouped_bar') {
        const groups = bars.enter().append('g')
                .attr('transform', (d: any) => translate(x(d.key), 0))
            .selectAll('rect').data((d: any, i) => d.groups.map(bar => ({
                'parent_key': d.key,
                'bar': bar,
                'subx': d3.scaleBand()
                    .domain(d.groups.map((t, j) => t.key ? t.key : j))
                    .range([0, x.bandwidth()]).padding(0.1)
            })));
        const rects = groups.enter().append('rect')
            .attr('width', (d: any) => {
                return d.subx.bandwidth();
            })
            .attr('height', (d: any) => height - y(d.bar.bar.value))
            .attr('transform', (d: any, i) => {
                return translate(d.subx(d.bar.key ? d.bar.key : i), y(d.bar.bar.value));
            })
            // .style('fill', (d: any) => d.bar.bar.color.name ? spec.meta.colors[d.bar.bar.color.name] : d.bar.bar.color)
            .call(react_on_hover)
            .style('fill', (d: any) => d.bar.bar.highlight
                ? d3.color(spec.meta.colors[d.bar.bar.color.name]).darker()
                : spec.meta.colors[d.bar.bar.color.name])
            .each(function(d: any, i) {
                console.log(d.bar.bar);
                if (!d.bar.bar.label) {
                    return;
                }
                const label = view.append('text')
                    .attr('transform',
                        translate(x(d.parent_key) + d.subx(d.bar.key ? d.bar.key : i) + d.subx.bandwidth() / 2, y(d.bar.bar.value) + 20))
                    .style('text-shadow', '-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white')
                    .style('text-anchor', 'middle')
                    .text(d.bar.bar.label.format.replace(/%v/g, d.bar.bar.value).replace(/%u/g, if_exists(spec.meta.y_unit)));
                if (d.bar.bar.label.position === 'middle') {
                    label.attr('transform',
                        translate(x(d.parent_key) + d.subx(d.bar.key ? d.bar.key : i) + d.subx.bandwidth() / 2,
                            (height + y(d.bar.bar.value)) / 2 + 5));
                }
            });
        // draw subx axis if some bars have 'key' attribute
        if (spec.marks.map(mark => mark.groups.map(bar => bar.key)).reduce((a, b) => a.concat(b)).filter(d => d).length) {
            bars.enter().append('g').each(function(d: any, i) {
                const subx = d3.axisBottom(d3.scaleBand()
                    .domain(d.groups.map((t, j) => t.key ? t.key : j))
                    .range([0, x.bandwidth()]).padding(0.1));
                d3.select(this)
                    .classed('sub-axis', true)
                    .attr('transform', translate(x(d.key), height))
                    .call(subx);
                x_axis_g
                    .attr('transform', translate(margin.left, margin.top + height + 25));
            });
            if (spec.meta.subx_title) {
                svg.append('text').attr('transform', translate(margin.left + width, margin.top + height + 10))
                    .text(spec.meta.subx_title);
            }
        }
    } else {
        const stacks = bars.enter().append('g')
                .attr('transform', (d: any) => translate(x(d.key), 0))
            .selectAll('rect').data((d: any) => d.type === 'bar' ? make_offset([d.bar], d.key) : make_offset(d.stacks, d.key));
        const rects = stacks.enter().append('rect')
            .attr('width', x.bandwidth())
            .attr('height', (d: any) => height - y(d.value))
            .attr('transform', (d: any, i) => {
                return translate(0, y(d.offset + d.value));
            })
            .style('fill', (d: any) => d.color.name ? spec.meta.colors[d.color.name] : d.color)
            .call(react_on_hover)
            .each(function(d: any, i) {
                if (!d.label) {
                    return;
                }
                const label = view.append('text')
                    .attr('transform', translate(x(d.key) + x.bandwidth() / 2, y(d.offset + d.value) + 20))
                    .style('text-shadow', '-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white')
                    .style('text-anchor', 'middle')
                    .text(d.label.format.replace(/%v/g, d.value).replace(/%u/g, if_exists(spec.meta.y_unit)));
                if (d.label.position === 'middle') {
                    label.attr('transform', translate(x(d.key) + x.bandwidth() / 2, 5 + y(d.offset + d.value) + (height - y(d.value)) / 2));
                }
            });
    }
    if (spec.meta.colors) {
        const legend = svg.append('g')
            .attr('transform', translate(margin.left, margin.top + height + margin.bottom));
        const legend_items = legend.selectAll('g').data(Object.entries(spec.meta.colors), (d: any) => d[0])
            .enter().append('g')
                .attr('transform', (d, i) => translate(0, 30 * i))
                .call(react_on_hover);
        legend_items
            .append('rect')
                .attr('width', 20).attr('height', 20)
                .attr('transform', translate(5, 5))
                .style('fill', (d: any) => d[1]);
        legend_items
            .append('text')
                .attr('transform', translate(40, 15))
                .attr('height', 30)
                .text(d => d[0]);
    }
}
