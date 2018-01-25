import React, { Component } from 'react';
import { select } from 'd3-selection';
import { hierarchy, tree } from 'd3-hierarchy';
import { linkHorizontal } from 'd3-shape';
import style from './Graph.css';

const fakeData = {
    name: 'frontend',
    children: [
        {name: 'javascript'},
        {name: 'html'},
        {name: 'css'}
    ]
}

class Graph extends Component {
    componentDidMount() {
        this.draw();
    }

    render() {
        return (
            <svg
                ref={ref => this.node = ref}
                width={500}
                height={500}
            />
        );
    }

    draw = () => {
        const svg = select(this.node),
            width = +svg.attr('width'),
            height = +svg.attr('height'),
            g = svg.append("g").attr("transform", "translate(40,0)");


        const layout = tree().size([height, width-50]),
            root = hierarchy(fakeData);

        const link = g.selectAll('.link')
            .data(layout(root).links())
            .enter()
            .append('path')
            .attr('class', style.link)
            .attr("d", linkHorizontal()
                .x(function(d) { return d.y })
                .y(function(d) { return d.x }));

        const node = g.selectAll('.node')
            .data(root.descendants())
            .enter().append("g")
            .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        node.append('circle').attr('r', 2.5)

        console.log(style);

    }
}

export default Graph;
