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
        Game.waitingForPlay(Game.selectedCard, this)
      }
    },
    hurt: function (damages) {
      this.life -= damages
      Game.addParticle(this.onHurtSpriteId, this || this)
      this.gameObjects[0].renderers[1].text = this.life + "/" + this.maxLife
    },

    kill: function () {
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
          new DE.RectRenderer(120, 80, '0x8252a5', {
            lineStyle: [4, '0x000000', 1],
            fill: true,
            x: -60,
            y: -40,
          }),
          new DE.TextRenderer('5/5', {
            textStyle: {
              fill: 'white',
              fontSize: 35,
              fontWeight: "bold",
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

  obj.gameObjects[0].renderers[1].text = obj.life + "/" + obj.maxLife

  window.Game.scene.add(obj)
  return obj
};