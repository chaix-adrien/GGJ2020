import DE from '@dreamirl/dreamengine';

export default (spriteId = "heart",, pos = { x: 0, y: 0 }, Game = window.Game) => {
  const obj = new DE.GameObject({
    interactive: true,
    ...pos,
    targeted: false,
    pointerover: function () {
      if (Game.selectedCard && !this.targeted && Game.selectedCard.needTarget) {
        this.targeted = true
        this.addAutomatism('animTargeted', "_animTargeted", { interval: 10, value1: this })
      }
    },
    _animTargeted: function () {
      this.shake(10, 10, 100)
      this.scale = { x: 1.2, y: 1.2 }
    },
    pointerup: function () {
      this.pointerout()
      if (Game.selectedCard && Game.waitingForPlay && Game.selectedCard.needTarget) {
        console.log("send", this)
        Game.waitingForPlay(Game.selectedCard, this)
      }
    },
    pointerout: function () {
      this.targeted = false
      this.scale = { x: 1, y: 1 }
      this.removeAutomatism("animTargeted")
    },
    renderer: new DE.SpriteRenderer({ spriteName: spriteId, scale: 1 }),
  })

  window.Game.scene.add(obj)
  return obj
};