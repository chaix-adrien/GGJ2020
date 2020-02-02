

export default (card, handSize = 10) => ({
  deck : card,
  hand : [],
  handSize :handSize,
  drawSize : 4,
  addCard : function(card){
    this.deck.push(card);
    return this.deck.length;
  },
  huffleDraw : function (){
    this.deck.sort(() => Math.random() - 0,5);
  },
  shuffleDraw : function (){
    this.deck.sort(() => Math.random() - 0,5);
  },
  draw : function () {
    if (this.deck.length === 0) {
      return ;
    }
    card = this.deck.pop();
    this.hand.push(card);
  },
  giveCard : function () {
    i = 0;
    this.shuffleDraw();
    while (i < this.drawSize) {
      this.draw();
      i++;
    }
  },
  play : function(cardId){
    const card = this.hand[cardId];
    this.hand = this.hand.filter(c => c !== card);
    this.deck.push(card);
    return card;
  }

})