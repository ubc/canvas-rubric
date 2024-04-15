const getRubric = require('./getRubric')
const writeToCSV = require('./writeToCSV')

const getAssignmentRubricAndWriteFile = async (courseId, assignmentId, rubricId) => {
    console.log('Thanks, fetching data now. This may take a bit of time...')
    const rubricData = await getRubric(courseId, assignmentId, rubricId)
    writeToCSV(rubricData, `rubric-${courseId}-${assignmentId}-${rubricId}.csv`)
    console.log(`Data is ready now. It's named 'rubric-${courseId}-${assignmentId}-${rubricId}.csv'`)
}

getAssignmentRubricAndWriteFile()