import DE from '@dreamirl/dreamengine';
const zindexParticles = 400
export default (idSprite, toObj = { x: 1920 / 2, y: 1080 / 2 }, Game = window.Game) => {
  const obj = new DE.GameObject({
    zindex: zindexParticles,
    x: toObj.x,
    y: toObj.y,
    idSprite,
    renderer: new DE.SpriteRenderer({ spriteName: idSprite, scale: 1 }),
    _kill: function () {
      setTimeout(() => {
        this.askToKill()
      }, 300)
    },
    _fade: function () {
      this.setScale({ x: this.scale + 0.5, y: this.scale.y + 0.1 })
    },
    automatisms: [
      ["scale", "scaleTo", { value1: { x: 3, y: 3 } }],
      ["fade", "fadeOut", { value1: 500, value2: false }],
      ["kill", "_kill", { persistent: false }]
    ],
  })
  Game.scene.add(obj)
  return obj
}
