export function getStage(stageId, fields) {
  let stage;

  fields.forEach(field => {
    field.stages.forEach(stg => {
      if (stg.id === stageId) {
        stage = stg
      }
    })
  })

  return stage;
}


export function getMilestone(milestoneId, milestones) {
  let milestone;
  milestones.forEach(milestn => {
    if (milestn.id === milestoneId) {
      milestone = milestn;
    }
  })

  return milestone;
}

export function getStep(stepId, milestones) {
   let step;
  milestones.forEach(milestone => {
    milestone.steps.forEach(stp => {
      if (stp.id === stepId) {
        step = stp;
      }
    })
  })
  return step;
}