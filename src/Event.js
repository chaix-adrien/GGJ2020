export default (name, validation, callback, permanante=true) => ({
  name : name,
  validation : validation,
  callback : callback,
  perma : permanante,
  active : true,
  trigger : function (engine) {
    if (!this.active) {
      return false;
    }
    if (!this.perma) {
      this.active = false;
    }
    return this.callback(engine)
  },
  triggerable : function (engine) {
    return ((this.validation(engine) && this.active) ? true : false);
  },
  active : function (){
    this.active = true;
  },
  disable : function (){
    this.active = false;
  }

})
