import React, { useState } from 'react'
import { render } from 'react-dom'
import { useTrail, animated } from 'react-spring'
import './styles.css'
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

const items = [
{name: 'Home', link: '/'},
{name: 'Industry', link: '/industry'},
{name: 'Projects', link: '/projects'},
{name: 'Academia', link: '/academia'},
{name: 'Studio', link: '/studio'},
{name: 'Contact', link: '/contact'}]

const config = { mass: 10, tension: 2000, friction: 200 }

function App() {
//  const [toggle, set] = useState(true)
  const trail = useTrail(items.length, {
    config,
    opacity: 1,
    from: { opacity: 0 },
  })

  return (
  <HashRouter>
    <div className="trails-main" >
      <div>
        {trail.map(({ ...rest }, index) => (
          <animated.div
            key={items[index]}
            className="trails-text"
            style={{ ...rest }}>
                <ul>
                    <li><NavLink exact to={items[index].link}>{items[index].name}</NavLink></li>
                </ul>
          </animated.div>
        ))}
      </div>
    </div>
    </HashRouter>
  )
}

render(<App />, document.getElementById('root'))

