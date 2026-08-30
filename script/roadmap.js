import {fields, addFieldsToStorage} from "../data/fields.js";
import {MileStone , Step} from "../data/stage.js";
import { getUniqueColor } from "./utils/colors.js";
import { getMilestone, getStep } from "./utils/data-utils.js";
import { capitalize } from "./utils/format.js";

const param = new URLSearchParams(window.location.search);
const stageId = param.get("stageId");
let stage;

fields.forEach(field => {
  field.stages.forEach(stg => {
    if (stg.id === stageId) {
      stage = stg
    }
  })
})

const addMilestonePopup = document.querySelector('.js-add-milestone-popup')
const startedOn = document.querySelector('.js-started-on')
const stageName = document.querySelector('.js-stage-name');
const stageDescription = document.querySelector('.js-stage-description');

startedOn.textContent = stage.startedOn;
stageName.textContent = stage.name;
stageDescription.textContent = stage.description;


renderMilestoneCards(stage.milestones);
updateMilestoneCount();

document.querySelector('.js-add-milestone-button').addEventListener('click', () => {
  addMilestonePopup.showModal();
})

document.querySelector('.js-save-milestone-button').addEventListener('click', () => {
  const nameElement = document.querySelector('.js-milestone-name-input');
  const name = capitalize(nameElement.value);
  const descriptionElement = document.querySelector('.js-milestone-description-input');
  const description = capitalize(descriptionElement.value);
  const id = crypto.randomUUID();
  const colorSet = getUniqueColor(stage.milestones);

  if (!name) {
    nameElement.focus()
    return;
  }

  stage.milestones.push(new MileStone(id, name, description, colorSet));
  addMilestonePopup.close();
  addFieldsToStorage();
  renderMilestoneCards(stage.milestones);
  updateMilestoneCount();
  
  nameElement.value = '';
  descriptionElement.value = '';
})

function updateMilestoneCount() {
  const milestoneCount = document.querySelector('.js-milestone-count')
  milestoneCount.textContent = stage.milestones.length;
}

function renderMilestoneCards(milestones) {
  let milestoneHTML = '';

  milestones.forEach((milestone, index) => {
    milestoneHTML += `
    <div class="milestone-card">
      <label class="milestone-checkbox-container" for="milestone-functional-checkbox-${index}">
        <input type="checkbox" class="milestone-functional-checkbox js-milestone-functional-checkbox js-milestone-functional-checkbox-${milestone.id}" id="milestone-functional-checkbox-${index}" data-milestone-id="${milestone.id}">
        <span class="milestone-visual-checkbox js-milestone-visual-checkbox js-milestone-visual-checkbox-${milestone.id}" data-milestone-id="${milestone.id}">
          <svg
            class="checkmark-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M 9 17 L 4 12" />
            <path d="M22.5 4 L9 17" />
          </svg>
        </span>
      </label>
      <div class="milestone-detials-and-step-cards-container">
        <div class="milestone-details">
          <div class="milestone-icon-background">
            <svg
              class="flag-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" />
            </svg>
          </div>

          <div>
            <p class="milestone-name">
              ${milestone.name}
            </p>

            <p class="milestone-description">
              ${milestone.description}
            </p>

            <button class="expand-milestone js-expand-milestone js-expand-milestone-${milestone.id}" data-milestone-id="${milestone.id}">
              <svg
                class="expand-milestone-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 15 L20 9" />
                <path d="M4 9 L12 15" />
              </svg>
            </button>
            
            <button class="milestone-menu-button js-milestone-menu-button" data-milestone-id="${milestone.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
            
            <div class="milestone-menu-popup js-milestone-menu-popup-${milestone.id}">
            
              <button class="add-step-button js-add-step-button" data-milestone-id="${milestone.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="add-step-icon lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Add Step
              </button>

              <button class="delete-milestone-button js-delete-milestone-button" data-milestone-id="${milestone.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="delete-milestone-icon lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>

                <p class="delete-milestone-text">Delete</p>
              </button>

            </div>
          </div>
        </div>
        <div class="steps-card-container js-steps-card-container js-steps-card-container-${milestone.id}">
          <div class="steps-card">
          ${renderStepsCard(milestone.steps)}
          </div>
        </div>
        
      </div>
    </div>`;
  })
  document.querySelector('.js-milestone-card-container').innerHTML = milestoneHTML;

  attachMilestoneCheckmark();
  updateMilestoneCheckmarks();
  attachExpandMilestoneCard();
  attachMilestoneMenu();
  attachAddStepButton();
  attachDeleteMilestone();

  attachStepCheckbox();
  updateStepCheckbox();
  updateStepCard();

}

function attachMilestoneCheckmark() {
  document.querySelectorAll('.js-milestone-functional-checkbox').forEach(trueCheckbox => {
    const milestoneId = trueCheckbox.dataset.milestoneId;
    const milestone = getMilestone(milestoneId, stage.milestones);

    trueCheckbox.addEventListener('click' , () => {
      if (!milestone.completed) {
        milestone.completed = true;
      } else{ milestone.completed = false;}

      updateMilestoneCheckmarks();
      addFieldsToStorage();
    })
  })
}

function updateMilestoneCheckmarks() {
  const currentMilestone = stage.milestones.find(milestone => !milestone.completed);
  const reverseMilestones = stage.milestones.slice().reverse();
  const lastCompletedMilestone = reverseMilestones.find(milestone => milestone.completed);

  document.querySelectorAll('.js-milestone-visual-checkbox').forEach(visualCheckbox => {
    visualCheckbox.classList.remove('completed');
    visualCheckbox.classList.remove('in-progress');

    const milestoneId = visualCheckbox.dataset.milestoneId;
    const milestone = getMilestone(milestoneId, stage.milestones);

    const trueCheckbox = document.querySelector(`.js-milestone-functional-checkbox-${milestoneId}`);
    trueCheckbox.disabled = false;

    if (milestone.completed) {
      visualCheckbox.classList.add('completed')

      if (milestone !== lastCompletedMilestone) {
        trueCheckbox.disabled = true;
      }
    } else if ( milestone === currentMilestone) {
      visualCheckbox.classList.add('in-progress')
    } else {trueCheckbox.disabled = true;}

  })
}

function expandMilestoneCard(milestoneId) {


  const stepsCardContainer = document.querySelector(`.js-steps-card-container-${milestoneId}`);
  const visualCheckbox = document.querySelector(`.js-milestone-visual-checkbox-${milestoneId}`);
  const expandButton = document.querySelector(`.js-expand-milestone-${milestoneId}`);

  document.querySelectorAll(`.js-steps-card-container:not(.js-steps-card-container-${milestoneId})`)
  .forEach(container => container.classList.remove('expanded'));
  document.querySelectorAll(`.js-milestone-visual-checkbox:not(.js-milestone-visual-checkbox-${milestoneId})`)
  .forEach(checkbox => checkbox.classList.remove('expanded'));
  document.querySelectorAll(`.js-expand-milestone:not(.js-expand-milestone-${milestoneId})`)
  .forEach(checkbox => checkbox.classList.remove('expanded'));

  stepsCardContainer.classList.toggle('expanded');
  visualCheckbox.classList.toggle('expanded');
  expandButton.classList.toggle('expanded')

  updateExpandButton(milestoneId)
}

function updateExpandButton(milestoneId) {
  const expandButton = document.querySelector(`.js-expand-milestone-${milestoneId}`);

  if (expandButton.classList.contains('expanded')) {

    expandButton.innerHTML = `
    <svg
      class="expand-milestone-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 9 L4 15" />
      <path d="M20 15 L12 9" />
    </svg>` 
  } else {
    expandButton.innerHTML = `
    <svg
      class="expand-milestone-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 15 L20 9" />
      <path d="M4 9 L12 15" />
    </svg>`
  }
}

function expandCheckboxHeight(id) {
  const milestone = getMilestone(id, stage.milestones);
  const stepsCount = milestone.steps.length;
  const lineHeight = stepsCount * 3 + 9
  const root = document.documentElement;


  root.style.setProperty('--line-height', `${lineHeight}rem`)
}

function attachExpandMilestoneCard() {
  document.querySelectorAll('.js-expand-milestone').forEach(expandButton => {
    expandButton.addEventListener('click', () => {
      const milestoneId = expandButton.dataset.milestoneId;
      
      expandMilestoneCard(milestoneId);
      expandCheckboxHeight(milestoneId);
    })
  })
}

function attachMilestoneMenu() {
  document.querySelectorAll('.js-milestone-menu-button').forEach(button => {
    const milestoneId = button.dataset.milestoneId;
    const popup = document.querySelector(`.js-milestone-menu-popup-${milestoneId}`);

    button.addEventListener('click', () => {
      popup.classList.toggle('open')
    })
  })
}

function attachAddStepButton() {
  document.querySelectorAll('.js-add-step-button').forEach((button) => {
    button.addEventListener('click', () => {
      const milestoneId = button.dataset.milestoneId;
      const milestone = getMilestone(milestoneId, stage.milestones);
      const id = crypto.randomUUID();
      milestone.steps.push(new Step(id));

      renderMilestoneCards(stage.milestones);

      expandMilestoneCard(milestoneId);
      expandCheckboxHeight(milestoneId);
    })
  })
}

function attachDeleteMilestone() {
  document.querySelectorAll(`.js-delete-milestone-button`).forEach(button => {
    const milestoneId = button.dataset.milestoneId;
    const milestone = getMilestone(milestoneId, stage.milestones);

    button.addEventListener('click', () => {
      const newMilestones  = stage.milestones.filter(milestn => milestn !== milestone)
      stage.milestones = newMilestones;
      addFieldsToStorage();
      renderMilestoneCards(stage.milestones);
    })
  })
}

function updateStepCard() {
  stage.milestones.forEach(milestone => {
    milestone.steps.forEach(step => {
      if (step.name) {
        return;
      }
  
      const stepCard = document.querySelector(`.js-step-${step.id}`)
      const unsavedStepHTML = `
      <div class="unsaved-step">
        <input class="step-name-input js-step-name-input-${step.id}" type="text" placeholder="Step name">
        <button class="save-step-button js-save-step-button" data-step-id="${step.id}" data-milestone-id="${milestone.id}">
          Save
        </button>
      </div>`
  
      stepCard.innerHTML = unsavedStepHTML;
  
      document.querySelector(`.js-step-name-input-${step.id}`).focus();
      attachSaveStepButton();
  })

  })
}

function attachSaveStepButton() {
  document.querySelectorAll('.js-save-step-button').forEach(button => {
    button.addEventListener('click', () => {
      const stepId = button.dataset.stepId;
      const step = getStep(stepId, stage.milestones);
      const milestoneId = button.dataset.milestoneId;
      const nameElement = document.querySelector(`.js-step-name-input-${stepId}`);

      if (!nameElement.value.trim()) {
        nameElement.focus();
        return;
      }
  
      step.name = nameElement.value;
      step.saved = true;

      renderMilestoneCards(stage.milestones);
  
      expandMilestoneCard(milestoneId);
      expandCheckboxHeight(milestoneId);
      updateStepCard();

      addFieldsToStorage();
    })
  })
}

function renderStepsCard(steps) {
  let stepsHTML = '';
  steps.forEach((step) => {
    stepsHTML += `
    <div class="step js-step-${step.id}">
      <div class="step-checkbox js-step-checkbox" data-step-id="${step.id}">
        <svg
          class="checkmark-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M 9 17 L 4 12" />
          <path d="M22.5 4 L9 17" />
        </svg>
      </div>
      <p class="step-text">${step.name}</p>
    </div>`
  })
  return stepsHTML;
}

function attachStepCheckbox() {
  document.querySelectorAll('.js-step-checkbox').forEach(checkbox => {
    const stepId = checkbox.dataset.stepId;
    const step = getStep(stepId, stage.milestones);
    
    checkbox.addEventListener('click' , () => {
      if (step.completed === false) {
        step.completed = true;
      } else{step.completed = false;}

      updateStepCheckbox();
      addFieldsToStorage();
    })
  })
}

function updateStepCheckbox() {
  document.querySelectorAll('.js-step-checkbox').forEach(checkbox => {
    const stepId = checkbox.dataset.stepId;
    const step = getStep(stepId, stage.milestones);

    if(step.completed) {
      checkbox.classList.add('completed') 
    } else {checkbox.classList.remove('completed')}
  })
}


