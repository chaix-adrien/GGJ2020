function Engine(cardPool, enemi = [], player){
  this.turn = 0;
  this.cardPool = cardPool;
  this.player = player
  this.partie = new Partie(this.cardPool);
  this.partie.giveCard();
  this.enemi = enemi;
}

Engine.prototype.getCard = function() {
  playable =  []
  this.partie.hand.forEach((elem) =>  this.player.playable(elem.cost) ? elem.playable = true : elem.playable = false );
  return this.partie.hand
}

Engine.prototype.action = function (cardId, target) {
  console.log(this);
  card = this.partie.play(cardId);
  if (this.player.play(card.cost)){
      card.action(target);
      this.turn += 1;
      if (this.partie.hand.length === 0) {
        this.partie.giveCard();
      }
      return true;
  }
  return false;
}

Engine.prototype.choixCard = function () {

}

Engine.prototype.next = function () {

}


Engine.prototype.end = function() {
  if ( (this.player.is_alive() === false)   || (this.player.mana === 0 )) {
    return false;
  }
  return true;
}
