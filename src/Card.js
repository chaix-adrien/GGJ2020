import DE from '@dreamirl/dreamengine';

export default (id, Game = window.Game) => new DE.GameObject({
  zindex: 500,
  idHand: id,
  selected: false,
  sendParticles: false,
  interactive: true,
  pointerdown: function (e) {
    console.log(Game, DE.Game)
    this.destroy()
    if (!Game.selectedCard)
      Game.select(e.target)
  },
  pointerout: function () {
    this.sendParticles = this.select && true
    if (this.selected)
      this.addAutomatism("createParticle", "createParticle", { interval: 50 })
  },
  pointerover: function () {
    this.removeAutomatism("createParticle")
  },

  createParticle: function () {
    this.drawLineToMouse()
  },

  select: function () {
    this.selected = true
    console.log(this)
    this.addAutomatism("createParticle", "createParticle", { interval: 50 })
  },
  deselect: function () {
    this.selected = false
    this.removeAutomatism("createParticle")
  },
  getHighlight: function () { return this.gameObjects[0] },
  setHighlight: function (enable, time = 200) { this.getHighlight()[enable ? "enable" : "disable"](time) },
  followMouse: function (gpos) {
    const pos = { ...gpos }
    const out = { ...gpos }
    const limitZero = 1080 - 300
    const vMouse = {
      x: (pos.x - (this.parent.x + this.x)),
      y: (pos.y - (this.parent.y + this.y)),
    }
    out.y = (this.parent.y + this.y) + vMouse.y / 5
    if (out.y < limitZero)
      out.y = limitZero
    out.x = (this.parent.x + this.x) + vMouse.x / 5
    this.moveTo(out, 100)
  },

  _deleteAnim: function (dir) {
    this.y += dir ? 1 : -1
  },

  destroy: function (direction = 1) {
    this.fade(1, 0, 1000, false, () => {
      this.askToKill()
    })
    this.addAutomatism("deleteAnim", "_deleteAnim", { interval: 100, value1: direction })
  },

  getHandPosition: function (total = this.parent.gameObjects.length, init = false) {
    const id = this.idHand
    const espace = 300
    const out = {
      rotation: parseInt(id / 2 + 0.5) * (Math.PI / 30) * (id % 2 ? - 1 : 1) + (total % 2 ? 0 : Math.PI / 30 / 2),
      x: parseInt(id / 2 + 0.5) * (espace) * (id % 2 ? - 1 : 1) + (total % 2 ? 0 : espace / 2)
      , y: 0
    }
    console.log(init)
    if (!init) {
      out.x += Game.Hand.x
      out.y = Game.Hand.y
    }
    console.log(out)
    return out
  },
  drawLineToMouse: function (start) {
    console.log("emit")
    var particle = new DE.GameObject({
      x: this.parent.x + this.x,
      y: this.parent.y + this.y - 200,
      updateMe: function (target) {
        this.moveTo(target, 150)
        if (Game.Pointer.isInRectBox(this, 100))
          this.askToKill()

      },
      automatisms: [['updateMe', 'updateMe', { value1: Game.Pointer }]],

      /*              pointerover: function () {
                      this.updatable = false
                      this.interactive = false
                      this.askToKill()
                    },*/
      rotation: Math.random() * Math.PI,
      renderer: new DE.SpriteRenderer({ spriteName: 'particle', scale: 1 }),
    });
    Game.scene.add(particle);
  },
  renderer: new DE.SpriteRenderer({ spriteName: 'card', scale: 1 }),
  gameObjects: [
    new DE.GameObject({
      zindex: 460,
      alpha: 0,
      enable: function (time) { this.fade(this.alpha, 0.5, time) },
      disable: function (time) { this.fade(this.alpha, 0, time) },
      renderer: new DE.SpriteRenderer({ spriteName: 'cardHighlight', scale: 1 })
    })
  ]
})