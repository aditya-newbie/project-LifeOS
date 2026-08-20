export class Stage {
  id;
  name;
  description;
  milestones = [];
  completed = false;
  startedOn;

  constructor(id, name, description, startedOn) {
    this.id = id;
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
  id;
  name;
  description;
  completed = false;
  steps = [];

  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}