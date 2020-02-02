function GameMap(rooms, size=3){
  this.size = size;
  this.layout = new Map();
  this.roomPossible = rooms
  this.currentRoom = null;
  this.starter = [new Room("Boss")];
  this.randomInt = (max) => {a  = Math.floor(Math.random() * Math.floor(max))
  return (a === 0 ? 1 : a)};
}

GameMap.prototype.genStep = function (currentStep) {
  step = [];
  this.nbPath = this.randomInt(3) + 2;
  console.log("nb path: ", this.nbPath);
  reste = currentStep.length % 2;
  group = Math.floor(currentStep.length / 2);
  [...Array(this.nbPath).keys()].forEach(elem => {
    link = [];
    currentStep.sort(() => Math.random() - 0,5);
    [...Array(this.randomInt(currentStep.length - 1)).keys()].forEach(elem => {
      link.push(currentStep[elem]);
    });
    room = {...this.roomPossible[this.randomInt(this.roomPossible.length - 1)]};
    room.link = link;
    step.push(room);
    });
    return step
}

GameMap.prototype.genMap = function() {
  [...Array(this.size - 1).keys()].forEach(elem => {
    this.starter = this.genStep(this.starter);
  });
}

GameMap.prototype.getNextRooms = function () {
  return this.layout[this.currentRoom].getNext();
}
