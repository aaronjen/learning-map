import React, { Component } from 'react';
import Graph from './components/graphs/Graph';

class App extends Component {
    render() {
        return (
            <div>
                <p>Learning map</p>
                <Graph></Graph>
            </div>
        );
    }
}

export default App;
