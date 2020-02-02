
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
    return (this.life < 0 ? false : true);
  },
  heal : function (heal){
    this.life += heal;
    if (this.life > this.maxlife){
      this.life = this.maxlife;
    }
  },
  play: function(cost) {
    this.mana -= cost;
    this.mana = (this.mana < 0 ? 0 : this.mana)
    window.Game.Mana.setMana(this.mana)
  },
  playable : function (cost) {
    if (this.mana < cost) {
      return false;
    }
    return true;
  }

})
