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

export function getTask(taskId, milestones) {
  let task;
  milestones.forEach(milestone => {
    milestone.tasks.forEach(tsk => {
      if (tsk.id === taskId) {
        task = tsk;
      }
    })
  })
  return task;
}

export function getMilestoneProgress(milestone) {
  const totalSteps = milestone.steps.length;
  const totalTasks = milestone.tasks.length;
  const completedSteps = milestone.steps.filter(s => s.completed).length;
  const completedTasks = milestone.tasks.filter(t => t.completed).length;
  const stepsProgress = totalSteps === 0 ? 100 : completedSteps / totalSteps * 100;
  const tasksProgress = totalTasks === 0 ? 100 : completedTasks / totalTasks * 100;
  
  return (stepsProgress * 0.7) + (tasksProgress * 0.3);

}

export function getStageTask(stage) {
  const tasks = stage.milestones.flatMap(milestone => milestone.tasks);


  return {
    totalCount: tasks.length,
    completedCount: tasks.filter(task => task.completed).length,
    remainingCount: tasks.filter(task => !task.completed).length,
    incomplete: tasks.filter(task => !task.completed)
  }
}