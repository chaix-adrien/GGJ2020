import DE from '@dreamirl/dreamengine';
import Card from "./Card"
const textSelectNumber = new DE.TextRenderer('', {
  textStyle: {
    fill: 'black',
    fontSize: 35,
    fontFamily: 'Snippet, Monaco, monospace',
    strokeThickness: 1,
    align: 'center',
  },
})

export default (Game = window.Game) => new DE.GameObject({
  interactive: true,
  zindex: 800,
  x: 1920 / 2,
  y: 1080 / 2,
  updated: false,
  currentPool: [],
  toPicl: 0,
  getSelection: function () {
    return this.currentPool.filter(c => c.selected)
  },
  pick: function (cardPool, toPick) {
    console.log("pick", cardPool, toPick)
    this.currentPool = cardPool
    this.toPick = toPick
    console.log(textSelectNumber)
    textSelectNumber.text = "Selectionnez " + toPick + " carte" + (toPick > 1 ? "s" : "")
    //this.renderers[1].text = toPick
    cardPool.forEach(c => {
      c.isOnPicker = true
      this.addChild(c)
    })
    this.placeCardToPick()
    Game.scene.add(Game.CardPicker)
  },
  validate: function () {
    if (!Game.waitingForPick) return
    if (this.getSelection().length !== this.toPick) return
    this.toPick = 0
    this.currentPool = []
    const selection = this.getSelection()
    Game.scene.remove(Game.CardPicker)
    Game.waitingForPick(selection)
  },

  placeCardToPick: function () {
    this.currentPool.forEach((c, id) => {
      const pos = c.getHandPosition(this.currentPool.length, true, id)
      c.x = pos.x
      c.y = pos.y
    })
  },

  gameObjects: [
    new DE.GameObject({
      y: 400,
      zindex: 1000,
      interactive: true,
      hitArea: new DE.PIXI.Rectangle(-225, -50, 450, 100),
      cursor: 'pointer',
      renderers: [
        new DE.RectRenderer(500, 80, '0xFFCDCD', {
          lineStyle: [4, '0x000000', 1],
          fill: true,
          x: -250,
          y: -40,
        }),
        new DE.TextRenderer('Valider la sélection', {
          textStyle: {
            fill: 'black',
            fontSize: 35,
            fontFamily: 'Snippet, Monaco, monospace',
            strokeThickness: 1,
            align: 'center',
          },
        }),
      ],
      pointerover: function () {
        this.renderer.updateRender({
          color: Game.moveCamera ? '0xDEFFDE' : '0xFFDEDE',
        });
      },
      pointerout: function () {
        this.renderer.updateRender({
          color: Game.moveCamera ? '0xCDFFCD' : '0xFFCDCD',
        });
      },
      pointerdown: function () {
        this.renderer.updateRender({
          color: Game.moveCamera ? '0x00FF00' : '0xFF0000',
        });
      },
      pointerup: function () {
        this.parent.validate()
      },
    }),
    new DE.GameObject({
      y: -400,
      zindex: 1000,
      interactive: true,
      hitArea: new DE.PIXI.Rectangle(-225, -50, 450, 100),
      cursor: 'pointer',
      renderers: [
        new DE.RectRenderer(500, 80, '0xFFCDCD', {
          lineStyle: [4, '0x000000', 1],
          fill: true,
          x: -250,
          y: -40,
        }),
        textSelectNumber
      ],
    })
  ],
  renderer: new DE.SpriteRenderer({ spriteName: 'backCardPicker', scale: 1 }),
});