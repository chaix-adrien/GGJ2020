import DE from '@dreamirl/dreamengine';

export default (Game = window.Game) => new DE.GameObject({
  interactive: true,
  x: 200,
  y: 200,
  targeted: false,
  pointerover: function () {
    if (Game.selectedCard && !this.targeted) {
      this.targeted = true
      this.addAutomatism('animTargeted', "_animTargeted", { interval: 10, value1: this })
    }
  },
  pointerup: function () {
    console.log(Game.waitingForPlay)
    this.pointerout()
    if (Game.selectedCard && Game.waitingForPlay) {
      Game.waitingForPlay(Game.selectedCard)
    }
  },
  pointerout: function () {
    this.targeted = false
    this.scale = { x: 1, y: 1 }
    this.removeAutomatism("animTargeted")
  },
  _animTargeted: function () {
    this.shake(10, 10, 100)
    this.scale = { x: 1.2, y: 1.2 }
  },

  renderer: new DE.SpriteRenderer({ spriteName: 'heart', scale: 1 }),
});