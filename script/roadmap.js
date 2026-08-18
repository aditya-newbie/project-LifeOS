import {fields} from "../data/fields.js";

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

console.log(stage);*/

const testMilestones = fields[0].stages[0].milestones

const milestoneCountElement = document.querySelector('.js-milestone-count')

milestoneCountElement.textContent = testMilestones.length;

renderMilestoneCards(testMilestones)

function renderMilestoneCards(milestones) {
  let milestoneHTML = '';

  milestones.forEach((milestone, index) => {
    milestoneHTML += `
    <div class="milestone-card">
      <label class="milestone-checkbox-container" for="milestone-functional-checkbox-${index}">
        <input type="checkbox" class="milestone-functional-checkbox js-milestone-functional-checkbox js-milestone-functional-checkbox-${milestone.id}" id="milestone-functional-checkbox-${index}" data-milestone-id="${milestone.id}">
        <span class="milestone-visual-checkbox js-milestone-visual-checkbox" data-milestone-id="${milestone.id}">
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

            <button class="extend-milestone">
              <svg
                class="extend-milestone-icon"
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
          </div>
        </div>
        <div class="steps-card">
          ${renderStepsCard(milestone.steps)}
        </div>
      </div>
    </div>`;
  })
  document.querySelector('.js-milestone-card-container').innerHTML = milestoneHTML;

  attachMilestoneCheckmark();
  updateMilestoneCheckmarks();
}

function attachMilestoneCheckmark() {
  document.querySelectorAll('.js-milestone-functional-checkbox').forEach(trueCheckbox => {
    let milestone;
    const milestoneId = trueCheckbox.dataset.milestoneId;
    testMilestones.forEach(testMilestone => {
      if (testMilestone.id === milestoneId) {
        milestone = testMilestone;
      }
    })

    trueCheckbox.addEventListener('click' , () => {
      console.log('clicked');
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

  console.log(testMilestones);
  //console.log(currentMilestone, reverseMilestones, lastCompletedMilestone);
  
  document.querySelectorAll('.js-milestone-visual-checkbox').forEach(visualCheckbox => {
    visualCheckbox.classList.remove('completed');
    visualCheckbox.classList.remove('in-progress');

    let milestone;
    const milestoneId = visualCheckbox.dataset.milestoneId;
    testMilestones.forEach(testMilestone => {
      if (testMilestone.id === milestoneId) {
        milestone = testMilestone;
      }
    })

    console.log(milestone);
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

    console.log(visualCheckbox)
  })
}

function renderStepsCard(steps) {
  let stepsHTML = '';
  steps.forEach((step) => {
    stepsHTML += `
    <div class="step">
      <label class="step-checkbox-container" for="step-functional-checkbox-1">
        <input type="checkbox" class="step-functional-checkbox js-step-functional-checkbox" id="step-functional-checkbox-1">
        <span class="step-checkbox js-step-checkbox">
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
      <p class="step-text">${step}</p>
    </div>`
  })
  return stepsHTML;
}