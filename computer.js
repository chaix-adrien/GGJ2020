var Computer = {}

const Enemy = {
	init(name, max_life, defense, power) {
		// setting attributes
		this.name = name
		this.max_life = max_life
		this.life = max_life
		this.defense = defense
		this.power = power
	},
	action(power) {
		console.log(this.str() + " undefined action")
	},
	hit(damage_value) {
		// deal damage - % defense
		this.life -= Math.round(damage_value - (damage_value * this.defense))
		console.log(this.str())
	},
	heal(healing_value) {
		// heal based on defense lvl. If component is really weak, the heal will be more efficient
		var real_heal = Math.round(healing_value - (healing_value * this.defense));
		
		((this.life + real_heal) > this.max_life) ? 
			(this.life = this.max_life) : (this.life += real_heal)
		console.log(this.str() + " HEALED")
	},
	str() {
		return this.name + " >> life:" + this.life + " / " + this.max_life
	},
	is_alive() {
		return (this.life > 0)
	}
}

init_computer = function() {
	// init CentralUnite
	Computer.CentralUnite = Object.create(Enemy)
	Computer.CentralUnite.init('CentralUnite', 120, 0.7, 3)
	Computer.CentralUnite.action = function () {
		// heal most broken component
		let focused_component = null
		for (let name in Computer) {
			// we're searching for lowest component life percentage
			if (!focused_component && Computer[name].is_alive())
				focused_component = Computer[name] 
			else if	(Computer[name].is_alive() && (focused_component.life * 100 / focused_component.max_life) >
				(Computer[name].life * 100 / Computer[name].max_life))
				focused_component = Computer[name] 
		}
		focused_component.heal(this.power)
	}
	Computer.CentralUnite.hit = function(damage_value) {
		// deal damage - % defense
		this.life -= Math.round(damage_value - (damage_value * this.defense))
		console.log(this.str())
		Computer.Screen.action()
	}

	// init Keyboard
	Computer.Keyboard = Object.create(Enemy)
	Computer.Keyboard.init('Keyboard', 40, 0.2, false)
	Computer.Keyboard.action = function () {
		if (this.power)
			return ;
		if ((this.life * 100 / this.max_life) <= 20) {
			if (engine.partie.hand.length > 0) {
				let cardId = Math.round(Math.random() % engine.partie.hand.length);
				let card = engine.partie.getRandomCard()
				engine.partie.replaceCard(cardId, card)
				this.power = true;
				console.log("replaced")
			}
		}
	}
	Computer.Keyboard.heal = function(healing_value) {
		// heal based on defense lvl. If component is really weak, the heal will be more efficient
		var real_heal = Math.round(healing_value - (healing_value * this.defense));
		
		((this.life + real_heal) > this.max_life) ? 
			(this.life = this.max_life) : (this.life += real_heal)

		if ((this.life * 100 / this.max_life) > 20) {
			this.power = false;
		}
	}

	// init Screen
	Computer.Screen = Object.create(Enemy)
	Computer.Screen.init('Screen', 80, 0.4, 2)
	Computer.Screen.action = function () {
		engine.player.looseMana(this.power)
	}

	// init Mouse
	Computer.Mouse = Object.create(Enemy)
	Computer.Mouse.init('Mouse', 20, 0, false)
	Computer.Mouse.action = function () {
		// detroy a player when the component reach a life level
		// power : boolean to check if action has been used
		if (this.power)
			return ;
		if ((this.life * 100 / this.max_life) <= 20) {
			// if life under 20% mouse steal and delete a player card
			if (engine.partie.hand.length > 0) {
				let cardId = Math.round(Math.random() % engine.partie.hand.length);
				engine.partie.deleteCard(cardId);
				this.power = true;
			}
		}
	}
	Computer.Mouse.heal = function(healing_value) {
		// heal based on defense lvl. If component is really weak, the heal will be more efficient
		var real_heal = Math.round(healing_value - (healing_value * this.defense));
		
		((this.life + real_heal) > this.max_life) ? 
			(this.life = this.max_life) : (this.life += real_heal)

		if ((this.life * 100 / this.max_life) > 20) {
			this.power = false;
		}
	}
}
