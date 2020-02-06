const getRubric = require('./getRubric')
const writeToCSV = require('./writeToCSV')
const prompts = require('prompts');

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
      })
      if (knowIds.value) {
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
        console.log('Thanks, fetching data now. This may take a bit of time...')
        const rubricData = await getRubric(courseId, assignmentId, rubricId)
        writeToCSV(rubricData, `rubric-${courseId}-${assignmentId}-${rubricId}.csv`)
        console.log(`Data is ready now. It's named rubric-${courseId}-${assignmentId}-${rubricId}.csv`)
      } else {
        // first retrieve all courses the user has

        // then retrieve all assignments in the course

        // then retrieve all rubrics

        // then fetch data
      }
    }
  }
)()
