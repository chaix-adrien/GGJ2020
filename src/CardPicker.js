import DE from '@dreamirl/dreamengine';
import Card from "./Card"
export default (Game = window.Game) => new DE.GameObject({
  interactive: true,
  zindex: 800,
  x: 1920 / 2,
  y: 1080 / 2,
  updated: false,
  currentPool: [],
  pick: function (cardPool, toPick) {
    console.log("pick", cardPool, toPick)
    this.currentPool = cardPool
    cardPool.forEach(c => {
      this.isOnPicker = true
      this.addChild(c)
    })
    this.placeCardToPick()
    Game.scene.add(Game.CardPicker)
  },

  placeCardToPick: function () {
    this.currentPool.forEach((c, id) => {
      const pos = c.getHandPosition(this.currentPool.length, true, id)
      c.x = pos.x
      c.y = pos.y
    })
  },

  renderer: new DE.SpriteRenderer({ spriteName: 'backCardPicker', scale: 1 }),
});