import DE from '@dreamirl/dreamengine';
import Card from "./Card"

export default (Game = window.Game) => new DE.GameObject({
  zindex: 500,
  x: 1920 / 2,
  y: 1080,
  interactive: true,
  gameObjects:
    Array.from(Array(5).keys()).map((_, id) => {
      const card = Card(id)
      const pos = card.getHandPosition(5, true)
      card.x = pos.x
      card.y = pos.y
      card.rotation = pos.rotation
      return card
    })
})
