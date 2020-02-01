import DE from '@dreamirl/dreamengine';

export default (key, Game = window.Game) => {
  Game[key] = new DE.GameObject({
    zindex: 500,
    ...pos
  })
  const obj = new DE.GameObject({
    zindex: 500,
    x: 1920 / 2,
    y: 1080,
    key: key,
    content: []
  })
  Game[key] = obj
  return obj
}
