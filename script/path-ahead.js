import {fields, Field} from "../data/fields.js"

function renderFields() {
  let fieldHTML = '';
  const addFieldPopup = document.querySelector('.js-add-field-popup')

  fields.forEach((field) => {
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

  attachAddFieldButtton();
}



function attachAddFieldButtton() {
  document.querySelector('.js-add-field-button')
    .addEventListener('click', () => {
      const fieldIcon = document.querySelector('.js-fieldicon-input');
      const fieldName = document.querySelector('.js-fieldname-input');

      fields.push(new Field(fieldName.value, fieldIcon.files[0])),
      renderFields();
    });
}
  

renderFields();

