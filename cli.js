const canvasAPI = require('node-canvas-api')
const getRubric = require('./getRubric')
const getQuizRubric = require('./getQuizRubric')
const writeToCSV = require('./writeToCSV')
const writeQuizRubricToCSV = require('./writeQuizRubricToCSV')
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
    initial: 0
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
    initial: 0
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
    initial: 0
  }).then(x => x.value)

  return [courseId, assignmentId, rubricId]
}

const getAssignmentRubricAndWriteFile = async (courseId, assignmentId, rubricId) => {
  console.log('Thanks, fetching data now. This may take a bit of time...')
  const rubricData = await getRubric(courseId, assignmentId, rubricId)
  //writeToCSV(rubricData, `rubric-${courseId}-${assignmentId}-${rubricId}.csv`)
  //console.log(`Data is ready now. It's named 'rubric-${courseId}-${assignmentId}-${rubricId}.csv'`)
}

const getQuizRubricAndWriteFile = async (courseId, quizId, rubricId) => {
  console.log('Thanks, fetching data now. This may take a bit of time...')
  const rubricData = await getQuizRubric(courseId, quizId, rubricId)
  writeQuizRubricToCSV(rubricData, `rubric-${courseId}-${quizId}-${rubricId}.csv`)
  console.log(`Data is ready now. It's named 'rubric-${courseId}-${quizId}-${rubricId}.csv'`)
}

(
  async () => {
    const envSetup = await prompts({
      type: 'confirm',
      name: 'value',
      message: 'Did you set the .env variable?',
      initial: true
    }).then(x => x.value)
    if (!envSetup) {
      console.log('Go set up your .env first, instructions are on the README')
      return
    }
    const quizOrAssignment = await prompts({
      type: 'select',
      name: 'value',
      message: 'Do you want to download the rubric scores from Quizzes or Assignments?',
      choices: [
        { title: 'Quizzes', value: 'quizzes' },
        { title: 'Assignments', value: 'assignments' }
      ]
    })
    if (quizOrAssignment.value === 'assignments') {
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
        getAssignmentRubricAndWriteFile(courseId, assignmentId, rubricId)
      } else {
        const [courseId, assignmentId, rubricId] = await getIds()
        getAssignmentRubricAndWriteFile(courseId, assignmentId, rubricId)
      }
    } else {
      const knowIds = await prompts({
        type: 'confirm',
        name: 'value',
        message: 'Do you know the Canvas course id, assignment id, and quiz id that you want to download?',
        initial: true
      }).then(x => x.value)
      if (knowIds) {
        let ids = []
        while (ids.length !== 3) {
          const idInput = await prompts({
            type: 'list',
            name: 'value',
            message: 'Enter the course id, assignment id, and quiz id separated by a comma',
            initial: '',
            separator: ','
          })
          ids = idInput.value
        }
        const [courseId, assignmentId, quizId] = ids.map(x => Number(x))
        getQuizRubricAndWriteFile(courseId, assignmentId, quizId)
      } else {
        // const [courseId, assignmentId, quizId] = await getIds()
        // getQuizRubricAndWriteFile(courseId, assignmentId, quizId)
        console.log('Please find these IDs in your Canvas course first.')
      }
    }
  }
)()
