import React, {Component} from 'react'
import Chart from 'react-c3-component';
import 'c3/c3.css';
import axios from 'axios'

class Level extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id:0,
            level: 0.0, //Flow rate for this monitor
            height: 0.0, //Water height for this monitor
            riverLabel: '',
            riverName: '',
            responseData:'',
            data: {
                        columns: [['data', 90.1]
                            
                        ],
                        type: 'gauge',
                        onclick: function (d, i) { console.log("onclick", d, i); },
                        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                    },
                    gauge: {
                        units: ' metres'
                    },
                    color: {
                        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
                        threshold: {
                            values: [30, 60, 90, 100]
                        }
                    },
                    size: {
                        height: 180
                    },
                    title: {
                        text: 'Poole Harbour'
                }
        };
    }

    componentDidMount(){
        this.getData();
    }

    getData(){
        axios.get('http://localhost:8080/river_data')
        .then(function (response) {
            console.log('hello'+ response.data);
            console.log(response.data);
            newState.level = response.data.stations[this.state.id].level;
            newState.riverLabel = response.data.stations[this.state.id].riverLabel;
            newState.data.columns = [['data', newState.level]];
            this.setState(newState);
        });
    }

    renderLevel() {
        let {val} = this.props.children;
        let newState = this.state;
        console.log('adding: '+this.state.id);
        
        return <Chart
                    config={{data:this.state.data}}
                />
    }

    render() {
        return this.renderLevel();
    }

}

export default Level;