import DE from '@dreamirl/dreamengine';

export default (spriteId = "heart", pos = { x: 0, y: 0 }, onHurtSpriteId = "explosion", maxLife = 5, Game = window.Game) => {
  const obj = new DE.GameObject({
    interactive: true,
    ...pos,
    onHurtSpriteId,
    maxLife,
    life: maxLife,
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
    hurt(damages) {
      this.life -= damages
      Game.addParticle(this.onHurtSpriteId, this || this)
      this.gameObjects.renderers[1].text = this.life + "/" + this.maxLife
    },

    kill() {
      this.fadeOut()
      this.scaleTo({ x: 1.1, y: 1.1 }, 1000)
      this.askToKill()
    },
    pointerout: function () {
      this.targeted = false
      this.scale = { x: 1, y: 1 }
      this.removeAutomatism("animTargeted")
    },
    gameObjects: [
      new DE.GameObject({
        y: -150,
        renderers: [
          new DE.RectRenderer(100, 100, '0xFFCDCD', {
            lineStyle: [4, '0x000000', 1],
            fill: true,
            x: -50,
            y: -50,
          }),
          new DE.TextRenderer('5/5', {
            textStyle: {
              fill: 'black',
              fontSize: 35,
              fontFamily: 'Snippet, Monaco, monospace',
              strokeThickness: 1,
              align: 'center',
            },
          })
        ],
      })
    ],
    renderer: new DE.SpriteRenderer({ spriteName: spriteId, scale: 1 }),
  })

  console.log("lif", obj.life + "/" + obj.maxLife)

  obj.gameObjects[0].renderers[1].text = obj.life + "/" + obj.maxLife

  window.Game.scene.add(obj)
  return obj
};