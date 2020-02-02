export default  (events, action, engine, player, ennemie) => ({
  ennemie :  ennemie,
  action : action,
  events : events,
   player : player,
  engine : engine,
  guiEvents : [],
  loop  : function (){
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
  },
  event : function () {
    this.guiEvents = []
    this.event.forEach(elem => {
       callback = (elem.triggerable(this) ? elem.trigger(this) : null);
       if (callback){
         this.guiEvents.push(callback)
       }
    });
    this.guiEvents.sort((c1, c2) => c1.priority > c2.priority ? -1 : 1);
  }
})
