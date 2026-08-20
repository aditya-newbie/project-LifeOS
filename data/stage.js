export class Stage {
  id;
  name;
  description;
  milestones;
  completed;
  startedOn;

  constructor(id, name, description, startedOn, milestones = [], completed = false) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startedOn = startedOn;
    this.milestones = milestones;
    this.completed = completed
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

export class Step {
  id;
  name;
  completed;
  saved = false;

  constructor(id, name = '') {
    this.id = id;
    this.name = name;
  }
}