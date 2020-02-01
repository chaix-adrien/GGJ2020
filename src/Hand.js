import DE from '@dreamirl/dreamengine';
import Card from "./Card"

export default (Game = window.Game) => new DE.GameObject({
  zindex: 500,
  x: 1920 / 2,
  y: 1080,
  interactive: false,
})
