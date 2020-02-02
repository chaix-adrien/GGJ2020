import Mob from './Mob'

export default (max_life, defense, power) => ({
	name: "keyboard",
	max_life: max_life,
	life: max_life,
	defense: defense,
	power: power,
	gameObj: Mob('clavier_1', { x: 1000, y: 610 }, 'explosion', max_life),
	init: function () {
		this.gameObj._engineEnnemi = this
	},
	getDammage(damage_value) {
		// deal damage - % defense
		this.life -= Math.round(damage_value - (damage_value * this.defense))
		this.gameObj.hurt(damage_value)
		if (this.life <= 0) {
			this.gameObj.kill()
		}
	},
	heal(healing_value) {
		// heal based on defense lvl. If component is really weak, the heal will be more efficient
		var real_heal = Math.round(healing_value - (healing_value * this.defense));

		((this.life + real_heal) > this.max_life) ?
			(this.life = this.max_life) : (this.life += real_heal)
	},
	str() {
		return this.name + " >> life:" + this.life + " / " + this.max_life
	},
	is_alive() {
		return (this.life > 0)
	},
	action(engine) {
		if (engine.partie.hand.length > 0) {
			engine.partie.replaceCard()
			engine.ennemis.keyboard.power = false;
		}
	},
	validation(engine) {
		// transform a player card when the component reach a life level
		// power : boolean to check if action has been used
		if (!engine.event[1])
			return false;
		if (engine.event[1].name != "keyboard")
			return false
		if (engine.turn % 3 == 2)
			return false;
		if (!engine.ennemis.keyboard || !engine.ennemis.keyboard.is_alive())
			return false;
		if ((engine.ennemis.keyboard.life * 100 / engine.ennemis.keyboard.max_life) > 20)
			engine.ennemis.keyboard.power = true
		if (engine.ennemis.keyboard.power)
			return true
		return false
	}
})
