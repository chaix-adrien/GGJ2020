function Engine(cardPool){
  this.turn = 0;
  this.cardPool = cardPool;
  console.log(this.cardPool)
  this.player = new Personnage("carlito", 30, 70);
  this.partie = new Partie(this.cardPool);
  this.partie.giveCard();
}

Engine.prototype.getPlayableCard = function() {
  playable =  []
  this.partie.hand.forEach((elem) => this.player.playable(elem) ? playable.push(elem) : null );
  return playable;

}

Engine.prototype.getCard  = function () {
  return this.partie.hand;
}

Engine.prototype.action = function (cardId, target) {
  card = this.partie.play(cardId);
}

Engine.prototype.end = function() {
  if ( (this.player.is_alive() === false)   || (this.player.mana === 0 )) {
    return false;
  }
  return true;
}
