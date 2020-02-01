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
    console.log(Game.selectedCard.isOnPicker)
    Game.selectedCard.goToDefaultPos()
    //Game.selectedCard.moveTo(Game.selectedCard.getHandPosition(), 500);

    Game.selectedCard.deselect()
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

  Array.from(Array(5).keys()).forEach((_, id) => Game.Hand.addCard(CardDisplay(id)))
  Game.Hand.goToDefaultPos()

  Array.from(Array(5).keys()).forEach((_, id) => Game.Draw.addCard(CardDisplay(id)))
  Game.Draw.goToDefaultPos()
  Game.scene.add(
    Game.Hand,
    Game.Mob,
    Game.Hand,
    Game.Draw
  );

  Game.waitForCardPlay = () => {
    return new Promise(resolve => {
      Game.waitingForPlay = (card, target) => {
        console.log("ici", card, target)
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


  DE.Inputs.on('keyDown', 'left', function () {

    Game.waitForCardPlay().then(({ card, target }) => {
      console.log("end", card, target)
      card.play(target)
    })
    //Game.Draw.draw(Game.Draw.content[0])
    //Game.Hand.switchCards(Game.Draw.content[0], Game.Hand.content[0])
  });

  DE.Inputs.on('keyDown', 'up', function () {
    Game.Hand.gameObjects[0].replaceByCard(Game.cards[0])
  });

  DE.Inputs.on('keyDown', 'right', function () {
    const fn = Game.waitCardPicker
    fn(Game.cards, 2).then(cards => console.log("card picked", cards))
  });
};
window.Game = Game

export default Game;
