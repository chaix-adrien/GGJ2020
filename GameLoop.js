function GameLoop(cards, events, action) {
  this.action = {
    "play": (cardId, target) => Promise.resolve(cardId, target)
  };
  console.log(this.action["play"])
  this.cards = cards;
  this.events = events;
  this.player = new Personnage("carlito", 30, 5);
  enemis = get_enemies()
  this.engine = new Engine(this.cards, enemis, this.player);
  this.guiEvents = [new PromiseParam(5, "play", [0, this.player], (cardId, target) => this.engine.action(cardId, target))];
  console.log(this.guiEvents);
  this.loop = () => {
    evt = this.guiEvents.pop();
    if (!evt) {
      console.log("You dead");
      return ;
    }
    this.action[evt.name](...evt.param).then((cardId, target) => {
      if (evt.retour){
        evt.retour(cardId, target) ;
      }
      this.loop();
    });
  }
  this.loop();
}

GameLoop.prototype.event = function () {
  this.guiEvents = []
  this.event.forEach(elem => {
     callback = (elem.triggerable(this) ? elem.trigger(this) : null);
     if (callback){
       this.guiEvents.push(callback)
     }
  });
  this.guiEvents.sort((c1, c2) => c1.priority > c2.priority ? -1 : 1);
}
