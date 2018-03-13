import React, {Component} from 'react';
import Chart from './chart'

const Dashboard = (props) => {

    const circuitStatus = () => value('isCircuitBreakerOpen')

    const totalCount = (key) => props.metrics.reduce((total, {metrics}) => total + metrics[key], 0)

    const requestRate = (key) => {
        return Math.max(...props.metrics.map(({metrics}) => metrics[key]))
    }

    const value = (key) => props.metrics[props.metrics.length - 1].metrics[key]

    return (
        <div className={props.view}>
            <h3 className='serviceName'>{value('name')}</h3>
            <ul className='metrics'>
                <li style = {{color: circuitStatus() ? 'red' : 'black'}}>opened</li>
                <li style = {{color: circuitStatus() ? 'black' : 'green'}}>closed</li>
                <br/>
                <li>request: {requestRate('requestCount')}</li>
                <li>errors: {requestRate('errorCount')}</li>
                <li>errors%: {parseInt(requestRate('errorCount') / requestRate('requestCount') * 100) || 0}</li>
                <li>request/s {requestRate('requestCount') / (value('windowLength') / 1000)}</li>
                <br/>
                <ul>
                    <li>latency</li>
                    <li>mean: {Math.floor(value('latencyExecute_mean'))}</li>
                    <li>75: {Math.floor(value('latencyExecute')['75'])}</li>
                    <li>90: {Math.floor(value('latencyExecute')['90'])}</li>
                    <li>99: {Math.floor(value('latencyExecute')['99'])}</li>
                </ul>
            </ul>
            <Chart className='chart' current={props.current} name={value('name')} data={props.data}/>
        </div>
    )
}

export default(Dashboard)