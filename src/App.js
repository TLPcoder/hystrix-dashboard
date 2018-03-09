import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './dashboard'
import Selectors from './selectors'

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
          hystrixMetrics: {},
          dashbaords: [],
          current: []
        }
    }
    componentDidMount = () => {
        let source = this.props.source || 'http://localhost:3000/hystrix'
        let stream = new EventSource(source);
        stream.onopen = () => {
            console.log('open')  
        };

        stream.onmessage = (e) => {
            let json = JSON.parse(e.data);
            let commandMetrics = this.state.hystrixMetrics[json.name]

            if (commandMetrics){
                let newState = this.cleanState(json.name)
                newState.push({metrics: json, date: Date.now()})

                this.setState(() => {
                  return {
                    hystrixMetrics: {...this.state.hystrixMetrics, [json.name]: newState},
                    dashbaords: this.createDashboards()
                  }
                })
            } else {
                let newState = [{metrics: json, date: Date.now()}]
                this.setState(() => {
                  return {
                    hystrixMetrics: {...this.state.hystrixMetrics, [json.name]: newState},
                    dashbaords: this.createDashboards()
                  }
                })
            }
          }
        stream.onerror = () => {
            console.log("EventSource failed.");
        };
    }

    cleanState(name){
        let commandMetrics = [...this.state.hystrixMetrics[name]]
        let windowLength = commandMetrics[0].metrics.windowLength
        for (let i = 0; i < commandMetrics.length; i++) {
            if(commandMetrics[i].date + windowLength > Date.now()){
                break
            } else {
                commandMetrics.splice(i, 1)
            }
        }
        return commandMetrics
    }

    createDashboards = () => {
        let dashboards = []
        for (let key in this.state.hystrixMetrics) {
            dashboards.push(
                <Dashboard 
                  metrics={this.state.hystrixMetrics[key]} 
                  data={ {
                    columns: [
                          ['total', ...this.state.hystrixMetrics[key].map(({metrics}) => metrics.requestCount)],
                          ['timeout', ...this.state.hystrixMetrics[key].map(({metrics}) => metrics.rollingCountTimeout)],
                          ['success', ...this.state.hystrixMetrics[key].map(({metrics}) => metrics.rollingCountSuccess)],
                          ['error', ...this.state.hystrixMetrics[key].map(({metrics}) => metrics.errorCount)],
                          ['short circuit', ...this.state.hystrixMetrics[key].map(({metrics}) => metrics.rollingCountShortCircuited)],
                        ] 
                      } 
                    }
                />)
        }
        return dashboards
    } 

    selectedServices = () => {
        return this.state.dashbaords.filter((dash) => this.state.current.includes(dash.props.metrics[0].metrics.name))
    }

    clearState = () => {
        this.setState(() => {
            return {
                hystrixMetrics: {},
                dashbaords: [],
                current: []
            }
        })
    }

    render() {
        return (
            <div>
                <div className = 'selectors'>
                    <Selectors state = {this.state} setState={(state) => this.setState(() => state)}/>
                    <button className= 'button cleatState' onClick={this.clearState}>clear dashboards</button>
                </div>
                <div className="App" style={{marginTop:'200px'}}>
                    {this.selectedServices()}
                </div>
            </div>
        );
    }
}

export default App;
