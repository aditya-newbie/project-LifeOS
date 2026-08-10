export class StageCard {
  name;
  discription;
  mileStone = {
    mileStones = [],
    completed = [],
    workingOn = []
  }

  constructor(name, discription, mileStone) {
    this.name = name;
    this.discription = discription;
    this.mileStone = mileStone;
  }
}

