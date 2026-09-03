import {fields, saveToStorage, Field} from "../data/fields.js"
import {Stage} from "../data/stage.js";
import { getMilestone, getStage } from "./utils/data-utils.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { capitalize } from "./utils/format.js";

const addFieldButton = document.querySelector('.js-add-field-button');
const addFieldPopup = document.querySelector('.js-add-field-popup');
const addStageButton = document.querySelector('.js-add-stage-button');
const addStagePopup = document.querySelector('.js-add-stage-popup');
const fieldStageContainer = document.querySelector('.js-field-stages-wrapper');
let currentField;

renderFieldsCards();
renderFieldsStages();

addStagePopup.addEventListener('click' , (event) => {
  if (event.target === addStagePopup) {
    addStagePopup.close();
  }
})

addFieldButton.addEventListener('click' , () => {
  const fieldIcon = document.querySelector('.js-fieldicon-input');
  const fieldNameElement = document.querySelector('.js-fieldname-input');
  const fieldName = fieldNameElement.value.toUpperCase();

  if(!fieldNameElement.value) {
    alert('Enter field name');
    return;
  }

  fields.push(new Field(fieldName, fieldIcon.files[0]));
  fieldNameElement.value = '';
  
  addFieldPopup.close();
  renderFieldsCards();
  renderFieldsStages();
  saveToStorage();
});

addStageButton.addEventListener('click' , () => {
  const nameElement = document.querySelector('.js-add-stage-name');
  const name = nameElement.value.toUpperCase();
  const descriptionElement = document.querySelector('.js-add-stage-description');
  const description = capitalize(descriptionElement.value);
  const id = crypto.randomUUID();
  const today = dayjs().format('DD MMM YYYY');

  if(!nameElement.value) {
    alert('Enter stage name');
    return;
  }

  if(!descriptionElement.value) {
    alert('Enter stage description');
    return;
  }

      
  currentField.stages.push( new Stage(id, name, description, today));
  nameElement.value = '';
  descriptionElement.value = '';
  addStagePopup.close();
  renderFieldsStages();
  saveToStorage();
})

document.querySelector('.js-field-left-button')
    .addEventListener('click', () => {
      fieldStageContainer.scrollBy({
        left: -fieldStageContainer.clientWidth,
        behavior: 'smooth'
      })
    })
    
document.querySelector('.js-field-right-button')
    .addEventListener('click', () => {
      fieldStageContainer.scrollBy({
        left: fieldStageContainer.clientWidth,
        behavior: 'smooth'
      })
    })

function renderFieldsCards() {
  let fieldHTML = '';

  fields.forEach((field) => {
    // learn createElement and improve it 
    fieldHTML += `
    <a class="field-container" href="#${field.name}-roadmap">
      <p class="field">
         <img class="field-icon" src=${field.getIcon()}>${field.name}
      </p>
    </a>`
  })

  fieldHTML += `
  <div class="add-field js-add-field">
    <img class="add-field-img" style="width: 100%" src="images/add-field.png">
  </div>`

  document.querySelector('.js-field-selector').innerHTML = fieldHTML;

  attachAddFieldPopup();
}

function attachAddFieldPopup() {
  document.querySelector('.js-add-field')
      .addEventListener('click', () => {
        addFieldPopup.showModal();
      });

  document.querySelector('.js-back-popup-button')
      .addEventListener('click', () => {
        addFieldPopup.close();
      });
}

function renderFieldsStages() {
  let fieldsStagesHTML = '';

  fields.forEach((field) => {
    const cleanFieldName = field.name.replace(" ", "-")
    fieldsStagesHTML += `
    <div class="stage-cards-section js-stage-cards-section-${cleanFieldName}" id="${field.name}-roadmap">

      <h2 class="roadmap-heading">${field.name} ROADMAP</h2>

      ${renderStageCards(field)}

      <button class="add-stage-popup-button js-add-stage-popup-button" data-field-name="${field.name}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus add-stage-popup-button-icon"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        <p>Add Stage</p>
      </button>

    </div>`;

  })
  document.querySelector('.js-field-stages-wrapper').innerHTML = fieldsStagesHTML;

  updateEmptyField();
  attachAddStageButtons();
  addMilestoneColors(); 
  attachStageMenu();
  attachDeleteStage();
  updateStageContainer();
}

function attachAddStageButtons() {
  const addStagePopupButton = document.querySelectorAll('.js-add-stage-popup-button');

  addStagePopupButton.forEach(button => {
    button.addEventListener('click' , () => {
      const fieldName = button.dataset.fieldName;

      fields.forEach((field) => {
        if(field.name === fieldName) {
          currentField = field;   
        }
        addStagePopup.showModal();
      })
    })
  })
}

function updateStageContainer() {
  const stageContainer = document.querySelectorAll('.js-stage-card-container');

  
  if (!stageContainer) {
    return;
  }

  stageContainer.forEach(container => {
    if (container.innerHTML.trim() === '') {
    container.classList.add('empty')
  } else {container.classList.remove('empty')}
  })
}

function renderStageCards(field) {

  const currentStage = field.stages.find(stage => !stage.completed)
  let currentCardHTML = '';
  let completedCardsHTML = '';
  let upcomingCardsHTML = '';

  field.stages.forEach((stage, index) => {
    if (stage.completed) {
      completedCardsHTML += `
      <div class="stage-card completed-stage-card">

        <div class="stage-info">
          <p class="stage-number">STAGE ${stage.getStageNumber(index)}</p>
          <p class="stage-name">${stage.name}</p>
          <p class="stage-description">${stage.description}</p>
        </div>
        
        ${renderProgressNMilestones(stage)}

        <hr class="stage-hr">

        <div class="stage-card-footer">
          <div class="stage-start-date">
            <svg class="stage-calender-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
            <p class="stage-start-date-text">Started ${stage.startedOn}</p>
          </div>
          <div class="stage-task-status">
            <svg class="stage-task-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check-icon lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
            <p class="stage-task-status-text">31 of 60 tasks completed</p>
          </div>
          <a class="stage-view-details" href="roadmap.html?stageId=${stage.id}">
            <p class="stage-view-details-text">View Details</p>
            <svg class="stage-arrow-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

        <button class="stage-menu-button js-stage-menu-button" data-stage-id="${stage.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
        
        <div class="stage-menu-popup js-stage-menu-popup-${stage.id}">

          <button class="delete-stage-button js-delete-stage-button" data-stage-id="${stage.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="delete-stage-icon lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>

            <p class="delete-stage-text">Delete</p>
          </button>

        </div>

      </div>`
    } else if (stage === currentStage){
      currentCardHTML += `
      <div class="stage-card current-stage-card">

        <div class="stage-info">
          <p class="stage-number">STAGE ${stage.getStageNumber(index)}</p>
          <p class="stage-name">${stage.name}</p>
          <p class="stage-description">${stage.description}</p>
        </div>
        
        ${renderProgressNMilestones(stage)}

        <hr class="stage-hr">

        <div class="stage-card-footer">
          <div class="stage-start-date">
            <svg class="stage-calender-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
            <p class="stage-start-date-text">Started ${stage.startedOn}</p>
          </div>
          <div class="stage-task-status">
            <svg class="stage-task-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check-icon lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
            <p class="stage-task-status-text">31 of 60 tasks completed</p>
          </div>
          <a class="stage-view-details" href="roadmap.html?stageId=${stage.id}">
            <p class="stage-view-details-text">View Details</p>
            <svg class="stage-arrow-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

        <button class="stage-menu-button js-stage-menu-button" data-stage-id="${stage.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
        
        <div class="stage-menu-popup js-stage-menu-popup-${stage.id}">
    
          <button class="delete-stage-button js-delete-stage-button" data-stage-id="${stage.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="delete-stage-icon lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>

            <p class="delete-stage-text">Delete</p>
          </button>

        </div>

      </div>`
    } else {
      upcomingCardsHTML += `
      <div class="stage-card upcoming-stage-card">

        <div class="stage-info">
          <p class="stage-number">STAGE ${stage.getStageNumber(index)}</p>
          <p class="stage-name">${stage.name}</p>
          <p class="stage-description">${stage.description}</p>
        </div>
        
        ${renderProgressNMilestones(stage)}

        <hr class="stage-hr">

        <div class="stage-card-footer">
          <div class="stage-start-date">
            <svg class="stage-calender-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
            <p class="stage-start-date-text">Started ${stage.startedOn}</p>
          </div>
          <div class="stage-task-status">
            <svg class="stage-task-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check-icon lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
            <p class="stage-task-status-text">31 of 60 tasks completed</p>
          </div>
          <a class="stage-view-details" href="roadmap.html?stageId=${stage.id}">
            <p class="stage-view-details-text">View Details</p>
            <svg class="stage-arrow-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

        <button class="stage-menu-button js-stage-menu-button" data-stage-id="${stage.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
        
        <div class="stage-menu-popup js-stage-menu-popup-${stage.id}">

          <button class="delete-stage-button js-delete-stage-button" data-stage-id="${stage.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="delete-stage-icon lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>

            <p class="delete-stage-text">Delete</p>
          </button>

        </div>

      </div>`
    }
  })

  let stageCardsHTML = `
    <div class="stage-card-container completed-stage-card-container 
    js-stage-card-container js-completed-stage-card-container">
      ${completedCardsHTML}
    </div>
    <div class="stage-card-container current-stage-card-container 
    js-stage-card-container js-current-stage-card-container" >
      ${currentCardHTML}
    </div>
    <div class="stage-card-container upcoming-stage-card-container 
    js-stage-card-container js-upcoming-stage-card-container">
      ${upcomingCardsHTML}
    </div>`

  return stageCardsHTML;
}

function renderProgressNMilestones(stage) {
  let milestonesHTML = '';
  const emptyStateHTML = `
    <div class="stage-empty-state-ui">
      <p class="stage-empty-state-text">
        No milestones added yet
      </p>
      <a class="stage-add-milestone-anchor" href="roadmap.html?stageId=${stage.id}">
        <p class="stage-add-mileston-text">Add milestones</p>
        <svg class="stage-arrow-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>
    </div>`;

  const progressHTML = `
  <div class="stage-progress">
    <div class="stage-progress-count">
      <p class="stage-progress-percent">68%</p>
      <p class="stage-progress-label">Overall Progress</p>
    </div>

    <div class="stage-progress-meter">
      <div class="stage-completed">
        <p class="stage-progress-value-tooltip">Completed</p>
      </div>
      <div class="stage-in-progress">
        <p class="stage-progress-value-tooltip">In-progress</p>
      </div>
    </div>
  </div>`;

  stage.milestones.forEach(milestone => {
    milestonesHTML += `
    <div class="stage-milestone-preview">
      <div class="stage-milestone-color js-stage-milestone-color" data-stage-id="${stage.id}" data-milestone-id="${milestone.id}"></div>
      <div class="stage-milestone-info">
        <p class="stage-milestone-name">${milestone.name}</p>
        <p class="stage-task-percent">80%</p>
        <p class="stage-task-count">8/10</p>
      </div>
    </div>`
  })

  const progressNMilestonesHTML = progressHTML + `
  <div class="stage-milestone">
    ${milestonesHTML}
  </div>`
  
  if (stage.milestones.length === 0) {
    return emptyStateHTML
  } else {
    return progressNMilestonesHTML;
  }
}

function updateEmptyField() {

  fields.forEach(field => {
    const cleanFieldName = field.name.replace(" ", "-")
    const emptyFieldContainer = document.querySelector(`.js-stage-cards-section-${cleanFieldName}`);

    if (field.stages.length === 0) {
      const emptyFieldHTML = `
      <h2 class="roadmap-heading">${field.name} ROADMAP</h2>

      <div class="field-empty-state">

        <div class="stage-icon-background">
          <img src="images/lifeos-path-nodes-icon.svg" class="stage-icon">
        </div>
      
        <div class="field-empty-state-text">
          <p class="no-stage-text">
            No stages yet
          </p>
          <span class="field-empty-state-guide">
            start building your roadmap <br>
            by adding your first stage.
          </span>
        </div>

        <button class="add-stage-button-empty-state js-add-stage-popup-button" data-field-name="${field.name}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Stage
        </button>

      </div>`

      emptyFieldContainer.innerHTML = emptyFieldHTML;

    }
  })
}

function addMilestoneColors() {
  document.querySelectorAll('.js-stage-milestone-color').forEach(container => {
    const stageId = container.dataset.stageId;
    const stage = getStage(stageId, fields)
    const milestoneId = container.dataset.milestoneId;
    const milestone = getMilestone(milestoneId, stage.milestones)

    container.style.backgroundColor = milestone.colorSet.shade
  })
}

function attachStageMenu() {
  document.querySelectorAll('.js-stage-menu-button').forEach(button => {
    const stageId = button.dataset.stageId;
    const popup = document.querySelector(`.js-stage-menu-popup-${stageId}`);

    button.addEventListener('click', () => {
      popup.classList.toggle('open')
    })
  })
}

function attachDeleteStage() {
  document.querySelectorAll('.js-delete-stage-button').forEach(button => {
    button.addEventListener('click', () => {
      const stageId = button.dataset.stageId;
      const stage = getStage(stageId, fields);
  
      fields.forEach(field => {
        const newStages = field.stages.filter(stg => stage !== stg);
        field.stages = newStages;
      })
  
      renderFieldsStages();
      saveToStorage();
    })
  })
}




