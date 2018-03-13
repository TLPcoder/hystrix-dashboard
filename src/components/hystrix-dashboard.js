import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
import Dashboard from './dashboard'
import Selectors from './selectors'

class HystrixDashboard extends Component {
    constructor(props){
        super(props)
        this.state = {
          hystrixMetrics: {},
          dashboards: {},
          current: [],
          view: 'dashboard'
        }
    }
    componentDidMount = () => {
        let source = this.props.source || 'http://localhost:3000/hystrixStream'
        let stream = new EventSource(source);

        stream.onopen = () => {
            console.log('open')  
        };

        stream.onmessage = (e) => {
            let json = JSON.parse(e.data)
            let commandMetrics = this.state.hystrixMetrics[json.name]

            if (commandMetrics){
                let newState = this.cleanState(json.name)
                newState.push({metrics: json, date: Date.now()})
                this.setState(() => {
                  return {
                    hystrixMetrics: {...this.state.hystrixMetrics, [json.name]: newState},
                    dashboards: {...this.state.dashboards, [json.name]: this.createDashboards(json.name)}
                  }
                })
            } else {
                let newState = [{metrics: json, date: Date.now()}]
                this.setState(() => {
                  return {
                    hystrixMetrics: {...this.state.hystrixMetrics, [json.name]: newState},
                    dashboards: {...this.state.dashboards, [json.name]: this.createDashboards(json.name)}
                  }
                })
            }
          }
        stream.onerror = () => {
            console.log("EventSource failed.");
        };
    }

    changeView = (event) => {
        let view = this.state.view === 'dashboard' ? 'dashboard1' : 'dashboard'
        this.setState({view: view})
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

    createDashboards = (service) => {
        if(this.state.hystrixMetrics[service]){
            return <Dashboard view={this.state.view}  current={this.state.current} metrics={this.state.hystrixMetrics[service]} 
                data={
                        [
                            ['total', ...this.state.hystrixMetrics[service].map(({metrics}) => metrics.requestCount)],
                            ['timeout', ...this.state.hystrixMetrics[service].map(({metrics}) => metrics.rollingCountTimeout)],
                            ['success', ...this.state.hystrixMetrics[service].map(({metrics}) => metrics.rollingCountSuccess)],
                            ['error', ...this.state.hystrixMetrics[service].map(({metrics}) => metrics.errorCount)],
                            ['short circuit', ...this.state.hystrixMetrics[service].map(({metrics}) => metrics.rollingCountShortCircuited)],
                        ] 
                    }/>
        }        
    } 

    selectedServices = () => {
        let services = [];
        Object.keys(this.state.dashboards).forEach(dashName => {
            if(this.state.current.includes(dashName)){
                services.push(this.state.dashboards[dashName])
            }
        })
        return services
    }

    clearState = () => {
        this.setState(() => {
            return {
                hystrixMetrics: {},
                dashboards: {},
                current: []
            }
        })
    }

    render() {

        let dashboards = this.selectedServices()
        return (
            <div id='outer-container'>
                <div className = 'selectors'>
                    <Selectors state = {this.state} clearState={this.clearState} setState={(state) => this.setState(() => state)}/>
                    <button className='button viewButton' onClick={this.changeView}>view</button>
                </div>
                <div id='page-wrap'>
                    {dashboards}
                </div>
            </div>
        );
    }
}

export default HystrixDashboard;
