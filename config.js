configfile = {
  "cards": [
    {
      "name": "coup de poing",
      "description": "inflige 1 point de degat",
      "action": (target) => target.getDammage(1),
      "cost": 5
    }
  ],
  "events": [
    {
    "name": "choix de carte",
    "validation": (engine) => engine.turn % 2 === 0,
    "callback": engine => (console.log("choix de carte"))
  },
  {
    "name": "tour",
    "validation": (engine) => engine.player.is_alive(),
    "callback": (engine) => new Promise(5, "play", [], (cardId, target) => engine.action(cardId, target)),
  },
  {
    "name": "tour",
    "validation": (engine) => engine.player.is_alive(),
    "callback": (engine) => new Promise(3, "play", [], (cardId, target) => engine.action(cardId, target)),
  },
  {
    "name": "tour",
    "validation": (engine) => engine.player.is_alive(),
    "callback": (engine) => new Promise(8, "play", [], (cardId, target) => engine.action(cardId, target)),
  },
  {
    "name": "tour",
    "validation": (engine) => engine.player.is_alive(),
    "callback": (engine) => new Promise(2, "play", [], (cardId, target) => engine.action(cardId, target)),
  }
  ]
}


cardsFromConf = (cardsConf) => {
  cards = [];
  cardsConf.forEach(elem  => cards.push(new Card(elem["name"],
  elem["description"],
  elem["action"], elem["cost"] )));
  return cards;
}

eventsFromConf = (eventConf) => {
  events = []
  eventConf.forEach(elem => events.push(new Event(elem["name"],
  elem["validation"],
  elem["callback"])));
  return events;
}
