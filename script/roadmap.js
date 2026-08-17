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

console.log(testMilestones);

function renderMilestoneCards(milestones) {
  const currentMilstone = milestones.find(milestone => !milestone.completed)
  let milestoneHTML = '';

  milestones.forEach(milestone => {
    milestoneHTML += `
    <div class="milestone-card">
      <label class="milestone-checkbox-container" for="milestone-functional-checkbox-2">
        <input type="checkbox" class="milestone-functional-checkbox" id="milestone-functional-checkbox-2">
        <span class="milestone-checkbox in-progress">
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
            <p class="step-text">step step</p>
          </div>
        </div>
      </div>
    </div>`;
  })
}