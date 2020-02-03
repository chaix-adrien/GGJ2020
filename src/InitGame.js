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
      "callback": (engine) => {console.log(engine) ; return PromiseParam(9, "None", [], window.Engine.end) },
    },
    {
      "name": "tour",
      "validation": (engine) => {console.log("HAnd", window.Game.Hand.content); return engine.turn % 4 === 0},
      "callback": (engine) => PromiseParam(5, "choice", [window.Game.Draw.content.filter(elem => window.Game.Draw.content.indexOf(elem) < 3), 1], (obj) => engine.choice(obj))
    },
  {
    "name": "tour",
    "validation": (engine) => engine.player.is_alive(),
    "callback": (engine) => PromiseParam(1, "play", [],  (obj) => engine.action(obj))
  },
  {
    "name": "draw",
    "validation": validDraw,
    "callback":   (engine) => {console.log("!!!!  DRAW ENGINE !!!!!!", engine); return  PromiseParam(8, "None", [engine], (engine) => engine.partie.giveCard())}
  },
  {
    "name": "centralunite",
    "validation": (engine) => {  engine.ennemis.centralunite.validation(engine) && engine.turn % 2 == 0 },
    "callback":(engine) =>  PromiseParam(2, "None", [engine], engine.ennemis.centralunite.action),
  },
  {
    "name": "screen",
    "validation": (engine) => { engine.ennemis.screen.validation(engine) && engine.turn  > 1},
    "callback":(engine) =>  PromiseParam(2, "None", [engine], engine.ennemis.screen.action),
  },
  {
    "name": "keyboard",
    "validation": (engine) => { engine.ennemis.keyboard.validation(engine) && engine.turn > 1 },
    "callback":(engine) =>  PromiseParam(2, "None", [engine], engine.ennemis.keyboard.action),
  },
  {
    "name": "mouse",
    "validation": (engine) => { engine.ennemis.mouse.validation(engine) && engine.turn > 1},
    "callback": (engine) =>  PromiseParam(2, "None", [engine], engine.ennemis.mouse.action),
  },
  {
    "name": "computer",
    "validation": (engine) => {engine.ennemis.validation(engine) },
    "callback":  (engine) => PromiseParam(2, "None", [engine], engine.ennemis.delete(engine)),
  }

  ],
  init : function () {
    this.initCard()
    this.initEvent()
    this.initLoop()
      this.gameLoop = GameLoop(this.events, this.action, window.Engine, this.player)
    window.Game.Mana.setMana(this.player.mana)

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
    this.player =  Player("carlito", 30, 70);
    var ennemis = Computer()
    ennemis.init()
    console.log("======> Ennemis :", ennemis)
    window.Engine = Engine(this.cards, ennemis, this.player);
    console.log("OK")
  },
  getLoop : function (){
    return this.gameLoop
  }
})
