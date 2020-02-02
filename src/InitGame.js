import CardDisplay from './CardDisplay'
import Engine from './Engine'
import Card from './Card'
import Player from './Player'
import GameLoop from './GameLoop'
import Event from './Event'


export default () => ({
    confCard : [
    {
      "name": "coup de poing",
      "description": "inflige 1 point de degat",
      "action": (target) => target.getDammage(1),
      "cost": 5
    },
  ],
  action : {
    "play": (cardId, target) => Promise.resolve(cardId, target)
  },
  confEvent: [
    {
    "name": "choix de carte",
    "validation": (engine) => engine.turn % 2 === 0,
    "callback": engine => (console.log("choix de carte"))
  },
  {
    "name": "tour",
    "validation": (engine) => engine.player.is_alive(),
    "callback": (engine) => new Promise(5, "play", [], (cardId, target) => engine.action(cardId, target)),
  }
  ],
  init : function () {
    this.initCard()
    this.initLoop()
    this.initEvent()

  },
  initEvent : function(){
    this.events = []
    this.confEvent.forEach(elem => this.events.push(Event(elem["name"],
    elem["validation"],
    elem["callback"])));
  },
  initCard :function (){
    this.cards = []
    var id = 0;
    console.log("OK")
    this.confCard.forEach(elem  => {this.cards.push(new Card(elem["name"],
    elem["description"],
    elem["action"], elem["cost"], CardDisplay() )); id += 1;})
  },

  initLoop : function (){
    console.log("--------------")
    this.player =  Player("carlito", 30, 5);
    console.log(this.player)
    this.engine = Engine(this.cards, [], this.player);
    console.log(this.engine)
  }
})
