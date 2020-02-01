import DE from '@dreamirl/dreamengine';

export default (Game = window.Game) => new DE.GameObject({
  interactive: true,
  x: 200,
  y: 200,
  gameObjects: [
    new DE.GameObject({
      interactive: true,
      x: 0,
      y: 0,
      targeted: false,
      targeted: false,
      pointerover: function () {
        if (Game.selectedCard && !this.targeted) {
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
        if (Game.selectedCard && Game.waitingForPlay) {
          console.log("send", this)
          Game.waitingForPlay(Game.selectedCard, this)
        }
      },
      pointerout: function () {
        this.targeted = false
        this.scale = { x: 1, y: 1 }
        this.removeAutomatism("animTargeted")
      },
      renderer: new DE.SpriteRenderer({ spriteName: 'heart', scale: 1 }),
    })
  ]
});