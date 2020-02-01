/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
simple Game declaration
**/
import DE from '@dreamirl/dreamengine';
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
    if (Game.selectedCard)
      Game.selectedCard.moveTo(pos, 100);
  };
  Game.camera.pointerdown = function (pos, e) {
    //Game.ship.gameObjects[0].moveTo(Game.targetPointer, 500);
    // Game.targetPointer.shake( 10, 10, 200 );
    //Game.targetPointer.renderer.setBrightness([1, 0]);
  };
  Game.select = (card) => {
    if (!card) return
    Game.selectedCard = card
    Game.selectedCard.zindex = 510
  }

  Game.deselect = () => {
    if (Game.selectedCard)
      Game.selectedCard.zindex = 500
    Game.selectedCard = null
  }
  Game.camera.pointerup = function (pos, e) {
    Game.selectedCard.moveTo(getHandPosition(Game.selectedCard.idHand, Game.Hand.gameObjects.length), 500);
    Game.deselect()
  };
  Game.render.add(Game.camera);
  // Game.render.add( Game.scene );
  Game.hand = []
  function getHandPosition(id, total, init = false) {
    console.log(id, total)
    const espace = 250
    const out = { x: parseInt(id / 2 + 0.5) * (espace) * (id % 2 ? - 1 : 1) + (total % 2 ? 0 : espace / 2), y: 0 }
    if (!init) {
      out.x += Game.Hand.x
      out.y += Game.Hand.y
    }
    return out

  }
  const cardNum = 7
  Game.Hand = new DE.GameObject({
    zindex: 500,
    x: 1920 / 2,
    y: 1080,
    interactive: true,
    gameObjects:
      Array.from(Array(cardNum).keys()).map((_, id) => {
        const pos = getHandPosition(id, cardNum, true)
        console.log(id, pos)
        return new DE.GameObject({
          ...pos,
          zindex: 500,
          idHand: id,
          interactive: true,
          pointerdown: function (e) {
            if (!Game.selectedCard)
              Game.select(e.target)
          },
          renderer: new DE.SpriteRenderer({ spriteName: 'player', scale: 1 }),
        })
      })
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

// just for helping debugging stuff, never do this ;)
window.Game = Game;

export default Game;
