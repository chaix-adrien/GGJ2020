import Mob from './Mob'

export default (max_life, defense, power) => ({
	name: "centralunite",
	max_life: max_life,
	life: max_life,
	defense: defense,
	power: power,
	gameObj: Mob('tour', {x: 600, y: 400}),
	init : function () {
		this.gameObj._engineEnnemi = this
	},
	getDammage(damage_value) {
		// deal damage - % defense
		this.life -= Math.round(damage_value - (damage_value * this.defense))
		this.gameObj.hurt(damage_value)
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
		// heal most broken component
		let fenemy = null
		for (let name in engine.ennemis) {
			// we're searching for lowest component life percentage
			if (name == "init" || name == "delete" || name == "validation" || !engine.ennemis[name])
				continue ;
			if (!fenemy && engine.ennemis[name].is_alive())
				fenemy = engine.ennemis[name]
			else if	(engine.ennemis[name].is_alive() && (fenemy.life * 100 / fenemy.max_life) >
				(engine.ennemis[name].life * 100 / engine.ennemis[name].max_life))
				fenemy = engine.ennemis[name]
		}
		if (!fenemy)
			return []
		fenemy.heal(engine.ennemis.centralunite.power)
		return ["execute heal", fenemy.name]
	},
	validation(engine) {
		if (!engine.ennemis.centralunite)
			return false;
		// if target is the cu trigger screen event
		if (!engine.event[1] || !engine.computer.centralunite.is_alive())
			return false;
		if (!engine.event[1].name == "centralunite")
		if (engine.turn % 3 == 2)
			return true;
		return false
	}
})
