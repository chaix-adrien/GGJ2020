

function Partie(card, handSize = 10) {

  this.deck = card;
  this.hand = [];
  this.handSize = handSize;
  this.drawSize = 4;
};

Partie.prototype.addCard = function(card){
  this.deck.push(card);
  return this.deck.length;
}

Partie.prototype.shuffleDraw = function (){
  this.deck.sort(() => Math.random() - 0,5);
};

Partie.prototype.draw = function () {
  if (this.deck.length === 0) {
    return ;
  }
  card = this.deck.pop();
  this.hand.push(card);
};

Partie.prototype.giveCard = function () {
  i = 0;
  this.shuffleDraw();
  while (i < this.drawSize) {
    this.draw();
    i++;
  }
};

Partie.prototype.play = function(cardId){
  const card = this.hand[cardId];
  this.hand = this.hand.filter(c => c !== card);
  this.deck.push(card);
  return card;
};
