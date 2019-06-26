import { render } from 'react-dom'
import React, { useRef } from 'react'
import clamp from 'lodash-es/clamp'
import { useSprings, animated } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import './styles.css'

const pages = [
  'https://images.pexels.com/photos/62689/pexels-photo-62689.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/296878/pexels-photo-296878.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
]

function Viewpager() {
  /* The index of the current element in the list. */
  const index = useRef(0)
  const [props, set] = useSprings(pages.length, i => ({ x: i * window.innerWidth, sc: 1, display: 'block' }))
  /* Prop. 1: the action to respond to; returns true or false.
   * Prop. 2: returns the location of where the swipe is currently at (xy - initial).
   * Prop. 3: returns the direction of the swipe; -1 < left < 0 < right < 1
   * Prop. 4: returns the distance from where the swipe started to where it ended.
   * Prop. 5: function to interrupt the action. */
  const bind = useGesture(({ down, delta: [xDelta], direction: [xDir], distance, cancel }) => {
    /* window.innerWidth is the width size of the current window. */
    if (down && distance > window.innerWidth / 2)
      /* Clamps number within lower and upper bounds; returns the clamped number.
       * Prop. 1: the number to clamp.
       * Prop. 2: the lower bound.
       * Prop. 3: the upper bound. */
      cancel((index.current = clamp(index.current + (xDir > 0 ? -1 : 1), 0, pages.length - 1)))
    set(i => {
      /* Displays element at current index only and 'none' for all others. */
      if (i < index.current - 1 || i > index.current + 1) return { display: 'none' }
      /* Determines the location width (x) of the element to transform and
       * move (left-and-right) to when swiped; used for `transform: ${x}px, 0, 0` */
      const x = (i - index.current) * window.innerWidth + (down ? xDelta : 0)
      /* Scale elements as they are being swiped away. */
      const sc = down ? 1 - distance / window.innerWidth / 2 : 1
      /* Display block takes up the whole width. */
      return { x, sc, display: 'block' }
    })
  })
  return props.map(({ x, display, sc }, i) => (
    <animated.div {...bind()} key={i} style={{ display, transform: x.interpolate(x => `translate3d(${x}px,0,0)`) }}>
      <animated.div style={{ transform: sc.interpolate(s => `scale(${s})`), backgroundImage: `url(${pages[i]})` }} />
    </animated.div>
  ))
}

render(<Viewpager />, document.getElementById('root'))

