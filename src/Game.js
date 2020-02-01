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
  Game.camera.pointermove = function (pos, e) {
    Game.Pointer.x = pos.x
    Game.Pointer.y = pos.y
    if (Game.selectedCard)
      Game.selectedCard.followMouse(pos);
  };
  Game.camera.pointerdown = function (pos, e) {
  };

  Game.select = (card) => {
    if (!card) return
    Game.selectedCard = card
    card.select()
    Game.selectedCard.zindex = 510
    Game.selectedCard.setHighlight(0.5)
  }

  Game.deselect = () => {
    if (Game.selectedCard) {
      Game.selectedCard.selected = false
      Game.selectedCard.zindex = 500
      Game.selectedCard.deselect()
      Game.selectedCard.setHighlight(0)
    }
    Game.selectedCard = null
  }
  Game.camera.pointerup = function (pos, e) {
    if (!Game.selectedCard) return
    Game.selectedCard.moveTo(Game.selectedCard.getHandPosition(), 500);
    Game.deselect()
  };
  Game.render.add(Game.camera);
  const cardNum = 3
  Game.Pointer = Pointer()

  Game.Hand = Hand()



  Game.scene.add(
    Game.Hand
  );

  DE.Inputs.on('keyDown', 'left', function () {
    Game.ship.axes.x = -2;
  });
  DE.Inputs.on('keyDown', 'right', function () {
    Game.ship.axes.x = 2;
  });
  DE.Inputs.on('keyUp', 'right', function () {
    Game.ship.axes.x = 0;
  });
  DE.Inputs.on('keyUp', 'left', function () {
    Game.ship.axes.x = 0;
  });

  DE.Inputs.on('keyDown', 'up', function () {
    Game.ship.axes.y = -2;
  });
  DE.Inputs.on('keyDown', 'down', function () {
    Game.ship.axes.y = 2;
  });
  DE.Inputs.on('keyUp', 'down', function () {
    Game.ship.axes.y = 0;
  });
  DE.Inputs.on('keyUp', 'up', function () {
    Game.ship.axes.y = 0;
  });

  DE.Inputs.on('keyDown', 'fire', function () {
    Game.ship.addAutomatism('fire', 'fire', { interval: 150 });
  });
  DE.Inputs.on('keyUp', 'fire', function () {
    Game.ship.removeAutomatism('fire');
  });

  DE.Inputs.on('keyDown', 'deep', function () {
    Game.ship.z += 0.1;
  });
  DE.Inputs.on('keyDown', 'undeep', function () {
    Game.ship.z -= 0.1;
  });
};
window.Game = Game

export default Game;
