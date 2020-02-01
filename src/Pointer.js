import DE from '@dreamirl/dreamengine';

export default (Game = window.Game) => new DE.GameObject({
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