export class Stage {
  name;
  description;
  mileStone = {};

  constructor(name, description, mileStone) {
    this.name = name;
    this.description = description;
    this.mileStone = mileStone;
  }
}

