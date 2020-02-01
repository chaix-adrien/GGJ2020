import DE from '@dreamirl/dreamengine';
import ParticleDisplay from "./ParticleDisplay"

export default (Game = window.Game) => {
  const out = new DE.GameObject({
    zindex: 500,
    selected: false,
    pile: Game.Picker,
    sendParticles: false,
    onPlaySpriteId: "heart",
    interactive: true,
    pointerdown: function (e) {
      if (this.pile === Game.Picker) {
        if (Game.CardPicker.getSelection().length + 1 <= Game.CardPicker.toPick) {
          console.log("is selected", !this.selected)
          this.selected ? this.deselect() : this.select()
        }
        else
          this.deselect()

      } else if (!Game.selectedCard)
        this.select()
    },
    pointerout: function () {
      if (this.pile === Game.Picker && this.selected) return
      this.scaleTo({ x: 1, y: 1 }, 100)
      this.sendParticles = this.select && true
      if (this.selected)
        this.addAutomatism("createParticle", "createParticle", { interval: 50 })
    },
    pointerover: function () {
      this.scaleTo({ x: 1.2, y: 1.2 }, 100)
      this.removeAutomatism("createParticle")
    },

    createParticle: function () {
      this.drawLineToMouse()
    },

    select: function () {
      this.selected = true
      this.setHighlight(0.5)
      this.z = -1
      if (this.pile === Game.Picker) {

      }
      if (this.pile === Game.Hand) {
        this.zindex = 510
        Game.selectedCard = this
        this.addAutomatism("createParticle", "createParticle", { interval: 50 })
      }
    },
    deselect: function () {
      console.log("deselectme")
      if (Game.selectedCard !== this && this.pile !== Game.Picker) return
      this.selected = false
      this.z = 0
      this.setHighlight(0)
      if (this.pile === Game.Picker) {

      }
      if (this.pile === Game.Hand) {

        this.zindex = 500
        this.removeAutomatism("createParticle")
        this.removeAutomatism("pickerSelectAnim")
        Game.selectedCard = null
      }
    },
    init: function () {
      Game.addMouseListener(this, this.onpointermove)
    },
    getHighlight: function () { return this.gameObjects[0] },
    setHighlight: function (enable, time = 200) {
      if (this.getHighlight())
        this.getHighlight()[enable ? "enable" : "disable"](time)
    },
    automatisms: [["init", "init", { persistent: false }]],
    onpointermove: function (that, gpos) {
      if (!that.pile) return
      if (that.pile === Game.Picker) return
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
      this.zindex = 450
      const dl = () => {
        this.zindex = 450

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

    goToDefaultPos: function () {
      if (this.pile === Game.Hand) {
        const pos = this.getHandPosition()
        pos.x += Game.Hand.x
        pos.y += Game.Hand.y
        this.rotation = pos.rotation
        this.moveTo(pos, 200)
      } else if (this.pile === Game.Draw) {
        this.moveTo(this.pile, 200)
      } else if (this.pile === Game.Picker) {
        const pos = this.getHandPosition(Game.Picker.content.length, Game.Picker.content.indexOf(this))
        pos.x += Game.Picker.x
        pos.y += Game.Picker.y
        this.rotation = pos.rotation
        this.moveTo(pos, 200)
      }

    },

    play: function (target) {
      return new Promise(resolve => {
        if (target) {
          this.moveTo(target, 2000)
          this.scaleTo({ x: 1.01, y: 1.01 }, 10000)
          this.pile.removeCard(this)
          Game.addParticle(this.onPlaySpriteId, target)
          this.destroy()
          this.pile.goToDefaultPos()

          return resolve()
        }
      })
    },

    getHandPosition: function (total = Game.Hand.content.length, id = Game.Hand.content.indexOf(this)) {
      console.log("getHAndppos", total, id)
      const espace = 350
      const out = {
        rotation: parseInt(id / 2 + 0.5) * (Math.PI / 30) * (id % 2 ? - 1 : 1) + (total % 2 ? 0 : Math.PI / 30 / 2),
        x: parseInt(id / 2 + 0.5) * (espace) * (id % 2 ? - 1 : 1) + (total % 2 ? 0 : espace / 2)
        , y: 0
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
  Game.scene.add(out)
  return out
}