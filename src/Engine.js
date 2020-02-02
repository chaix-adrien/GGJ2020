import Partie from './Partie'

export default (cards, enemi = [], player) => ({
    turn : 0,
    player : player,
    partie : Partie(cards),
    enemi : enemi,
    event : [],
    getCard : function() {
      playable =  []
      this.partie.hand.forEach((elem) =>  this.player.playable(elem.cost) ? elem.playable = true : elem.playable = false );
      return this.partie.hand
    },
    action : function (cardId, target) {
    this.event = [];
      card = this.partie.play(cardId);
      if (this.player.play(card.cost)){
          card.action(target);
          this.event = [card, target];
          this.turn += 1;
          if (this.partie.hand.length === 0) {
            this.partie.giveCard();
          }
          return true;
      }
      return false;
    },
    end : function() {
      if ( (this.player.is_alive() === false)   || (this.player.mana === 0 )) {
        return false;
      }
      return true;
    }
  }
)


//Engine.prototype.choixCard = function () {

//}

//Engine.prototype.next = function () {

//}
