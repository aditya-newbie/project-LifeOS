export let fields = [];

export class Field {
  #iconPath;
  name;

  constructor(fieldName, fieldIcon = '') {
    this.name = fieldName;
    this.iconPath = fieldIcon
  }

  getIcon() {
    if(this.iconPath) {
      return URL.createObjectURL(this.iconPath);
    } else {return 'images/blank.png'};
  }
}

