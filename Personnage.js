function Personnage(name, life, mana){
  this.name = name;
  this.maxlife = life;
  this.life = life;
  this.mana = mana;
}

Personnage.prototype.getDammage = function (damage) {
  this.life -= damage;
  if (this.life < 0) {
    this.life = 0;
  }
}

Personnage.prototype.is_alive = function () {
  return (this.life < 0 ? False : True);
}

Personnage.prototype.heal = function (heal){
  this.life += heal;
  if (this.life > this.maxlife){
    this.life = this.maxlife;
  }
}

Personnage.prototype.playable = function (cost) {
  if (this.mana < cost) {
    return false;
  }
  return true;
}
