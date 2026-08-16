import { fields } from "../data/fields.js";

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

console.log(stage);