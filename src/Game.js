/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
simple Game declaration
**/
import DE from '@dreamirl/dreamengine';
import Pointer from "./Pointer"
import Hand from "./Hand"
import CardDisplay from "./CardDisplay"
import Mob from "./Mob"
import Pile from "./Pile"
import CardPicker from "./CardPicker"
import ParticleDisplay from "./ParticleDisplay"

var Game = {};
Game.init = function () {
  console.log('game init');
  DE.config.DEBUG = 1;
  // DE.config.DEBUG_LEVEL = 2;
  Game.render = new DE.Render('render', {
    resizeMode: 'stretch-ratio',
    width: 1920,
    height: 1080,
    backgroundColor: '0x00004F',
    roundPixels: false,
    powerPreferences: 'high-performance',
  });
  Game.render.init();
  DE.start();
};

Game.onload = function () {
  console.log('game start');
  Game.scene = new DE.Scene();
  Game.camera = new DE.Camera(0, 0, 1920, 1080, {
    scene: Game.scene,
    backgroundImage: 'bg',
  });
  Game.camera.interactive = true;
  Game.addMouseListener = function (that, cb) {
    Game.mouseListener = Game.mouseListener || []
    Game.mouseListener.push({ that, cb })
  }
  Game.removeMouseListener = function (cb) {
    Game.mouseListener = Game.mouseListener.filter(ls => ls.cb !== cb)
  }
  Game.camera.pointermove = function (pos, e) {
    Game.Pointer.x = pos.x
    Game.Pointer.y = pos.y
    if (Game.mouseListener)
      Game.mouseListener.forEach(ls => ls.cb(ls.that, pos))
  };
  Game.camera.pointerdown = function (pos, e) {
  };

  Game.camera.pointerup = function (pos, e) {
    if (!Game.selectedCard) return
    if (Game.selectedCard.isOnPicker) return
    if (Game.selectedCard && !Game.selectedCard.selectedRecently) {
      Game.selectedCard.goToDefaultPos()
      Game.selectedCard.deselect()
    }
    //Game.selectedCard.moveTo(Game.selectedCard.getHandPosition(), 500);

  };
  Game.render.add(Game.camera);
  Game.Pointer = Pointer()

  Game.Mob = Mob()

  Game.CardPicker = CardPicker()
  Game.Hand = Pile("Hand", {
    x: 1920 / 2,
    y: 1080
  })
  Game.Draw = Pile("Draw", {
    x: 100,
    y: 1080 / 2
  })

  Game.Picker = Pile("Picker", {
    x: 1920 / 2,
    y: 1080 / 2
  })

  Array.from(Array(5).keys()).forEach((_, id) => Game.Hand.addCard(CardDisplay()))
  Game.Hand.goToDefaultPos()

  Array.from(Array(5).keys()).forEach((_, id) => Game.Draw.addCard(CardDisplay()))
  Game.Draw.goToDefaultPos()
  Game.scene.add(
    Game.Hand,
    Game.Mob,
    Game.Hand,
    Game.Draw,
    Game.Picker,

  );

  Game.waitForCardPlay = () => {
    return new Promise(resolve => {
      Game.waitingForPlay = (card, target) => {
        Game.waitingForPlay = null
        return resolve({ card, target })
      }
      return resolve
    })
  }

  Game.waitCardPicker = (cardPool, toPick) => {
    Game.CardPicker.pick(cardPool, toPick)
    return new Promise(resolve => {
      Game.waitingForPick = (cards) => {
        Game.waitingForPick = null
        return resolve(cards)
      }
      return resolve
    })
  }

  Game.addParticle = (id, pos) => {
    return new Promise(resolve => {
      ParticleDisplay(id, pos)
      return resolve()
    })
  }

  var turn = 0

  DE.Inputs.on('keyDown', 'left', function () {
    function infiniteTurn() {
      if (!(turn % 3) && turn)
        Game.waitCardPicker(Game.Draw.content, 1).then((cards) => {
          console.log("card", cards)
          turn++
          //cards[0].play(Game.Mob)
          //Game.Hand.switchCards(cards[1], Game.Hand.content[0])
          const card = CardDisplay()
          card.spawnInto(Game.Hand)
          infiniteTurn()

        })
      else
        Game.waitForCardPlay().then(({ card, target }) => {
          card.play(target).then(() => {
            turn++
            infiniteTurn()
          })
        })
    }
    infiniteTurn()
  });

  DE.Inputs.on('keyDown', 'up', function () {
    Game.Draw.content[0].draw()
  });

  DE.Inputs.on('keyDown', 'down', function () {
    Game.Hand.switchCards(Game.Draw.content[0], Game.Hand.content[0])
  });

  DE.Inputs.on('keyDown', 'right', function () {
    const test = () => ({
      init: function () {
        this.x = 6
        return this
      },
      x: 5
    }.init())
    console.log(test())
  });
};
window.Game = Game

export default Game;
