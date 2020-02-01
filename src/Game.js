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
    Game.selectedCard.moveTo(Game.selectedCard.getHandPosition(), 500);
    Game.selectedCard.deselect()
  };
  Game.render.add(Game.camera);
  const cardNum = 3
  Game.Pointer = Pointer()

  Game.Hand = Hand()



  Game.scene.add(
    Game.Hand
  );

  Game.waitForCardPlay = () => {
    return new Promise(resolve => {
      Game.playWaiting = resolve
      return resolve.then(card => {
        Game.playWaiting = null
        return card
      })
    })
  }

  DE.Inputs.on('keyDown', 'left', function () {
    Game.waitForCardPlay().then(card => console.log("card played", card))
  });

};
window.Game = Game

export default Game;
