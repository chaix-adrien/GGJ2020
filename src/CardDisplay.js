import DE from '@dreamirl/dreamengine';

export default (onPlaySpriteId = "explosion", spriteId = 'carte_1_plus', manaCost = 1, needTarget = false, Game = window.Game) => {
  const out = new DE.GameObject({
    zindex: 500,
    selected: false,
    x: 1920 / 2,
    needTarget: needTarget,
    y: 1080 / 2,
    manaCost,
    pile: Game.Picker,
    sendParticles: false,
    onPlaySpriteId: onPlaySpriteId,
    interactive: true,
    pointerdown: function (e) {
      if (Game.waitingForPick) {
        if (Game.CardPicker.getSelection().length + 1 <= Game.CardPicker.toPick) {
          this.selected ? this.deselect() : this.select()
        }
        else
          this.deselect()
      } else if (this.pile === Game.Hand)
        this.selected ? this.deselect() : this.select()

    },
    pointerout: function () {
      if (Game.waitingForPick && this.selected) return
      this.scaleTo({ x: 1, y: 1 }, 100)
      this.sendParticles = this.select && true
      if (this.selected && !Game.waitingForPick && this.needTarget)
        this.addAutomatism("createParticle", "createParticle", { interval: 50 })
    },
    pointerover: function () {
      this.scaleTo({ x: 1.2, y: 1.2 }, 100)
      this.removeAutomatism("createParticle")
    },



    select: function () {
      if (!Game.waitingForPlay && !Game.waitingForPick) return
      if (Game.waitingForPlay && !Game.Mana.canPlay(this)) return
      this.selected = true
      this.setHighlight(0.5)
      this.z = -1
      this.selectedRecently = true
      setTimeout(() => {
        this.selectedRecently = false
      }, 500)
      if (Game.waitingForPick) {
        console.log("SELECT HERE")
      } else if (this.pile === Game.Hand) {
        this.zindex = 510
        Game.selectedCard = this
        console.log("and here")
        if (this.needTarget)
          this.addAutomatism("createParticle", "createParticle", { interval: 50 })
      }
    },
    deselect: function () {
      this.z = 0
      if (Game.selectedCard !== this && !Game.waitingForPick) return
      this.selected = false
      this.setHighlight(0)
      this.scaleTo({ x: 1, y: 1 }, 100)
      this.goToDefaultPos()
      if (Game.waitingForPick) {

      } else if (this.pile === Game.Hand) {

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
      if (Game.waitingForPick) return
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

    getDefaultPos: function () {
      var out = {}
      if (this.pile === Game.Hand) {
        out = this.getHandPosition()
        out.x += Game.Hand.x
        out.y += Game.Hand.y
      } else if (this.pile === Game.Draw) {
        const min = Math.PI / 10
        const max = Math.PI / 10 * -1
        out = {
          x: Game.Draw.x,
          y: Game.Draw.y,
          rotation: Math.random() * (max - min) + min
        }
      } else if (this.pile === Game.Picker) {
        out = this.getHandPosition(Game.Picker.content.length, Game.Picker.content.indexOf(this))
        out.x += Game.Picker.x
        out.y += Game.Picker.y
      }
      return out
    },

    goToDefaultPos: function () {
      const pos = this.getDefaultPos()
      this.rotation = pos.rotation
      this.moveTo(pos, 200)
    },
    getHandPosition: function (total = Game.Hand.content.length, id = Game.Hand.content.indexOf(this)) {
      const espace = 250
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
        scale: { x: 2, y: 2 },
        updateMe: function (target) {
          this.moveTo(target, 150)
          if (Game.Pointer.isInRectBox(this, 100))
            this.askToKill()

        },
        automatisms: [
          ['fade', 'fadeOut'],
          ['updateMe', 'updateMe', { value1: Game.Pointer }],
        ],
        rotation: Math.random() * Math.PI,
        renderer: new DE.SpriteRenderer({ spriteName: 'mouseLine', scale: 1 }),
      });
      Game.scene.add(particle);
    },
    renderer: new DE.SpriteRenderer({ spriteName: spriteId, scale: 1 }),
    gameObjects: [
      new DE.GameObject({
        scale: { x: 0.95, y: 0.95 },
        alpha: 0,
        zindex: 10,
        enable: function (time) { console.log("enable", this.fade); this.fade(this.alpha, 0.5, time) },
        disable: function (time) { console.log("disable"); this.fade(this.alpha, 0, time) },
        renderer: new DE.SpriteRenderer({ spriteName: 'cardHighlight', scale: 1 })
      })
    ],
    createParticle: function () {
      this.drawLineToMouse()
    },
    // ================================ GUIGUI
    destroy: function (anim = true, direction) {
      this.deselect()
      this.interactive = false
      this.zindex = 200
      const dl = () => {
        this.zindex = 450
        if (this.pile)
          this.pile.removeCard(this)
        this.askToKill()
        Game.removeMouseListener(this.onpointermove)
      }
      return new Promise(resolve => {
        if (anim) {
          this.fade(1, 0, 500, false, () => {
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
    switchWith: function (switchWith) {
      const card1 = this
      const pile1 = this.pile
      const card2 = switchWith
      const pile2 = card2.pile
      if (pile1) {
        pile1.addCard(card2)
        pile1.goToDefaultPos()
      } else {
        pile2.removeCard(card2)
      }
      if (pile2) {
        pile2.addCard(card1)
        pile2.goToDefaultPos()
      } else {
        pile1.removeCard(card1)
      }
    },
    play: function (target) {
      return new Promise(resolve => {
        this.scaleTo({ x: 1.01, y: 1.01 }, 10000)
        this.pile.removeCard(this)
        Game.addParticle(this.onPlaySpriteId, target || this)
        if (target) {
          this.moveTo(target, 2000)
          Game.Mana.spendMana(this.manaCost)
          this.destroy()
          this.pile.goToDefaultPos()
          return resolve()
        } else {
          const toGo = { x: this.x, y: this.y - 200 }
          this.moveTo(toGo, 2000)
          Game.Mana.spendMana(this.manaCost)
          this.destroy()
          this.pile.goToDefaultPos()

          return resolve()
        }
      })
    },
    draw: function () {
      return Game.Draw.draw(this)
    },
    spawnInto: function (pile) {
      this.x = 1920 / 2
      this.y = 1080 / 2
      this.rotation = Math.PI / 10
      return new Promise(resolve => {
        pile.addCard(this, false, false)
        this.fadeIn(300, true, () => {
          this.goToDefaultPos()
          pile.goToDefaultPos()
          resolve(this)
        })
      })
    },
  })
  return out
}