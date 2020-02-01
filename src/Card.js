import DE from '@dreamirl/dreamengine';

export default (id, Game = window.Game) => new DE.GameObject({
  zindex: 500,
  idHand: id,
  selected: false,
  isOnPicker: false,
  sendParticles: false,
  interactive: true,
  pointerdown: function (e) {
    if (this.isOnPicker) {
      console.log(this.selected)
      this.selected ? this.deselect() : this.select()
    } else if (!Game.selectedCard)
      this.select()
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
    this.zindex = 510
    this.z = -1
    this.setHighlight(0.5)
    if (this.isOnPicker) {
      //this.addAutomatism("pickerSelectAnim", "_pickerSelectAnim")
    } else {
      Game.selectedCard = this
      this.addAutomatism("createParticle", "createParticle", { interval: 50 })
    }
  },
  deselect: function () {
    console.log("deselectme")
    if (Game.selectedCard !== this && !this.isOnPicker) return
    this.selected = false
    this.zindex = 500
    this.z = 0
    this.setHighlight(0)
    this.removeAutomatism("createParticle")
    this.removeAutomatism("pickerSelectAnim")
    if (!this.isOnPicker) {
      Game.selectedCard = null
    }
  },
  init: function () {
    Game.addMouseListener(this, this.onpointermove)
  },
  getHighlight: function () { return this.gameObjects[0] },
  setHighlight: function (enable, time = 200) { this.getHighlight()[enable ? "enable" : "disable"](time) },
  automatisms: [["init", "init", { persistent: false }]],
  onpointermove: function (that, gpos) {
    if (this.isOnPicker) return
    if (!that.selected) return
    const pos = { ...gpos }
    const out = { ...gpos }
    const limitZero = 1080 - 300
    const vMouse = {
      x: (pos.x - (that.parent.x + that.x)),
      y: (pos.y - (that.parent.y + that.y)),
    }
    out.y = (that.parent.y + that.y) + vMouse.y / 5
    if (out.y < limitZero)
      out.y = limitZero
    out.x = (that.parent.x + that.x) + vMouse.x / 5
    that.moveTo(out, 100)
  },

  _deleteAnim: function (dir) {
    this.y += !dir ? 1 : -1
    this.z -= 0.1
  },
  destroy: function (anim = true, direction) {
    this.deselect()
    const dl = () => {
      this.askToKill()
      Game.removeMouseListener(this.onpointermove)
    }
    return new Promise(resolve => {
      if (anim) {
        this.fade(1, 0, 1000, false, () => {
          dl()
          resolve()
        })
        this.addAutomatism("deleteAnim", "_deleteAnim", { interval: 5, value1: direction })
      } else {
        setTimeout(resolve, 1000)
        dl()
      }
    })
  },
  getHandPosition: function (total = this.parent.gameObjects.length, init = false, id = this.idHand) {
    const espace = 350
    const out = {
      rotation: parseInt(id / 2 + 0.5) * (Math.PI / 30) * (id % 2 ? - 1 : 1) + (total % 2 ? 0 : Math.PI / 30 / 2),
      x: parseInt(id / 2 + 0.5) * (espace) * (id % 2 ? - 1 : 1) + (total % 2 ? 0 : espace / 2)
      , y: 0
    }
    if (!init) {
      out.x += Game.Hand.x
      out.y = Game.Hand.y
    }
    return out
  },
  drawLineToMouse: function (start) {
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
      alpha: 0,
      enable: function (time) { console.log("enable", this.fade); this.fade(this.alpha, 0.5, time) },
      disable: function (time) { console.log("disable"); this.fade(this.alpha, 0, time) },
      renderer: new DE.SpriteRenderer({ spriteName: 'cardHighlight', scale: 1 })
    })
  ]
})