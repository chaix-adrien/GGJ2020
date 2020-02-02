import Screen from "./Screen"
import Keyboard from "./Keyboard"
import Mouse from "./Mouse"
import CentralUnite from "./CentralUnite"

export default () => ({
	"screen": null,
	"keyboard": null,
	"mouse": null,
	"centralunite": null,
	init() {
		this.screen = Screen(40, 0, 1);
		this.keyboard = Keyboard(25, 0, true);
		this.mouse = Mouse(15, 0, true);
		this.centralunite = CentralUnite(70, 0, 2);
		this.keyboard.init()
	},
	validation(engine) {
		for (let name in engine.ennemis) {
			if (name == "init" || name == "delete" || name == "validation" || !engine.ennemis[name])
				continue
			if (!engine.ennemis[name].is_alive())
				return true
		}
		return false
	},
	delete(engine) {
		for (let name in engine.ennemis) {
			if (name == "init" || name == "delete" || name == "validation" || !engine.ennemis[name])
				continue
			if (!engine.ennemis[name].is_alive()) {
				engine.ennemis[name].gameObj.delete()
				engine.ennemis[name] = null
			}
		}
	}
})
