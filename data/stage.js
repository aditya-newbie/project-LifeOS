export class Stage {
  name;
  description;
  mileStone = {};
  status = 'current';

  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  getStageNumber(index) {
    const num = index + 1;
    return String(num).padStart(2, '0');
  }
}

