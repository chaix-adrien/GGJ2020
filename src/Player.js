
export default (name, life, mana) => ({
  name,life,mana,
  maxlife: life,
getDammage :function (damage) {
  this.life -= damage;
  if (this.life < 0) {
    this.life = 0;
    }
  },
  is_alive : function () {
    return (this.life < 0 ? False : True);
  },
  heal : function (heal){
    this.life += heal;
    if (this.life > this.maxlife){
      this.life = this.maxlife;
    }
  },
  play: function(cost) {
    if (this.playable(cost)) {
      this.mana -= cost;
      return true;
    }
    return false;
  },
  playable : function (cost) {
    if (this.mana < cost) {
      return false;
    }
    return true;
  }

})
