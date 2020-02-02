export default  (events, action, engine, player) => ({
  action : action,
  events : events,
   player : player,
  engine : engine,
  guiEvents : [],
  loop  : function (){
    console.log(this.guiEvents)
    var evt = this.guiEvents.pop();
    console.log("t")
    if (!evt) {
      console.log("You dead");
      return ;
    }
    console.log(evt)
    this.action[evt.name](...evt.param).then((obj) => {
      console.log(obj)
      if (evt.retour){
        evt.retour(obj) ;
      }
      this.loop()
    });
  },
  event : function () {
    this.guiEvents = []
    this.events.forEach(elem => {
      console.log (elem)
       var callback = (elem.triggerable(this.engine) ? elem.trigger(this.engine) : null);
       console.log ("Apres elem")

       if (callback){
         this.guiEvents.push(callback)
       }
    });
    this.guiEvents = this.guiEvents.sort((c1, c2) => c1.priority > c2.priority ? 1 : -1);
  }

})
