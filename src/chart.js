import React, {Component} from 'react';
import C3Chart from 'react-c3js';
import 'c3/c3.css'

const Chart = (props) => {
    return (
        <C3Chart style={{
                width: '80%',
                float: 'right'
            }}data={props.data}/>
    )
}

export default(Chart)