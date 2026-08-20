import {fields} from "../data/fields.js";
import {MileStone} from "../data/stage.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

/*const param = new URLSearchParams(window.location.search);
const stageId = param.get("stageId");
let stage;

fields.forEach(field => {
  field.stages.forEach(stg => {
    if (stg.id === stageId) {
      stage = stg
    }
  })
})
*/

const testMilestones = fields[0].stages[0].milestones
const addMilestonePopup = document.querySelector('.js-add-milestone-popup')
const milestoneCountElement = document.querySelector('.js-milestone-count')

milestoneCountElement.textContent = testMilestones.length;

renderMilestoneCards(testMilestones)

document.querySelector('.js-add-milestone-button').addEventListener('click', () => {
  addMilestonePopup.showModal();
})

document.querySelector('.js-save-milestone-button').addEventListener('click', () => {
  const name = document.querySelector('.js-milestone-name-input').value;
  const description = document.querySelector('.js-milestone-description-input').value;
  const id = crypto.randomUUID();

  testMilestones.push(new MileStone(id, name, description));
  addMilestonePopup.close();
  renderMilestoneCards(testMilestones);
})

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
            <button class="add-step-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="add-step-icon lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Add Step
            </button>
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
  attachExpandndMilestoneCard();
  attachStepCheckbox();
}

function attachMilestoneCheckmark() {
  document.querySelectorAll('.js-milestone-functional-checkbox').forEach(trueCheckbox => {
    const milestoneId = trueCheckbox.dataset.milestoneId;
    const milestone = getMilestone(milestoneId);

    trueCheckbox.addEventListener('click' , () => {
      if (!milestone.completed) {
        milestone.completed = true;
      } else{ milestone.completed = false;}

      updateMilestoneCheckmarks();
    })
  })
}

function updateMilestoneCheckmarks() {
  const currentMilestone = testMilestones.find(milestone => !milestone.completed);
  const reverseMilestones = testMilestones.slice().reverse();
  const lastCompletedMilestone = reverseMilestones.find(milestone => milestone.completed);

  document.querySelectorAll('.js-milestone-visual-checkbox').forEach(visualCheckbox => {
    visualCheckbox.classList.remove('completed');
    visualCheckbox.classList.remove('in-progress');

    const milestoneId = visualCheckbox.dataset.milestoneId;
    const milestone = getMilestone(milestoneId);

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

function attachExpandndMilestoneCard() {
  document.querySelectorAll('.js-expand-milestone').forEach(expandButton => {
    expandButton.addEventListener('click', () => {
      const milestoneId = expandButton.dataset.milestoneId;
      const stepsCardContainer = document.querySelector(`.js-steps-card-container-${milestoneId}`);
      const visualCheckbox = document.querySelector(`.js-milestone-visual-checkbox-${milestoneId}`);

      document.querySelectorAll(`.js-steps-card-container:not(.js-steps-card-container-${milestoneId})`)
      .forEach(container => container.classList.remove('expanded'));
      document.querySelectorAll(`.js-milestone-visual-checkbox:not(.js-milestone-visual-checkbox-${milestoneId})`)
      .forEach(checkbox => checkbox.classList.remove('expanded'));
      document.querySelectorAll(`.js-expand-milestone:not(.js-expand-milestone-${milestoneId})`)
      .forEach(checkbox => checkbox.classList.remove('expanded'));

      stepsCardContainer.classList.toggle('expanded');
      visualCheckbox.classList.toggle('expanded');
      expandButton.classList.toggle('expanded')

      expandCheckboxHeight(milestoneId);
      updateExpandButton();
    })
  })
}

function updateExpandButton() {
  const expandedButton = document.querySelector('.js-expand-milestone.expanded');
  const normalButton = document.querySelector('.js-expand-milestone');

  normalButton.innerHTML = `
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


  if (!expandedButton) {
    return;
  }

  expandedButton.innerHTML = `
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
}

function expandCheckboxHeight(id) {
  const milestone = getMilestone(id);
  const stepsCount = milestone.steps.length;
  const lineHeight = stepsCount * 3 + 9
  const root = document.documentElement;


  root.style.setProperty('--line-height', `${lineHeight}rem`)
}

function renderStepsCard(steps) {
  let stepsHTML = '';
  steps.forEach((step) => {
    stepsHTML += `
    <div class="step">
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
    const step = getStep(stepId);
    
    checkbox.addEventListener('click' , () => {
      if (step.completed === false) {
        step.completed = true;
      } else{step.completed = false;}

      checkbox.classList.toggle('completed')
    })

  })
}
























//move this else where
function getMilestone(id) {
  let milestone;
  testMilestones.forEach(testMilestone => {
    if (testMilestone.id === id) {
      milestone = testMilestone;
    }
  })

  return milestone;
}

function getStep(id) {
   let step;
  testMilestones.forEach(testMilestone => {
    testMilestone.steps.forEach(stp => {
      if (stp.id === id) {
        step = stp;
      }
    })
  })
  return step;
}