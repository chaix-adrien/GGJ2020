export default (name, description, action, cost,obj) => ({
  name : name,
  action : action,
  cost : cost,
  description : description,
  playable : false,
  gameObj : obj,
  init: function () {
    this.gameObj._engineCard = this
    this.gameObj.needTarget = true
    return this
  },
  pioche : function () {
    this.gameObj.draw();
  },
  play: function (target) {
    this.action(target)
    this.gameObject.play(target)
  }
}).init()
