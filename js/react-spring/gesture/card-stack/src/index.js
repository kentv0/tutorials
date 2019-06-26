import { render } from 'react-dom'
import React, { useState } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import './styles.css'

const cards = [
  'https://upload.wikimedia.org/wikipedia/en/f/f5/RWS_Tarot_08_Strength.jpg',
  'https://upload.wikimedia.org/wikipedia/en/5/53/RWS_Tarot_16_Tower.jpg',
  'https://upload.wikimedia.org/wikipedia/en/9/9b/RWS_Tarot_07_Chariot.jpg',
  'https://upload.wikimedia.org/wikipedia/en/d/db/RWS_Tarot_06_Lovers.jpg',
  'https://upload.wikimedia.org/wikipedia/en/thumb/8/88/RWS_Tarot_02_High_Priestess.jpg/690px-RWS_Tarot_02_High_Priestess.jpg',
  'https://upload.wikimedia.org/wikipedia/en/d/de/RWS_Tarot_01_Magician.jpg'
]

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = i => ({
    x: i * -20, 
    y: i * 3,
    scale: 1,
    rot: 0,
    delay: i * 100,
    opacity: 1
})
const from = i => ({
    x: 0,
    rot: 0,
    scale: 1,
    y: 0,
    opacity: 0
})
/* Perspective - defines a 3D-positioned element with perspective and defines how far it is away from the user.
 * Rotate - rotates around its X-axis, Y-axis, and Z-axis.
 * Scale - increases or decreases the size of an element. */
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

function Deck() {
  /* Returns a total and list of flagged elements; Set(0...6) {5, 4, 3, 2, 1, ...} */
  // The set flags all the cards that are flicked out
  const [gone] = useState(() => new Set())
  // Create a bunch of springs using the helpers above
  const [props, set] = useSprings(cards.length, i => ({ ...to(i), from: from(i) })) 
  /* Prop. 1: arguments (index of current targeted element) passed to bind.
   * Prop. 2: the action to respond to; returns true or false.
   * Prop. 3: returns the location of where the swipe is currently at (xy - initial).
   * Prop. 4: returns the distance from where the swipe started to where it ended.
   * Prop. 5: returns the direction of the swipe; -1 < left < 0 < right < 1
   * Prop. 6: returns the momentum / speed of the gesture (x and y axis combined). */
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useGesture(({ args: [index], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
    // If you flick hard enough it should trigger the card to fly out
    const trigger = velocity > 0.2 
    // Direction should either point left or right
    const dir = xDir < 0 ? -1 : 1 
    // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
    if (!down && trigger) gone.add(index) 
    set(i => {
      // We're only interested in changing spring-data for the current spring
      if (index !== i) return 
      const isGone = gone.has(index)
      console.log(window.innerWidth)
      // When a card is gone it flys out left or right, otherwise goes back to zero
      const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0 
      // How much the card tilts, flicking it harder makes it rotate faster
      const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0) 
       // Active cards lift up a bit 
      const scale = down ? 1.1 : 1 
      return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
    })
    if (!down && gone.size === cards.length) setTimeout(() => gone.clear() ||
        set(i => to(i)), 1600)
  })
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return props.map(({ x, y, rot, scale, opacity}, i) => (
    <animated.div key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
      {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
      <animated.div {...bind(i)} style={{ opacity, transform: interpolate([rot, scale], trans), backgroundImage: `url(${cards[i]})` }} />
    </animated.div>
  ))
}

render(<Deck />, document.getElementById('root'))

