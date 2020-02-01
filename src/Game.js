/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
simple Game declaration
**/
import DE from '@dreamirl/dreamengine';
import Card from "./Card"
import Pointer from "./Pointer"

var Game = {};

Game.render = null;
Game.scene = null;
Game.ship = null;
Game.obj = null;

class CardDisplay {
  constructor() {

  }

}

// init
Game.init = function () {
  console.log('game init');
  // DE.config.DEBUG = 1;
  // DE.config.DEBUG_LEVEL = 2;

  // Create the renderer before assets start loading
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

  // scene
  Game.scene = new DE.Scene();
  // don't do this because DisplayObject bounds is not set to the render size but to the objects inside the scen
  // scene.interactive = true;
  // scene.click = function()
  // {
  //   console.log( "clicked", arguments );
  // }

  // if no Camera, we add the Scene to the render (this can change if I make Camera)

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

  Game.Hand = new DE.GameObject({
    zindex: 500,
    x: 1920 / 2,
    y: 1080,
    interactive: true,
    gameObjects:
      Array.from(Array(cardNum).keys()).map((_, id) => {
        return Card(id)
      })
  })

  console.log(Game)


  Game.Hand.gameObjects.forEach((go, id) => {
    const pos = go.getHandPosition(true)
    go.x = pos.x
    go.y = pos.y
    go.rotation = pos.rotation
  })

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
