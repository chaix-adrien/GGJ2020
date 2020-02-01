c1 = new Card("attaque", "inflige 1 point de degat", () => {console.log("attaque")}, 4);
c2 = new Card("defence", "rend 1 pv", () => {console.log("defence")}, 8);

console.log("init engine");
e = new Engine([c1, c2]);
a = e.getCard();
console.log("get card : ", a);
c = e.getPlayableCard();
console.log("Playable Card : ", c);
