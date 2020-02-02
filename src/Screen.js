export default (max_life, defense, power) => ({
	name: "screen",
	max_life: max_life,
	life: max_life,
	defense: defense,
	power: power,
	getDammage(damage_value) {
		// deal damage - % defense
		this.life -= Math.round(damage_value - (damage_value * this.defense))
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
		engine.player.mana -= engine.ennemie.screen.power
		return ["execute mana drain", engine.ennemie.screen.power]
	},
	validation(engine) {
		if (!engine.event[1] || !engine.ennemie.centralunite.is_alive())
			return false
		if (engine.event[1].name == "centralunite")
			return (engine.ennemie.screen.is_alive() && engine.turn % 3 != 2)
		return false
	}
})
