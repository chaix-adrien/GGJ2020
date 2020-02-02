import DE from '@dreamirl/dreamengine';
const textMana = new DE.TextRenderer('', {
  textStyle: {
    fill: 'black',
    fontSize: 35,
    fontFamily: 'Snippet, Monaco, monospace',
    strokeThickness: 1,
    align: 'center',
  },
})

export default (maxMana = 5, Game = window.Game) => new DE.GameObject({
  x: 120,
  y: 1080 - 120,
  maxMana,
  manaPool: maxMana,
  spendMana: function (ammount) {
    if (this.manaPool - ammount >= 0) {
      this.setMana(this.manaPool - ammount)
      return true
    }
    return false
  },
  setMana: function (to) {
    this.manaPool = to
    textMana.text = to + "/" + this.maxMana
  },
  reset: function () {
    this.setMana(this.maxMana)
  },
  canPlay: function (card) {
    return this.manaPool >= card.manaCost
  },
  renderers: [
    new DE.RectRenderer(100, 100, '0xFFCDCD', {
      lineStyle: [4, '0x000000', 1],
      fill: true,
      x: -50,
      y: -50,
    }),
    textMana
  ],
});