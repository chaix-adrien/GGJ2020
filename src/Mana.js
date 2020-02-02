import DE from '@dreamirl/dreamengine';
const textMana = new DE.TextRenderer('', {
  textStyle: {
    fill: 'white',
    fontSize: 100,
    fontWeight: "bold",
    fontFamily: 'Snippet, Monaco, monospace',
    strokeThickness: 1,
    align: 'center',
  },
})

export default (maxMana = 5, Game = window.Game) => new DE.GameObject({
  x: 1750,
  y: 200,
  maxMana,
  manaPool: maxMana,
  spendMana: function (ammount) {
    console.log("SPEND", ammount)

    if (this.manaPool - ammount >= 0) {
      this.setMana(this.manaPool - ammount)
      return true
    }
    return false
  },
  setMana: function (to) {
    this.manaPool = to
    textMana.text = to
  },
  reset: function () {
    this.setMana(this.maxMana)
  },
  canPlay: function (card) {
    return this.manaPool >= card.manaCost
  },
  renderer: new DE.SpriteRenderer({ spriteName: "point_mana", scale: 1 }),
  gameObjects: [
    new DE.GameObject({
      x: 50, y: -50,
      renderers: [
        textMana
      ],
    }),
  ],
});