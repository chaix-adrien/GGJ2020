function Engine(cardPool){
  this.turn = 0;
  this.cardPool = cardPool;
  console.log(this.cardPool)
  this.player = new Personnage("carlito", 30, 5);
  this.partie = new Partie(this.cardPool);
  this.partie.giveCard();
}

Engine.prototype.getCard = function() {
  playable =  []
  this.partie.hand.forEach((elem) =>  this.player.playable(elem.cost) ? elem.playable = true : elem.playable = false );
  return this.partie.hand
}

Engine.prototype.action = function (cardId, target) {
  card = this.partie.play(cardId);
  if (this.player.play(card.cost)){
      card.action(target);
  }

}

Engine.prototype.end = function() {
  if ( (this.player.is_alive() === false)   || (this.player.mana === 0 )) {
    return false;
  }
  return true;
}
