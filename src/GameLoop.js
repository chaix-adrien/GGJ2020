export default  (events, action, engine, player) => ({
  action : action,
  events : events,
   player : player,
  engine : engine,
  guiEvents : [],
  loop  : function (){
    var evt = this.guiEvents.pop();
    if (!evt) {
      console.log("You dead");
      return ;
    }
    this.action[evt.name](...evt.param).then((obj) => {
      if (evt.retour){
        evt.retour(obj);
        if (evt.retour === window.Engine.action){
          this.event()
        }
      }
      this.loop()
    });
  },
  event : function () {
    this.guiEvents = []
    this.events.forEach(elem => {
       var callback = (elem.triggerable(window.Engine) ? elem.trigger(window.Engine) : null);
       if (callback){
         console.log("Callback :", callback)
         this.guiEvents.push(callback)
       }
    });
    this.guiEvents = this.guiEvents.sort((c1, c2) => c1.priority > c2.priority ? 1 : -1);
  }

})
