import React, {Component} from 'react';
import c3  from 'c3'
import 'c3/c3.css'

class Chart extends Component{
    constructor(props){
        super(props)
        this.state = {
            chart: null
        }
    }

    componentDidMount = () => {
        const chart = c3.generate({
            bindto: `#${this.props.name}`,
            data: {
              columns: this.props.data,
              type: 'line'
            }
        });
        this.state.chart = chart
    }

    componentWillUpdate = (nextProps, nextState) => {
        this.state.chart.load({
            columns: nextProps.data
        })
    }

    shouldComponentUpdate = () => {
        if(this.props.current.includes(this.props.name)){
            return true
        } else {
            return false
        }
    }

    render = () => {
        return (
            <div id={this.props.name}></div>
        )
    }
}

export default(Chart)