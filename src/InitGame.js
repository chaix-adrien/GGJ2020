import CardDisplay from './CardDisplay'
import Engine from './Engine'
import Card from './Card'
import Player from './Player'
import GameLoop from './GameLoop'
import Event from './Event'
import PromiseParam from './PromiseParam'
import Mana from './Mana'

const validDraw = (engine) => {
  console.log("ENGINE", engine)
  console.log(engine.partie.hand.length)
  return (engine.partie.hand.length === 0)
}

const playCard = (obj) => {

}

import Computer from './Computer'

export default () => ({
    confCard : [
    {
      "name": "coup de poing",
      "description": "inflige 1 point de degat",
      "action": (target) => target.getDammage(1),
      "cost": 1,
      "png": "explosion",
    },
    {
      "name": "coup de poing",
      "description": "inflige 1 point de degat",
      "action": (target) => target.getDammage(1),
      "cost": 1,
      "png": "explosion",
    },
    {
      "name": "coup de poing",
      "description": "inflige 1 point de degat",
      "action": (target) => target.getDammage(1),
      "cost": 1,
      "png": "explosion",
    },
    {
      "name": "coup de poing",
      "description": "inflige 1 point de degat",
      "action": (target) => target.getDammage(1),
      "cost": 1,
      "png": "explosion",
    },
    {
      "name": "coup de poing",
      "description": "inflige 1 point de degat",
      "action": (target) => target.getDammage(1),
      "cost": 1,
      "png": "explosion",
    },
    {
      "name": "coup de poing",
      "description": "inflige 1 point de degat",
      "action": (target) => target.getDammage(1),
      "cost": 1,
      "png": "explosion",
    },
    {
      "name": "coup de poing",
      "description": "inflige 1 point de degat",
      "action": (target) => target.getDammage(1),
      "cost": 1,
      "png": "explosion",
    },
    {
      "name": "coup de poing",
      "description": "inflige 1 point de degat",
      "action": (target) => target.getDammage(1),
      "cost": 1,
      "png": "explosion",
    },
    {
      "name": "coup de poing",
      "description": "inflige 1 point de degat",
      "action": (target) => target.getDammage(1),
      "cost": 1,
      "png": "explosion",
    },
  ],
  action : {
    "handChoice": (objs, nb) => window.Game.waitCardPicker(objs, nb, window.Game.Hand),
    "choice": (objs, nb) => window.Game.waitCardPicker(objs, nb),
    "play": () => window.Game.waitForCardPlay(),
    "None": (engine) => Promise.resolve(engine)
  },
  confEvent: [
    {
      "name": "end",
      "validation": (engine) => { console.log("Mana",  engine.player.mana); return engine.player.mana == 0 },
      "callback": (engine) =>  PromiseParam(9, "None", [engine], engine.end),
    },
    {
      "name": "tour",
      "validation": (engine) => {console.log("HAnd", window.Game.Hand.content); return engine.turn % 2 === 0},
      "callback":  () => PromiseParam(5, "choice", [window.Game.Draw.content.filter(elem => window.Game.Draw.content.indexOf(elem) < 3), 1], window.Engine.choice)
    },
  {
    "name": "tour",
    "validation": (engine) => engine.player.is_alive(),
    "callback":  () => PromiseParam(5, "play", [], (window.Engine.action))
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
    this.initEvent()
    this.initLoop()
    window.Game.Mana.setMana(3)

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
    this.player =  Player("carlito", 30, 3);
    this.engine = Engine(this.cards, [], this.player);
    var ennemis = Computer()
    ennemis.init()
    console.log("======> Ennemis :", ennemis)
    this.engine = Engine(this.cards, ennemis, this.player);
    console.log("OK")
    this.gameLoop = GameLoop(this.events, this.action, this.engine, this.player)
    window.Engine = this.engine

  },
  getLoop : function (){
    return this.gameLoop
  }
})
