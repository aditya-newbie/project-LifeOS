export let fields = [];

export class Field {
  #iconFakePath;
  name;
  stages = [];

  constructor(fieldName, fieldIcon = '') {
    this.name = fieldName;
    this.iconFakePath = fieldIcon
  }

  getIcon() {
    if(this.iconFakePath) {
      return URL.createObjectURL(this.iconFakePath);
    } else {return 'images/blank.png'};
  }
}

