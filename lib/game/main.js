/**
 * The main module.
 * Read more about modules in the article "Modules".
 */

var cardDisplays = []
class CardDisplay {
  constructor(sprite, pos = { x: 0, y: 0 }, layer = 0, update = () => null) {
    this.usedSprite = sprite
    const go = new gamekit.Sprite(sprite);
    go.pointerEnable();
    this.s = go
    this.drag = false
    this.setPos(pos)
    go.centerOrigin()
    go.update = update
    go.on('pointerdown').then(this.onPointerDown)
    go.on('pointermove').then(this.onPointerMove)
    go.on('pointerup').then(this.onPointerUp)
    console.log(gamekit.layer)
    cardDisplays.push(this)
    gamekit.layer[0].attach(this.s);

  }

  moveToDirection = (target, speed = 5) => {
    const pos = this.getPos()
    const vector = { x: (target.x - pos.x) / speed, y: (target.y - pos.y) / speed }
    const newPos = { x: pos.x + vector.x, y: pos.y + vector.y }
    this.setPos(newPos)
  }

  onPointerMove = (x, y) => {
    console.log("lol")
    if (this.drag)
      this.moveToDirection({ x, y })
  }
  onPointerDown = () => {
    if (!cardDisplays.some(c => c.drag)) {
      this.drag = true
      console.log("DOWN")
      this.moveToLayer(1)
    }
  }

  moveToLayer = (layer) => {

  }

  onPointerUp = () => {
    this.drag = false
    this.s._attachedEvents.pointermove = []
    this.moveToLayer(0)
  }

  getPos = () => ({ x: this.s.x, y: this.s.y })
  setPos = (({ x, y }) => {
    this.s.x = x
    this.s.y = y
  })
}

gamekit.defineModule('main', function () {

  /**
   * Basic initalization flow. Loading assets, setting
   * everything up, then starting the engine.
   */
  gamekit
    .loadAssets('space.png')
    .then(gameSetup)
    .then(gamekit.start);
  function gameSetup() {
    gamekit.clearCanvas();
    gamekit.createLayer();
    TopCardLayer = gamekit.createLayer();

    let x = y = 0
    let i = 0;

    for (i = 0; i < 6; i++) {
      new CardDisplay(gamekit.a.space, { x, y }, i);
      x += 30
      y += 30

    }
  }
});