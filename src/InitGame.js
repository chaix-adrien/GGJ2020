import CardDisplay from './CardDisplay'
import Engine from './Engine'
import Card from './Card'
import Player from './Player'
import GameLoop from './GameLoop'
import Event from './Event'
import PromiseParam from './PromiseParam'

const validDraw = (engine) => {
  return engine.partie.hand.length === 0
}

import Computer from './Computer'

export default () => ({
    confCard : [
    {
      "name": "coup de poing",
      "description": "inflige 1 point de degat",
      "action": (target) => target.getDammage(1),
      "cost": 5,
      "png": "explosion",
    },
  ],
  action : {
    "handChoice": (objs, nb) => window.Game.waitCardPicker(objs, nb, window.game.Hand),
    "choice": (objs, nb) => window.Game.waitCardPicker(objs, nb),
    "play": () => window.Game.waitForCardPlay(),
    "None": (engine) => Promise.resolve(engine)
  },
  confEvent: [
    {
    "name": "choix de carte",
    "validation": (engine) => engine.turn % 2 === 0,
    "callback": () => (console.log("choix de carte"))
  },
  {
    "name": "tour",
    "validation": (engine) => engine.player.is_alive(),
    "callback":  () => PromiseParam(5, "play", [], window.Engine.action)
  },
  {
    "name": "draw",
    "validation": validDraw,
    "callback": () =>  PromiseParam(8, "None", [], () => {window.Engine.partie.giveCard()})
  },
  {
    "name": "centralunite",
    "validation": (engine) => engine.ennemis.centralunite.validation,
    "callback": (engine) =>  PromiseParam(2, "None", [engine], engine.ennemis.centralunite.action),
  },
  {
    "name": "screen",
    "validation": (engine) => engine.ennemis.screen.validation,
    "callback": (engine) =>  PromiseParam(2, "None", [engine], engine.ennemis.screen.action),
  },
  {
    "name": "keyboard",
    "validation": (engine) => engine.ennemis.keyboard.validation,
    "callback": (engine) =>  PromiseParam(2, "None", [engine], engine.ennemis.keyboard.action),
  },
  {
    "name": "mouse",
    "validation": (engine) => engine.ennemis.mouse.validation,
    "callback": (engine) =>  PromiseParam(2, "None", [engine], engine.ennemis.mouse.action),
  },
  {
    "name": "computer",
    "validation": (engine) => engine.ennemis.validation,
    "callback": (engine) =>  PromiseParam(2, "None", [engine], engine.ennemis.delete),
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
    this.confCard.forEach(elem  => {
      var gameObj = CardDisplay(elem["png"])
      var cd = Card(elem["name"],
      elem["description"],
      elem["action"], elem["cost"],
       gameObj)
       cd.init()
       this.cards.push(cd)
       gameObj.spawnInto(window.Game.Draw)
       })
  },

  initLoop : function (){
    this.player =  Player("carlito", 30, 5);
    this.engine = Engine(this.cards, [], this.player);
    window.Engine = this.engine
    var ennemis = Computer()
    ennemis.init()
    console.log("======> Ennemis :", ennemis)
    this.engine = Engine(this.cards, ennemis, this.player);
    console.log("OK")
    this.gameLoop = GameLoop(this.events, this.action, this.engine, this.player)
  },
  getLoop : function (){
    return this.gameLoop
  }
})
