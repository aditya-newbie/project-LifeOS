import { Stage } from "./stage.js";

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

const savedFields = JSON.parse(localStorage.getItem('fields')) || []

export const fields = savedFields.map(fieldData => {
  const stages = fieldData.stages.map((stageData) => {
    const milestones = stageData.milestones.map(milestone => {
      const newSteps = milestone.steps.filter(step => step.saved);
      milestone.steps = newSteps
      return milestone;
    })
    return new Stage(stageData.id, stageData.name, stageData.description, stageData.startedOn, milestones, stageData.completed)
  })

  const field = new Field(fieldData.name, fieldData.iconFakePath);
  field.stages = stages;
  
  return field;
})

export function saveToStorage() {
  localStorage.setItem('fields', JSON.stringify(fields, (key, value) => {
    if (typeof value === 'function') return undefined;
    return value;
  }));
}

