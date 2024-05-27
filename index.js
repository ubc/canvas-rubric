const getRubric = require('./getRubric')
const writeToCSV = require('./writeToCSV')

const getAssignmentRubricAndWriteFile = async (courseId, assignmentId, rubricId) => {
    console.log('Thanks, fetching data now. This may take a bit of time...')
    const { studentData, rubrics } = await getRubric(courseId, assignmentId, rubricId)
    writeToCSV(studentData, rubrics, `rubric-${courseId}-${assignmentId}-${rubricId}.csv`)
    console.log(`Data is ready now. It's named 'rubric-${courseId}-${assignmentId}-${rubricId}.csv'`)
}

getAssignmentRubricAndWriteFile(138649,1816895,150401)