import React, { Component } from 'react';
import { select, event } from 'd3-selection';
import { hierarchy, tree } from 'd3-hierarchy';
import { linkHorizontal } from 'd3-shape';
import { drag } from 'd3-drag';
import style from './Graph.css';

const fakeData = {
    name: 'frontend',
    children: [
        {name: 'javascript'},
        {name: 'html'},
        {name: 'css'}
    ]
}

const inputBaseStyle = {
    position: 'absolute',
    display: 'none',
}

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputStyle: inputBaseStyle,
            inputValue: '',
        };
    }

    componentDidMount() {
        this.draw();
    }

    render() {
        return (
            <div>
                <svg
                    ref={ref => this.node = ref}
                    width={window.innerWidth - 100}
                    height={window.innerHeight - 50}
                />
                <input
                    style={this.state.inputStyle}
                    value={this.state.inputValue}
                    ref={ref => this.input = ref}
                    onChange = {this.handleTextChange}
                    onKeyPress = {this.handleTextKeyPress}
                    onBlur = {this.handleTextBlur}
                    type="text"
                />
            </div>
        );
    }

    draw = () => {
        const svg = select(this.node),
            width = +svg.attr('width'),
            height = +svg.attr('height'),
            g = svg.append("g").attr("transform", "translate(100,0)");

        const layout = tree().size([height, width - 200]),
            root = hierarchy(fakeData);

        g.selectAll('.link')
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
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

        node.call(drag().on('drag', function(d) {
                d.y += event.dx;
                d.x += event.dy;
                select(this).attr("transform", "translate(" + d.y + "," + d.x +")");
            }));

        node.append('circle').attr('r', 5);

        node.append("text")
            .attr("dy", 3)
            .attr("x", function(d) { return d.children ? -8 : 8; })
            .attr('id', function(d, i) { return "text" + i })
            .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
            .text(d => { return d.data.name })
            .on('dblclick', (d, i) => {
                const text = select('#text' + i);
                const node = text['_groups'][0][0];
                const rect = node.getBoundingClientRect();

                const inputStyle = {
                    ...inputBaseStyle,
                    top: rect.top + 12,
                    left: rect.left - 3,
                    width: rect.width,
                    height: rect.height,
                    display: 'block'
                }

                this.setState({ inputStyle, inputValue: text.text(), editingTextId: i });
            });
    }

    handleTextChange = (e) => {
        this.setState({inputValue: e.target.value});
    }

    handleTextKeyPress = (e) => {
        if(e.key === 'Enter') e.target.blur();
    }

    handleTextBlur = (e) => {
        select('#text' + this.state.editingTextId).text(e.target.value);
        this.setState({ inputStyle: inputBaseStyle });
    }
}

export default Graph;
