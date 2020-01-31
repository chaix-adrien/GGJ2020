/**
 * The main module.
 * Read more about modules in the article "Modules".
 */

class Card {
  constructor(sprite, update = () => null, pos = { x: 0, y: 0 }) {
    const go = new gamekit.Sprite(sprite);
    go.pointerEnable();
    this.s = go
    this.drag = false
    this.setPos(pos)
    go.update = update
    go.on('pointerdown').then(this.onPointerDown)
    go.on('pointerup').then(this.onPointerUp)
    go.on('pointermove').then(this.onPointerMove)
    gamekit.layer[0].attach(go);
  }

  moveTo = (target, speed = 10) => {
    const pos = this.getPos()
    const vector = { x: (target.x - pos.x) / speed, y: (target.y - pos.y) / speed }
    const newPos = { x: pos.x + vector.x, y: pos.y + vector.y }
    this.setPos(newPos)
  }

  onPointerMove = (x, y) => {
    if (this.drag)
      this.moveTo({ x, y })
  }
  onPointerDown = () => {
    this.drag = true
  }

  onPointerUp = () => {
    this.drag = false
  }

  getPos = () => ({ x: this.s.x + this.s.w / 2, y: this.s.y + this.s.h / 2 })
  setPos = (({ x, y }) => {
    this.s.x = x - this.s.w / 2
    this.s.y = y - this.s.h / 2
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
    let card = new Card(gamekit.a.space);
  }
});