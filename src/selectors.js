import React from 'react'

const Selctors = (props) => {

    const createSelectors = () => {
        let services = Object.keys(props.state.hystrixMetrics)
        return services.map(service => {
          return <button className='button' value={service} onClick={(event) => {
                let current = [...props.state.current]
                if (current.includes(event.target.value)) {
                    let index = current.indexOf(event.target.value)
                    event.target.style.backgroundColor = 'white'
                    event.target.style.color = '#0F6CA4'
                    current.splice(index, 1)
                    props.setState({current})
                } else {
                    event.target.style.backgroundColor = '#0F6CA4'
                    event.target.style.color = 'white'
                    current.push(event.target.value)
                    props.setState({current})
                }
            }}>{service}</button>  
        })
    }
    
    return <div>{createSelectors()}</div>
}

export default Selctors;