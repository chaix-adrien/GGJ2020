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
  Game.Pointer = new DE.GameObject({
    interactive: true,
    isInRectBox: function (pos, range, translate = { x: 0, y: 0 }) {
      const midRange = range / 2
      const pointer = { x: this.x + translate.x, y: this.y + translate.y }
      if (pos.x > pointer.x - midRange && pos.x < pointer.x + midRange &&
        pos.y > pointer.y - midRange && pos.y < pointer.y + midRange)
        return true
      return false
    },
    renderer: new DE.SpriteRenderer({ spriteName: 'particle', scale: 1 }),
  });

  Game.Hand = new DE.GameObject({
    zindex: 500,
    x: 1920 / 2,
    y: 1080,
    interactive: true,
    gameObjects:
      Array.from(Array(cardNum).keys()).map((_, id) => {
        return new DE.GameObject({
          zindex: 500,
          idHand: id,
          selected: false,
          sendParticles: false,
          interactive: true,
          pointerdown: function (e) {
            if (!Game.selectedCard)
              Game.select(e.target)
          },
          pointerout: function () {
            this.sendParticles = this.select && true
            if (this.selected)
              this.addAutomatism("createParticle", "createParticle", { interval: 50 })
          },
          pointerover: function () {
            this.removeAutomatism("createParticle")
          },

          createParticle: function () {
            this.drawLineToMouse()
          },

          select: function () {
            this.selected = true
            this.addAutomatism("createParticle", "createParticle", { interval: 50 })
          },
          deselect: function () {
            this.selected = false
            this.removeAutomatism("createParticle")
          },
          getHighlight: function () { return this.gameObjects[0] },
          setHighlight: function (enable, time = 200) { this.getHighlight()[enable ? "enable" : "disable"](time) },
          followMouse: function (gpos) {
            const pos = { ...gpos }
            const out = { ...gpos }
            const limitZero = 1080 - 300
            const vMouse = {
              x: (pos.x - (Game.Hand.x + this.x)),
              y: (pos.y - (Game.Hand.y + this.y)),
            }
            out.y = (Game.Hand.y + this.y) + vMouse.y / 5
            if (out.y < limitZero)
              out.y = limitZero
            out.x = (Game.Hand.x + this.x) + vMouse.x / 5
            this.moveTo(out, 100)
          },
          getHandPosition: function (init = false) {
            const total = Game.Hand.gameObjects.length
            const id = this.idHand
            const espace = 300
            const out = {
              rotation: parseInt(id / 2 + 0.5) * (Math.PI / 30) * (id % 2 ? - 1 : 1) + (total % 2 ? 0 : Math.PI / 30 / 2),
              x: parseInt(id / 2 + 0.5) * (espace) * (id % 2 ? - 1 : 1) + (total % 2 ? 0 : espace / 2)
              , y: 0
            }
            if (!init) {
              out.x += Game.Hand.x
              out.y += Game.Hand.y
            }
            return out
          },
          drawLineToMouse: function (start) {
            console.log("emit")
            var particle = new DE.GameObject({
              x: Game.Hand.x + this.x,
              y: Game.Hand.y + this.y - 200,
              updateMe: function (target) {
                this.moveTo(target, 150)
                if (Game.Pointer.isInRectBox(this, 100))
                  this.askToKill()

              },
              automatisms: [['updateMe', 'updateMe', { value1: Game.Pointer }]],

              /*              pointerover: function () {
                              this.updatable = false
                              this.interactive = false
                              this.askToKill()
                            },*/
              rotation: Math.random() * Math.PI,
              renderer: new DE.SpriteRenderer({ spriteName: 'particle', scale: 1 }),
            });
            Game.scene.add(particle);
          },
          renderer: new DE.SpriteRenderer({ spriteName: 'card', scale: 1 }),
          gameObjects: [
            new DE.GameObject({
              zindex: 460,
              alpha: 0,
              enable: function (time) { this.fade(this.alpha, 0.5, time) },
              disable: function (time) { this.fade(this.alpha, 0, time) },
              renderer: new DE.SpriteRenderer({ spriteName: 'cardHighlight', scale: 1 })
            })
          ]
        })
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


export default Game;
