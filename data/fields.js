import { Stage } from "./stage.js";

export let fields = [{
  iconFakePath: '' , 
  name: 'Fitness',
  stages: [{
    id: '46ccb8b7-4b6e-4071-9d80-cd63e589eb7c' , 
    name: 'Basic Calisthenics skills' ,
    description: 'learn fundamental skill of calistenics' ,
    milestones: [{
      id: 'testid1',
      name: 'Html and Css',
      description: 'Html and Css are tools to create website structure',
      completed: false ,
      steps: [{
        id: 'teststep0' ,
        name: 'button' ,
        completed: false ,
      },
      {
        id: 'teststep1',
        name: 'paragraph',
        completed: false ,
      },
      {
        id: 'teststep2',
        name: 'img',
        completed: false ,
      },
      {
        id: 'teststep3',
        name: 'inputs',
        completed: false ,
      },
      {
        id: 'teststep4',
        name: 'grid and flexbox',
        completed: false ,
      },
      {
        id: 'teststep5',
        name: 'position',
        completed: false ,
      }]
    }],
    completed: false,
    startedOn: '17 Aug 2026',
    getStageNumber(index) {
      const num = index + 1;
      return String(num).padStart(2, '0');
    }
  }],
  getIcon() {
    if(this.iconFakePath) {
      return URL.createObjectURL(this.iconFakePath);
    } else {return 'images/blank.png'};
  }
}];

export class Field {
  iconFakePath;
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
class FieldRemake {
  iconFakePath;
  name;
  stages = [];

  constructor(fieldName, fieldIcon , stages) {
    this.name = fieldName;
    this.iconFakePath = fieldIcon
    this.stages = stages
  }

  getIcon() {
    if(this.iconFakePath) {
      return URL.createObjectURL(this.iconFakePath);
    } else {return 'images/blank.png'};
  }
}

export function addFieldsToStorage() {
  localStorage.setItem('fields', JSON.stringify(fields, (key, value) => {
    if (typeof value === 'function') return undefined;
    return value;
  }));
}

function loadFieldsFromStorage() {
  const savedFields = JSON.parse(localStorage.getItem('fields')) || []
  fields = savedFields.map(fieldData => {
    const stages = fieldData.stages.map((stageData) => {
      return new Stage(stageData.id, stageData.name, stageData.description, stageData.startedOn)
    })

    const field = new Field(fieldData.name, fieldData.iconFakePath);
    field.stages = stages;
    
    return field;
  })
}

//loadFieldsFromStorage();

