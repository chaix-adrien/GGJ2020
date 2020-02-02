import Partie from './Partie'

export default (cards, ennemis, player) => ({
    turn : 1,
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
      const card = self.partie.play(obj.card._engineCard);
      self.player.play(card.cost)
      card.play(target);
      self.event = [card, target];
      self.turn += 1;
      return true;
    },
    choice : function (obj) {
      var self = window.Engine
      self.partie.hand.push(obj[0]._engineCard)
      obj[0].spawnInto(window.Game.Hand)
    },
    end : function() {
      console.log("end")
    }
  }
)


//Engine.prototype.choixCard = function () {

//}

//Engine.prototype.next = function () {

//}
