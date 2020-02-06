const canvasAPI = require('node-canvas-api')
const getRubric = require('./getRubric')
const writeToCSV = require('./writeToCSV')
const prompts = require('prompts')

const getIds = async () => {
  const self = await canvasAPI.getSelf()
  const courses = await canvasAPI.getCoursesByUser(self.id)
    .then(courses => courses
      .map(course => ({
        title: `${course.name}, offered ${course.start_at.split('T')[0]}`,
        value: course.id
      }))
    )
  const courseId = await prompts({
    type: 'select',
    name: 'value',
    message: 'Pick the course',
    choices: courses,
    initial: 1
  }).then(x => x.value)
  const assignments = await canvasAPI.getAssignments(courseId)
    .then(assignments => assignments
      .map(assignment => ({
        title: assignment.name,
        value: assignment.id
      }))
    )
  const assignmentId = await prompts({
    type: 'select',
    name: 'value',
    message: 'Pick the assignment',
    choices: assignments,
    initial: 1
  }).then(x => x.value)
  const rubrics = await canvasAPI.getRubricsInCourse(courseId)
    .then(rubrics => rubrics
      .map(rubric => ({
        title: rubric.title,
        value: rubric.id
      }))
    )
  const rubricId = await prompts({
    type: 'select',
    name: 'value',
    message: 'Pick the rubric',
    choices: rubrics,
    initial: 1
  }).then(x => x.value)

  return [courseId, assignmentId, rubricId]
}

const getRubricAndWriteFile = async (courseId, assignmentId, rubricId) => {
  console.log('Thanks, fetching data now. This may take a bit of time...')
  const rubricData = await getRubric(courseId, assignmentId, rubricId)
  writeToCSV(rubricData, `rubric-${courseId}-${assignmentId}-${rubricId}.csv`)
  console.log(`Data is ready now. It's named 'rubric-${courseId}-${assignmentId}-${rubricId}.csv'`)
}

(
  async () => {
    const setup = await prompts({
      type: 'confirm',
      name: 'value',
      message: 'Did you set the .env variable?',
      initial: true
    })
    if (!setup.value) {
      console.log('Go set up your .env, instructions are on the README')
    } else {
      const knowIds = await prompts({
        type: 'confirm',
        name: 'value',
        message: 'Do you know the Canvas course id, assignment id, and rubric id that you want to download?',
        initial: true
      }).then(x => x.value)
      if (knowIds) {
        let ids = []
        while (ids.length !== 3) {
          const idInput = await prompts({
            type: 'list',
            name: 'value',
            message: 'Enter the course id, assignment id, and rubric id separated by a comma',
            initial: '',
            separator: ','
          })
          ids = idInput.value
        }
        const [courseId, assignmentId, rubricId] = ids.map(x => Number(x))
        getRubricAndWriteFile(courseId, assignmentId, rubricId)
      } else {
        const [courseId, assignmentId, rubricId] = await getIds()
        getRubricAndWriteFile(courseId, assignmentId, rubricId)
      }
    }
  }
)()
