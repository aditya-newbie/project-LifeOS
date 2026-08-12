import {fields, Field} from "../data/fields.js"
import {Stage} from "../data/stage.js";

const addFieldPopup = document.querySelector('.js-add-field-popup')

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

  document.querySelector('.js-add-field')
      .addEventListener('click', () => {
        addFieldPopup.showModal();
      })

  document.querySelector('.js-back-popup-button')
      .addEventListener('click', () => {
        addFieldPopup.close();
      })
  renderFieldsStages();
}

function attachAddFieldButton() {
  const addFieldButton = document.querySelector('.js-add-field-button');
  if (!addFieldButton) return;

  addFieldButton.addEventListener('click', () => {
    const fieldIcon = document.querySelector('.js-fieldicon-input');
    const fieldName = document.querySelector('.js-fieldname-input');

    fields.push(new Field(fieldName.value, fieldIcon.files[0]));
    addFieldPopup.close();
    console.log(fields);
    renderFieldsCards();
  });
}

function renderFieldsStages() {
  let fieldsStagesHTML = ''

  fields.forEach((field) => {
    fieldsStagesHTML += `
    <div class="stage-cards-section js-stage-cards-section">
        ${renderStageCards(field)}
      <div>
        <input class="temporary-name-input" placeholder="Name">
        <input class="temporary-description-input" placeholder="Description">
        <button class="add-stage-button" data-field-name="${field.name}">
          add
        </button>
      <div>
    </div>`;

  })
  console.log(fieldsStagesHTML);
  document.querySelector('.js-stage-cards-container').innerHTML = fieldsStagesHTML;

  attachAddStageButton();
}

function renderStageCards(field) {
  let currentCardHTML = '';
  let completedCardsHTML = '';
  let upcomingCardsHTML = '';

  field.stages.forEach((stage, index) => {
    if (stage.status === 'completed') {
      completedCardsHTML += `
      <div class="stage-card">

        <div class="stage-info">
          <p class="stage-number">STAGE ${stage.getStageNumber(index)}</p>
          <p class="stage-name">${stage.name}</p>
          <p class="stage-description">${stage.description}</p>
        </div>
        
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
        </div>

        <div class="stage-milestone">

          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">HTML</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">CSS</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">JavaScript</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">PRACTICE</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">Git & Github</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">PROJECT</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          
        </div>

        <hr class="stage-hr">

        <div class="stage-card-footer">
          <div class="stage-start-date">
            <svg class="stage-calender-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
            <p class="stage-start-date-text">Started 12 Jan 2025</p>
          </div>
          <div class="stage-task-status">
            <svg class="stage-task-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check-icon lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
            <p class="stage-task-status-text">31 of 60 tasks completed</p>
          </div>
          <a class="stage-view-details">
            <p class="stage-view-details-text">View Details</p>
            <svg class="stage-arrow-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

      </div>`
    } else if (stage.status === 'current'){
      currentCardHTML += `
      <div class="stage-card">

        <div class="stage-info">
          <p class="stage-number">STAGE ${stage.getStageNumber(index)}</p>
          <p class="stage-name">${stage.name}</p>
          <p class="stage-description">${stage.description}</p>
        </div>
        
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
        </div>

        <div class="stage-milestone">

          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">HTML</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">CSS</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">JavaScript</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">PRACTICE</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">Git & Github</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">PROJECT</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          
        </div>

        <hr class="stage-hr">

        <div class="stage-card-footer">
          <div class="stage-start-date">
            <svg class="stage-calender-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
            <p class="stage-start-date-text">Started 12 Jan 2025</p>
          </div>
          <div class="stage-task-status">
            <svg class="stage-task-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check-icon lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
            <p class="stage-task-status-text">31 of 60 tasks completed</p>
          </div>
          <a class="stage-view-details">
            <p class="stage-view-details-text">View Details</p>
            <svg class="stage-arrow-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

      </div>`
    } else {
      upcomingCardsHTML += `
      <div class="stage-card">

        <div class="stage-info">
          <p class="stage-number">STAGE ${stage.getStageNumber(index)}</p>
          <p class="stage-name">${stage.name}</p>
          <p class="stage-description">${stage.description}</p>
        </div>
        
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
        </div>

        <div class="stage-milestone">

          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">HTML</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">CSS</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">JavaScript</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">PRACTICE</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">Git & Github</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          <div class="stage-milestone-preview">
            <div class="stage-milestone-color"></div>
            <div class="stage-milestone-info">
              <p class="stage-milestone-name">PROJECT</p>
              <p class="stage-task-percent">80%</p>
              <p class="stage-task-count">8/10</p>
            </div>
          </div>
          
        </div>

        <hr class="stage-hr">

        <div class="stage-card-footer">
          <div class="stage-start-date">
            <svg class="stage-calender-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
            <p class="stage-start-date-text">Started 12 Jan 2025</p>
          </div>
          <div class="stage-task-status">
            <svg class="stage-task-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check-icon lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
            <p class="stage-task-status-text">31 of 60 tasks completed</p>
          </div>
          <a class="stage-view-details">
            <p class="stage-view-details-text">View Details</p>
            <svg class="stage-arrow-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

      </div>`
    }
  })

  let stageCardsHTML = `
    <div class="completed-stage-card">
      ${completedCardsHTML}
    </div>
    <div class="current-stage-card">
      ${currentCardHTML}
    </div>
    <div class="upcoming-stage-card">
      ${upcomingCardsHTML}
    </div>`

  return stageCardsHTML;
}


                 
function attachAddStageButton() {
  document.querySelectorAll('.add-stage-button').forEach((button) => {
    button.addEventListener('click', () => {
      const fieldName = button.dataset.fieldName;
      const name = document.querySelector('.temporary-name-input');
      const description = document.querySelector('.temporary-description-input');
      let matchingField;

      fields.forEach((field) => {
        if(field.name === fieldName) {
          matchingField = field;
        }
      })

      matchingField.stages.push( new Stage(name.value, description.value));
      console.log(matchingField.stages);
      renderFieldsCards();
    })
  })
}
//               ^
//fix this later.|

renderFieldsCards();
attachAddFieldButton();
renderFieldsStages();

