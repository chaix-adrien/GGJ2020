import DE from '@dreamirl/dreamengine';

export default (key, pos = { x: 1920 / 2, y: 1080 / 2 }, Game = window.Game) => {
  return new DE.GameObject({
    zindex: 500,
    ...pos,
    key: key,
    content: [],
    addCard: function (card, last = true, anim = true) {
      if (card.pile === this || !card) return
      Game.scene.add(card)
      if (card.pile)
        card.pile.removeCard(card)
      console.log("add card to pile", key)
      card.pile = this
      last ? this.content.unshift(card) : this.content.push(card)

      if (anim)
        card.goToDefaultPos()
    },
    goToDefaultPos: function () {
      this.content.forEach(c => c.goToDefaultPos())
    },
    draw: function (card) {
      return new Promise(resolve => {
        Game.Hand.addCard(card, false)
        Game.Hand.goToDefaultPos()
      })
    },
    switchCards: function (card1, card2) {
      const pile1 = card1.pile
      const pile2 = card2.pile
      if (!pile1 && !pile2) return
      pile1.addCard(card2)
      pile2.addCard(card1)
      pile1.goToDefaultPos()
      pile2.goToDefaultPos()
    },
    removeCard: function (card, anim = true) {
      if (card && card.pile === this) {
        card.pile = this
        this.content = this.content.filter(c => c !== card)
      }
    }
  })
}
