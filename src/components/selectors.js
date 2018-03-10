import React from 'react'
import { push as Menu } from 'react-burger-menu'

const Selctors = (props) => {

    const createSelectors = () => {
        let services = Object.keys(props.state.hystrixMetrics)
        return [<button className= 'button cleatState' onClick={props.clearState}>clear dashboards</button>]
        .concat(
            services.map(service => {
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
        )
    }
    
    return <Menu pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" }>{createSelectors()}</Menu>
}

export default Selctors;