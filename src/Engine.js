import Partie from './Partie'

export default (cards, ennemis, player) => ({
    turn : 0,
    player : player,
    partie : Partie(cards),
    ennemis : ennemis,
    event : [],
    getCard : function() {
      playable =  []
      this.partie.hand.forEach((elem) =>  this.player.playable(elem.cost) ? elem.playable = true : elem.playable = false );
      return this.partie.hand
    },
    giveCard : function() {
      this.getCard()
    },
    action : function (obj) {
      var self = window.Engine
      var target = obj.target._engineEnnemi;
      console.log("Obj :", obj.card._engineCard)
      const card = self.partie.play(obj.card._engineCard);
      card.play(target);
      self.event = [card, target];
      self.turn += 1;
      return true;
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
