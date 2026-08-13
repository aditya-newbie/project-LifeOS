export class Stage {
  name;
  description;
  mileStone = [];
  completed = false;
  startedOn;

  constructor(name, description, startedOn) {
    this.name = name;
    this.description = description;
    this.startedOn = startedOn;
  }

  getStageNumber(index) {
    const num = index + 1;
    return String(num).padStart(2, '0');
  }
}

export class MileStone {
  name;
  completed = false;

  constructor(name) {
    this.name = name;
  }
}