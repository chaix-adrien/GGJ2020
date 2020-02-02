function Room(type) {
  this.link = [];
  this.type = type;
}

Room.prototype.getNextRoom = function () {
  return this.link;
}

Room.prototype.setNextRoom = function (room) {
  this.link.push(room);
  return true;
}
