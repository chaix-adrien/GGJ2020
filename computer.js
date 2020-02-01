
const Enemy = {
	init(name, max_life, defense, power) {
		// setting attributes
		this.name = name
		this.max_life = max_life
		this.life = max_life
		this.defense = defense
		this.power = power
	},
	validation(engine) {
		console.log(this.name + " undefined validation")
		return true
	},
	hit(engine) {
		// deal damage - % defense
		return ;
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
	}
}

// int Central Unite
var CentralUnite = Object.create(Enemy)

CentralUnite.action_validation = function(engine) {
	return (Computer[this.name].is_alive() && engine.turn % 3 == 2)
}
CentralUnite.action = function (engine) {
	// heal most broken component
	let fenemy = null
	for (let name in engine.enemies) {
		// we're searching for lowest component life percentage
		if (!fenemy && engine.enemies[name].is_alive())
			fenemy = engine.enemies[name] 
		else if	(engine.enemies[name].is_alive() && (fenemy.life * 100 / fenemy.max_life) >
			(engine.enemies[name].life * 100 / engine.enemies[name].max_life))
			fenemy = engine.enemies[name] 
	}
	if (!fenemy)
		return []
	fenemy.heal(Computer[this.name].power)
	return ["execute heal", fenemy.name]
}
CentralUnite.hit_validation = function(engine) {
	return (Computer[this.name].is_alive() && engine.turn % 3 != 2)
}
CentralUnite.hit = function (engine, damage_value=4) {
	Computer[this.name].life -= Math.round(damage_value - (damage_value * Computer[this.name].defense))
	if (Computer["Screen"].validation(engine))
		return Screen.action(engine)
	return []
}

// init Screen
var Screen = Object.create(Enemy)
Screen.validation = function(engine) {
	return (Computer[this.name].is_alive() && engine.turn % 3 != 2)
}
Screen.action = function (engine) {
	engine.player.mana -= Computer[this.name].power
	return ["execute mana drain", Computer[this.name].power]
}

// init Keyboard
var Keyboard = Object.create(Enemy)
Keyboard.validation = function(engine, damage_value=4) {
	// transform a player card when the component reach a life level
	// power : boolean to check if action has been used
	Computer[this.name].life -= Math.round(damage_value - (damage_value * Computer[this.name].defense))

	// if life under 20% mouse transform a player card
	if ((Computer[this.name].life * 100 / Computer[this.name].max_life) > 20)
		Computer[this.name].power = true
	else if (Computer[this.name].power)
		return true
	return false
}
Keyboard.action = function (engine) {
	if (engine.partie.hand.length > 0) {
		let cardId = Math.round(Math.random() % engine.partie.hand.length);
		let card = engine.partie.getRandomCard()
		engine.partie.replaceCard(cardId, card)
		Computer[this.name].power = false;
		return ["execute replace", cardId]
	}
	return []
}

// init Mouse
Mouse = Object.create(Enemy)
Mouse.validation = function(engine, damage_value=4) {
	// detroy a player card when the component reach a life level
	// power : boolean to check if action has been used
	Computer[this.name].life -= Math.round(damage_value - (damage_value * Computer[this.name].defense))

	// if life under 20% mouse steal and delete a player card
	if ((Computer[this.name].life * 100 / Computer[this.name].max_life) > 20)
		Computer[this.name].power = true
	else if (Computer[this.name].power)
		return true
	return false
}
Mouse.action = function (engine) {
	if (engine.partie.hand.length > 0) {
		let cardId = Math.round(Math.random() % engine.partie.hand.length);
		engine.partie.deleteCard(cardId);
		Computer[this.name].power = false;
		return ["execute steal", cardId]
	}
	return []
}

var Computer = {}

get_enemies = function() {
	var enemies = []

	// init
	CentralUnite.init('CentralUnite', 120, 0.7, 3)
	Mouse.init('Mouse', 20, 0, true)
	Screen.init('Screen', 80, 0.4, 2)
	Keyboard.init('Keyboard', 40, 0.2, true)	

	Computer[Mouse.name] = Mouse
	Computer[Keyboard.name] = Keyboard
	Computer[CentralUnite.name] = CentralUnite
	Computer[Screen.name] = Screen

	// add enemies to array
	enemies.push(Computer[Mouse.name])
	enemies.push(Computer[Keyboard.name])
	enemies.push(Computer[CentralUnite.name])
	enemies.push(Computer[Screen.name])

	return enemies;
}

get_enemies_event = function(enemy_list) {
	var events = []

	events.push(new Event("CentralUnite", CentralUnite.action_validation, CentralUnite.action, permanante=true))
	events.push(new Event("CentralUnite", CentralUnite.hit_validation, CentralUnite.hit, permanante=true))
	events.push(new Event("Mouse", Mouse.validation, Mouse.action, permanante=true))
	events.push(new Event("Keyboard", Keyboard.validation, Keyboard.action, permanante=true))

	return events
}