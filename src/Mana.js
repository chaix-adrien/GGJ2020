import DE from '@dreamirl/dreamengine';
const textMana = new DE.TextRenderer('', {
  textStyle: {
    fill: 'black',
    fontSize: 35,
    fontFamily: 'Snippet, Monaco, monospace',
    strokeThickness: 1,
    align: 'center',
  },
})

export default (Game = window.Game) => new DE.GameObject({
  x: 20,
  y: 1080 - 50,
  gameObjects: [
    buttonValidate,
    new DE.GameObject({
      y: -400,
      zindex: 1000,
      interactive: true,
      cursor: 'pointer',
      renderers: [
        new DE.RectRenderer(100, 100, '0xFFCDCD', {
          lineStyle: [4, '0x000000', 1],
          fill: true,
          x: -250,
          y: -40,
        }),
        textSelectNumber
      ],
    })
  ],
  renderer: new DE.SpriteRenderer({ spriteName: 'backCardPicker', scale: 1 }),
});