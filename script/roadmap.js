import { fields, saveToStorage } from "../data/fields.js";
import { MileStone, Step, Task } from "../data/stage.js";
import { getUniqueColor } from "./utils/colors.js";
import { getMilestone, getMilestoneProgress, getStage, getStageTask, getStep, getTask } from "./utils/data-utils.js";
import { capitalize } from "./utils/format.js";
import { dialogToast } from './utils/notification.js';

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
const addMilestoneButton = document.querySelector('.js-add-milestone-button')
const cancelMilestonePopup = document.querySelector('.js-cancel-add-milestone')
const startedOn = document.querySelector('.js-started-on')
const stageName = document.querySelector('.js-stage-name');
const stageDescription = document.querySelector('.js-stage-description');
let timeoutID
let previousExpandedMilestoneId = null;
let taskProgressOpen = false;

startedOn.textContent = stage.startedOn;
stageName.textContent = stage.name;
stageDescription.textContent = stage.description;


renderMilestoneCards(stage.milestones);
updateMilestoneCount()
updateDashboard();

document.body.addEventListener('click', (event) => {
  const addMilestoneButton = document.querySelectorAll('.js-add-milestone-button');

  if (!addMilestonePopup.contains(event.target) && ![...addMilestoneButton].some(button => button.contains(event.target))) {
    addMilestonePopup.classList.remove('show');
  }
})

document.body.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    addMilestonePopup.classList.remove('show');
  }
})


addMilestoneButton.addEventListener('click', () => {
  addMilestonePopup.classList.add('show');
})

cancelMilestonePopup.addEventListener('click', () => {
  addMilestonePopup.classList.remove('show');
})

document.querySelector('.js-save-milestone-button').addEventListener('click', () => {
  const nameElement = document.querySelector('.js-milestone-name-input');
  const name = capitalize(nameElement.value);
  const descriptionElement = document.querySelector('.js-milestone-description-input');
  const description = capitalize(descriptionElement.value);
  const id = crypto.randomUUID();
  const colorSet = getUniqueColor(stage.milestones);

  if (!name) {
    timeoutID = dialogToast('Milestone Name Required', 'Enter a name for your milestone', timeoutID)
    nameElement.focus()
    return;
  }

  stage.milestones.push(new MileStone(id, name, description, colorSet));
  addMilestonePopup.classList.remove('show');
  saveToStorage();
  renderMilestoneCards(stage.milestones);
  updateMilestoneCount();
  updateDashboard();

  nameElement.value = '';
  descriptionElement.value = '';
})

document.querySelector('.js-add-task-button').addEventListener('click', () => {
  const milestoneButton = document.querySelector('.js-expand-milestone.expanded');
  if (!milestoneButton) {
    return;
  }
  const milestoneId = milestoneButton.dataset.milestoneId;
  const milestone = getMilestone(milestoneId, stage.milestones);
  const id = crypto.randomUUID();

  milestone.tasks.push(new Task(id));
  updateTaskbox(milestoneId);
  updateTask();
  saveToStorage();
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
        <span class="milestone-visual-checkbox js-milestone-visual-checkbox js-milestone-visual-checkbox-${milestone.id}" data-milestone-id="${milestone.id}"></span>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="milestone-three-dot lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
            
            <div class="milestone-menu-popup  js-milestone-menu-popup js-milestone-menu-popup-${milestone.id}">
            
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
          <div class="steps-card js-steps-card-${milestone.id}">
          ${renderStepsCard(milestone.steps, milestone.id)}
          </div>
        </div>
        
      </div>
    </div>`;
  })
  document.querySelector('.js-milestone-card-container').innerHTML = milestoneHTML;

  updateEmptyMilestone();
  attachMilestoneCheckbox();
  updateMilestoneCheckmarks();
  attachToggleMilestoneCard();
  attachMilestoneMenu();
  attachAddStepButton();
  attachDeleteMilestone();

  updateEmptySteps();
  attachStepCheckbox();
  updateStepCheckbox();
  attachRemoveStep();
  updateStepCard();
}

function updateEmptyMilestone() {
  const emptyMilestoneHTML = `
  <div class="empty-milestone-state">
    <div class="milestone-icon-background-empty-state">
      <svg
        class="flag-icon-empty-state"
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

    <div class="milestone-empty-state-text">
      <p class="no-milestone-text">
        No milestones yet
      </p>
      <span class="milestone-empty-state-guide">
        Break down this stage by adding milestones. <br>
        it helps you track progress better.
      </span>
    </div>
  </div>`

  if (stage.milestones.length === 0) {
    document.querySelector('.js-milestone-card-container').innerHTML = emptyMilestoneHTML;
  }
}

function attachMilestoneCheckbox() {
  document.querySelectorAll('.js-milestone-functional-checkbox').forEach(trueCheckbox => {
    const milestoneId = trueCheckbox.dataset.milestoneId;
    const milestone = getMilestone(milestoneId, stage.milestones);

    trueCheckbox.addEventListener('click', () => {
      if (!milestone.completed) {
        milestone.completed = true;
      } else { milestone.completed = false; }

      updateMilestoneCheckmarks();
      console.log(stage.milestones , milestone);
      updateDashboard();
      saveToStorage();  const currentMilestone = stage.milestones.find(m => !m.completed)
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

      visualCheckbox.innerHTML = `
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
      </svg>`

      if (milestone !== lastCompletedMilestone) {
        trueCheckbox.disabled = true;
      }

    } else if (milestone === currentMilestone) {
      visualCheckbox.classList.add('in-progress');
      visualCheckbox.innerHTML = '';
    } else {
      trueCheckbox.disabled = true;
      visualCheckbox.innerHTML = '';
    }

  })
}

function expandMilestoneCard(milestoneId) {
  const stepsCardContainer = document.querySelector(`.js-steps-card-container-${milestoneId}`);
  const visualCheckbox = document.querySelector(`.js-milestone-visual-checkbox-${milestoneId}`);
  const expandButton = document.querySelector(`.js-expand-milestone-${milestoneId}`);
  const taskProgressContainer = document.querySelector('.js-task-progress-container');

  stepsCardContainer.classList.add('expanded');
  visualCheckbox.classList.add('expanded');
  expandButton.classList.add('expanded');
  taskProgressContainer.classList.add('expanded');

  updateExpandButton();
  expandCheckboxHeight(milestoneId);
  updateTaskbox(milestoneId);
  updateProgressBox(milestoneId);
  updateDashboard();
  taskProgressOpen = true;
  previousExpandedMilestoneId = milestoneId;
}

function toggleMilestoneCard(milestoneId) {


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

  updateExpandButton()
}

function updateExpandButton() {

  document.querySelectorAll(`.js-expand-milestone`).forEach(expandButton => {

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
  })

}

function expandCheckboxHeight(id) {
  const milestone = getMilestone(id, stage.milestones);
  const stepsCount = milestone.steps.length;
  const lineHeight = stepsCount === 0 ? 12 : stepsCount * 3 + 9
  const root = document.documentElement;


  root.style.setProperty('--line-height', `${lineHeight}rem`)
}

function attachToggleMilestoneCard() {
  document.querySelectorAll('.js-expand-milestone').forEach(expandButton => {
    expandButton.addEventListener('click', () => {
      const milestoneId = expandButton.dataset.milestoneId;

      toggleMilestoneCard(milestoneId);
      expandCheckboxHeight(milestoneId);
      toggleTaskProgress(milestoneId);

      previousExpandedMilestoneId = milestoneId;
    })
  })
}

function attachMilestoneMenu() {
  const buttons = document.querySelectorAll('.js-milestone-menu-button');
  const popups = document.querySelectorAll('.js-milestone-menu-popup');

  buttons.forEach(button => {
    const milestoneId = button.dataset.milestoneId;
    const thisPopup = document.querySelector(`.js-milestone-menu-popup-${milestoneId}`);

    button.addEventListener('click', () => {
      thisPopup.classList.toggle('open')
    })
  })

  document.body.addEventListener('click', (event) => {
    const close = ![...popups].some(popup => popup.contains(event.target)) && ![...buttons].some(button => button.contains(event.target));

    if (close) {
      [...popups].forEach(popup => popup.classList.remove('open'));
    }
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
    })
  })
}

function attachDeleteMilestone() {
  document.querySelectorAll(`.js-delete-milestone-button`).forEach(button => {
    const milestoneId = button.dataset.milestoneId;
    const milestone = getMilestone(milestoneId, stage.milestones);

    button.addEventListener('click', () => {
      const newMilestones = stage.milestones.filter(milestn => milestn !== milestone)
      stage.milestones = newMilestones;
      saveToStorage();
      renderMilestoneCards(stage.milestones);
      updateMilestoneCount();
      updateDashboard();
    })
  })
}

function renderStepsCard(steps, milestoneId) {
  let stepsHTML = '';
  steps.forEach((step) => {
    stepsHTML += `
    <div class="step js-step-${step.id}">
      <div class="step-checkbox js-step-checkbox" data-step-id="${step.id}" data-milestone-id="${milestoneId}">
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
      <button class="remove-step js-remove-step" data-step-id="${step.id}" data-milestone-id="${milestoneId}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>`
  })
  return stepsHTML;
}

function updateEmptySteps() {
  const emptyStepsCardHTML = `<p class="no-step-text">No steps yet</p>`
  stage.milestones.forEach(milestone => {
    if (milestone.steps.length === 0) {
      document.querySelector(`.js-steps-card-${milestone.id}`).innerHTML = emptyStepsCardHTML;
    }
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
      updateProgressBox(milestoneId)
      updateDashboard();
      saveToStorage();
    })
  })
}

function attachStepCheckbox() {
  document.querySelectorAll('.js-step-checkbox').forEach(checkbox => {
    const stepId = checkbox.dataset.stepId;
    const step = getStep(stepId, stage.milestones);

    checkbox.addEventListener('click', () => {
      if (step.completed === false) {
        step.completed = true;
      } else { step.completed = false; }

      updateStepCheckbox();
      updateProgressBox(checkbox.dataset.milestoneId);
      updateDashboard();
      saveToStorage();
    })
  })
}

function updateStepCheckbox() {
  document.querySelectorAll('.js-step-checkbox').forEach(checkbox => {
    const stepId = checkbox.dataset.stepId;
    const step = getStep(stepId, stage.milestones);

    if (step.completed) {
      checkbox.classList.add('completed')
    } else { checkbox.classList.remove('completed') }
  })
}

function attachRemoveStep() {
  document.querySelectorAll('.js-remove-step').forEach(button => {
    button.addEventListener('click', () => {
      const stepId = button.dataset.stepId;
      const milestoneId = button.dataset.milestoneId;
      const step = getStep(stepId, stage.milestones);

      const newMilestones = stage.milestones.map(milestone => {
        const newSteps = milestone.steps.filter(s => s !== step)
        milestone.steps = newSteps;
        return milestone
      })

      stage.milestones = newMilestones;
      renderMilestoneCards(stage.milestones);
      expandMilestoneCard(milestone.id);
      updateProgressBox(milestoneId);
      updateDashboard();

      saveToStorage();
    })
  })
}

function toggleTaskProgress(milestoneId) {
  const taskProgressContainer = document.querySelector('.js-task-progress-container');

  if (!taskProgressOpen) {
    taskProgressContainer.classList.add('expanded');
    taskProgressOpen = true;
  } else if (previousExpandedMilestoneId === milestoneId) {
    taskProgressContainer.classList.remove('expanded');
    taskProgressOpen = false;
  }

  updateTaskbox(milestoneId);
  updateProgressBox(milestoneId)
  updateDashboard();
}


function updateTaskbox(milestoneId) {
  const milestone = getMilestone(milestoneId, stage.milestones);
  let taskHTML = '';

  if (milestone.tasks.length === 0) {
    document.querySelector('.js-taskbox-content').innerHTML = `
    <div class="task-empty-state">
      <div class="task-icon-background-empty-state">
        <svg
          class="task-icon-empty-state"
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
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <path d="m9 14 2 2 4-4"/>
        </svg>
      </div>
      <div class="task-empty-state-text">
        <p class="no-task-text">No tasks yet</p>
        <span class="task-empty-state-guide">
          Add tasks to track your progress.
        </span>
      </div>
    </div>`;
    return;
  }

  milestone.tasks.forEach(task => {
    taskHTML += `
    <div class="task js-task-${task.id}">
      <div class="task-checkbox js-task-checkbox" data-task-id="${task.id}" data-milestone-id="${milestoneId}">
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
      <p class="task-text">${task.name}</p>
      <button class="remove-task js-remove-task" data-task-id="${task.id}" data-milestone-id="${milestoneId}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="remove-task-icon lucide lucide-x"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
    `
  });

  document.querySelector('.js-taskbox-content').innerHTML = taskHTML;

  attachTaskCheckbox();
  updateTaskCheckbox();
  attachRemoveTask();
  updateTask()
}

function updateTask() {
  stage.milestones.forEach(milestone => {
    milestone.tasks.forEach(task => {
      if (task.saved) {
        return;
      }

      const taskCard = document.querySelector(`.js-task-${task.id}`);
      if (!taskCard) {
        return;
      }

      const unsavedTaskHTML = `
      <div class="unsaved-task">
        <input class="task-name-input js-task-name-input-${task.id}" type="text" placeholder="Task name">
        <button class="save-task-button js-save-task-button" data-task-id="${task.id}" data-milestone-id="${milestone.id}">
          Save
        </button>
      </div>`;

      taskCard.innerHTML = unsavedTaskHTML;

      document.querySelector(`.js-task-name-input-${task.id}`).focus();
      attachSaveTaskButton();
    })
  })
}

function attachSaveTaskButton() {
  document.querySelectorAll('.js-save-task-button').forEach(button => {
    const taskId = button.dataset.taskId;
    const task = getTask(taskId, stage.milestones);
    const milestoneId = button.dataset.milestoneId;
    const nameElement = document.querySelector(`.js-task-name-input-${taskId}`);

    button.addEventListener('click', () => {

      if (!nameElement.value.trim()) {
        nameElement.focus();
        return;
      }

      task.name = nameElement.value;
      task.saved = true;

      updateTaskbox(milestoneId);
      updateProgressBox(milestoneId);
      updateDashboard();
      saveToStorage();

    })
  })
}

function attachTaskCheckbox() {
  document.querySelectorAll('.js-task-checkbox').forEach(checkbox => {
    const taskId = checkbox.dataset.taskId;
    const task = getTask(taskId, stage.milestones);
    const milestoneId = checkbox.dataset.milestoneId;

    checkbox.addEventListener('click', () => {
      if (task.completed === false) {
        task.completed = true;
      } else { task.completed = false; }

      updateTaskCheckbox();
      updateProgressBox(milestoneId);
      updateDashboard();
      saveToStorage();
    })
  })
}

function updateTaskCheckbox() {
  document.querySelectorAll('.js-task-checkbox').forEach(checkbox => {
    const taskId = checkbox.dataset.taskId;
    const task = getTask(taskId, stage.milestones);

    if (task.completed) {
      checkbox.classList.add('completed')
    } else { checkbox.classList.remove('completed') }
  })
}

function attachRemoveTask() {
  document.querySelectorAll('.js-remove-task').forEach(button => {
    button.addEventListener('click', () => {
      const taskId = button.dataset.taskId;
      const milestoneId = button.dataset.milestoneId;
      const task = getTask(taskId, stage.milestones);

      const newMilestones = stage.milestones.map(milestone => {
        const newTasks = milestone.tasks.filter(t => t !== task)
        milestone.tasks = newTasks;
        return milestone
      })

      stage.milestones = newMilestones;
      updateTaskbox(milestoneId);
      updateProgressBox(milestoneId);
      updateDashboard();
      saveToStorage();
    })
  })
}

function updateProgressBox(milestoneId) {

  updateStepCount(milestoneId);
  updateTaskProgress(milestoneId);
  updateOverallProgress(milestoneId);
}

function updateStepCount(milestoneId) {
  const stepsCount = document.querySelector('.js-steps-total-number');
  const stepsCompletedCount = document.querySelector('.js-steps-completed-number');
  const milestone = getMilestone(milestoneId, stage.milestones);
  const completedSteps = milestone.steps.filter(s => s.completed);

  stepsCount.textContent = milestone.steps.length;
  stepsCompletedCount.textContent = completedSteps.length;
}

function updateTaskProgress(milestoneId) {
  const milestone = getMilestone(milestoneId, stage.milestones);
  const totalTask = milestone.tasks.length;
  const taskCompleted = milestone.tasks.filter(t => t.completed).length;
  const progress = totalTask === 0 ? 100 : taskCompleted / totalTask * 100;
  const progressFill = document.querySelector('.js-progress-box-task-progress-fill');
  const progressPercent = document.querySelector('.js-progress-box-task-progress-percentage')
  const progressCount = document.querySelector('.js-progress-box-task-progress-count')

  progressFill.style.background = `
      conic-gradient(
          from -90deg,
          #5AD68A 0deg,
          #5BA8E8 ${progress * 3.6}deg,
          #E8E5F8 ${progress * 3.6}deg
      )
  `;

  progressPercent.textContent = `${Math.round(progress)} %`
  progressCount.textContent = `${taskCompleted}/${totalTask}`;
}

function updateOverallProgress(milestoneId) {
  const milestone = getMilestone(milestoneId, stage.milestones);
  const overallProgress = getMilestoneProgress(milestone);
  const progressBar = document.querySelector('.js-overall-progress-bar');
  const progressPercentage = document.querySelector('.js-overall-progress-percentage')

  progressBar.value = overallProgress;
  progressPercentage.textContent = `${Math.round(overallProgress)}%`;

}

function updateDashboard() {
  document.querySelector('.js-dashboard-start-date-value').textContent = stage.startedOn;

  updateDashboardCurrentMilestone();
  updateDashboardSteps();
  updateDashboardTasks();
  updateDashboardOverallProgress();
}

function updateDashboardCurrentMilestone() {
  if (stage.milestones.length === 0) {
    return;
  }

  const currentMilestone = stage.milestones.find(m => !m.completed)
  if (!currentMilestone) {
    return
  }
  const progress = getMilestoneProgress(currentMilestone);
  const steps = currentMilestone.steps.length;
  const tasks = currentMilestone.tasks.length;

  document.querySelector('.js-current-milestone-name').textContent = currentMilestone.name;
  document.querySelector('.js-current-milestone-description').textContent = currentMilestone.description;
  document.querySelector('.js-current-milestone-steps-count').textContent = steps;
  document.querySelector('.js-current-milestone-tasks-count').textContent = tasks;
  document.querySelector('.js-current-milestone-progress-bar').value = progress;
  document.querySelector('.js-current-milestone-progress-percentage').textContent = `${Math.round(progress)}%`
}

function updateDashboardSteps() {

   if (stage.milestones.length === 0) {
    return;
  }

  const currentMilestone = stage.milestones.find(m => !m.completed);

  if (!currentMilestone) {
    return;
  }

  const steps = currentMilestone.steps;
  let stepHTML = '';

  document.querySelector('.js-dashboards-steps-badge').textContent = `${steps.filter(s => s.completed).length} / ${steps.length} Completed`

  steps.forEach(step => {
    stepHTML += `
    <div class="dashboards-step">
      <div class="dashboard-checkbox js-dashboard-step-checkbox js-dashboard-step-checkbox-${step.id}" data-step-id="${step.id}">
        <svg
          class="dashboard-checkbox-checkmark-icon"
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
      <p class="dashboard-step-name">${step.name}</p>
      <button class="dashboard-step-menu-button js-dashboard-step-menu-button" aria-label="Step options">
        <svg
          class="dashboard-step-three-dot lucide lucide-ellipsis-vertical"
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
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>
    </div>`
  })

  document.querySelector('.js-dashboard-steps-container').innerHTML = stepHTML;

  attachDashboardStepsCheckbox(steps);
  updateDashboardStepsCheckbox(steps);
}

function attachDashboardStepsCheckbox(steps) {
  document.querySelectorAll('.js-dashboard-step-checkbox').forEach(checkbox => {
    checkbox.addEventListener('click' , () => {
      const stepId = checkbox.dataset.stepId;
      const step = getStep(stepId, stage.milestones);

      if(!step.completed) {
        step.completed = true;
      } else {step.completed = false}

      updateDashboardStepsCheckbox(steps);
      updateDashboard();
      saveToStorage();
    })
  })
}

function updateDashboardStepsCheckbox(steps) {

  steps.forEach(step => {
    const checkbox = document.querySelector(`.js-dashboard-step-checkbox-${step.id}`);
    checkbox.classList.remove('completed');

    if (step.completed) {
      checkbox.classList.add('completed')
    }
  })
}

function updateDashboardTasks() {

   if (stage.milestones.length === 0) {
    return;
  }

  const totalTasksCount = getStageTask(stage).totalCount;
  const completedTasksCount = getStageTask(stage).completedCount;
  const completedTasksPercentage = Math.round(completedTasksCount * 100 / totalTasksCount);
  const remainingTasksCount = getStageTask(stage).remainingCount;
  const remainingTasksPercentage = Math.round(remainingTasksCount * 100 / totalTasksCount);
  const firstThreeIncomplete = getStageTask(stage).incomplete.slice(0, 3);
  let tasksHTML = '';

  document.querySelector('.js-dashboard-total-tasks-count').textContent = totalTasksCount;
  document.querySelector('.js-dashboard-completed-tasks-count').textContent = completedTasksCount;
  document.querySelector('.js-dashboard-completed-percentage').textContent = `${completedTasksPercentage}%`;
  document.querySelector('.js-dashboard-remaining-tasks-count').textContent = remainingTasksCount;
  document.querySelector('.js-dashboard-remaining-percentage').textContent = `${remainingTasksPercentage}%`;

  firstThreeIncomplete.forEach(task => {
    tasksHTML += `
    <div class="dashboard-next-up-task">
      <div class="dashboard-checkbox js-dashboard-task-checkbox js-dashboard-task-checkbox-${task.id}" data-task-id="${task.id}">
        <svg
          class="dashboard-checkbox-checkmark-icon"
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
      <p class="dashboard-next-up-task-name">${task.name}</p>
    </div>`
  })

  document.querySelector('.js-dashboard-task-next-up-tasks').innerHTML = tasksHTML;
  document.querySelector('.js-dashboard-task-progress-percentage').textContent = `${completedTasksPercentage}%`;
  document.querySelector('.js-dashboard-task-progress-fill').style.background = `
      conic-gradient(
          from -90deg,
          #5AD68A 0deg,
          #5BA8E8 ${completedTasksPercentage * 3.6}deg,
          #E8E5F8 ${completedTasksPercentage * 3.6}deg
      )
  `;

  attachDashboardTaskCheckbox(firstThreeIncomplete);
  updateDashboardTaskCheckbox(firstThreeIncomplete);
}

function attachDashboardTaskCheckbox(tasks) {
  document.querySelectorAll('.js-dashboard-task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('click' , () => {
      const taskId = checkbox.dataset.taskId;
      const task = getTask(taskId, stage.milestones);

      if(!task.completed) {
        task.completed = true;
      } else {task.completed = false}

      updateDashboardTaskCheckbox(tasks);
      saveToStorage();
    })
  })
}

function updateDashboardTaskCheckbox(tasks) {

  tasks.forEach(task => {
    const checkbox = document.querySelector(`.js-dashboard-task-checkbox-${task.id}`);
    checkbox.classList.remove('completed');

    if (task.completed) {
      checkbox.classList.add('completed')
    }
  })
}

function updateDashboardOverallProgress() {

   if (stage.milestones.length === 0) {
    return;
  }

  const milestoneCount = stage.milestones.length;
  const totalMilestoneProgress = stage.milestones.reduce((accumulator, milestone) => accumulator + getMilestoneProgress(milestone), 0);
  const overallProgress = Math.round(totalMilestoneProgress / milestoneCount);
  const overallProgressBar = document.querySelector('.js-dashboard-overall-progress-bar')
  const overallprogressPercentage = document.querySelector('.js-dashboard-overall-progress-percentage')

  overallProgressBar.value = overallProgress;
  overallprogressPercentage.textContent = `${Math.round(overallProgress)}%`;

  document.querySelector('.js-milestone-progress-total').textContent = `${stage.milestones.length} Milestones`

  renderDashboardOverallMilestones()
}

function renderDashboardOverallMilestones() {
  const milestoneContainer = document.querySelector('.js-dashboard-overall-milestone-progress-contianer')
  let milestoneHTML = '';

  stage.milestones.forEach(milestone => {
    const progress = getMilestoneProgress(milestone);
    milestoneHTML += `
    <div class="dashboard-overall-milestone-progress">
      <div class="dashboard-overall-milestone-main">
        <p class="milestone-name">${milestone.name}</p>
        <div class="dashboard-overall-milestone-progress-row">
          <progress class="dashboard-overall-milestone-bar js-dashboard-overall-milestone-bar" value="${progress}" max="100" data-milestone-id="${milestone.id}"></progress>
          <span class="milestone-progress-percentage js-dashboard-overall-milestone-percentage">${Math.round(progress)}%</span>
        </div>
      </div>
      <span class="badge js-badge" data-milestone-id="${milestone.id}"></span>
    </div>`
  })

  milestoneContainer.innerHTML = milestoneHTML;
  updateDashboardOverallMilestone();
}

function updateDashboardOverallMilestone() {
  const currentMilestone = stage.milestones.find(milestone => !milestone.completed);

  document.querySelectorAll('.js-dashboard-overall-milestone-bar').forEach(bar => {
    const milestoneId = bar.dataset.milestoneId;
    const milestone = getMilestone(milestoneId, stage.milestones);

    if (milestone === currentMilestone) {
      bar.classList.add('current')
    }
  })

  document.querySelectorAll('.dashboard-overall-milestone-progress .js-badge').forEach(badge => {
    const milestoneId = badge.dataset.milestoneId;
    const milestone = getMilestone(milestoneId, stage.milestones);

    if (milestone.completed) {
      badge.classList.add('completed')
      badge.textContent = 'Completed'
    } else if (milestone === currentMilestone) {
      badge.classList.add('in-progress')
      badge.textContent = 'In-progress'
    } else {
      badge.classList.add('upcoming')
      badge.textContent = 'Upcoming'
    }
  })
}