const { flatten } = require('ramda')
const canvasAPI = require('node-canvas-api')

async function getRubric (courseId, assignmentId, rubricId) {
  const [enrollments, submissions, rubric, sections] = await Promise.all([
    canvasAPI.getEnrollmentsInCourse(courseId),
    canvasAPI.getAssignmentSubmissions(courseId, assignmentId, canvasAPI.getOptions.submissions.submission_comments, canvasAPI.getOptions.submissions.rubric_assessment),
    canvasAPI.getRubric(courseId, rubricId),
    canvasAPI.getSections(courseId)
  ])

  //console.log(enrollments)
  console.log(submissions)
  //console.log(rubric)
  //console.log(sections)

  //return ({enrollments, submissions, sections})
  const students = enrollments.filter(enrollment => enrollment.role == 'StudentEnrollment') // excludes StudentViewEnrollment but keeps StudentEnrollment, to keep studentView use enrollment.role
  const nonStudents = enrollments.filter(enrollment => enrollment.role != 'StudentEnrollment') // excludes both StudentViewEnrollment and StudentEnrollment
  
  return students.map(student => {
    const user = student.user
    const enrollmentType = student.type

    const userName = user.name
    const userSISID = user.sis_user_id
    const userCanvasID = user.id

    const section = sections.find(student => student.course_section_id == sections.id ) || ''
    const sectionName = section.name

    const submission = submissions.find(submission => submission.user_id == user.id)
    const submissionId = submission.id
    const submissionState = submission.workflow_state
    
    const graderId = submission.grader_id
    const grader = nonStudents.find(nonStudent => nonStudent.user_id == graderId)
    const graderName = grader.user.name 
    const graderRole = grader.role

    const submissionScore = submission.score

    const overallComments = submission.submission_comments
      ? submission.submission_comments
        .filter(comment => comment.author.id !== userCanvasID)
        .map(comment => comment.comment)
      : []
    
    return {
      userName,
      userSISID,
      userCanvasID,
      enrollmentType,
      sectionName,
      submissionState,
      submissionScore,
      graderId,
      graderName,
      graderRole,
      overallComments
    }

  })
  // return rubric.assessments.map(assessment => {
  //   // get TA info
  //   const assessorId = assessment.assessor_id
  //   const assessor = enrollments.find(enrollment => enrollment.id === assessorId) || {}
  //   const assessorName = assessor.name || ''
  //   const assessorSISId = assessor.sis_user_id || ''

  //   // get student info
  //   const submissionId = assessment.artifact_id
  //   const submission = submissions
  //     .find(submission => submission.id === submissionId) || {}
  //   const studentId = submission.user_id || ''
  //   const student = sections
  //     .find(student => student.id === studentId) || {}
  //   const studentName = student.name || ''
  //   const studentNumber = student.sis_user_id || ''
  //   const section = student.section || ''

  //   // get rubric info
  //   const totalGrade = assessment.score
  //   const rubricData = assessment.data
  //     .map(({ points, comments }) => ({ points, comments }))

  //   // link to assignment
  //   const url = submission.attachments
  //     ? submission.attachments[0].url
  //     : ''

  //   // assignment overall comments, filter out student comments
  //   const overallComments = submission.submission_comments
  //     ? submission.submission_comments
  //       .filter(comment => comment.author.id !== studentId)
  //       .map(comment => comment.comment)
  //     : []

  //   const submissionState = submission.workflow_state

  //   return {
  //     submissionId,
  //     taName,
  //     enrollmentstudentNumber,
  //     studentName,
  //     studentNumber,
  //     totalGrade,
  //     rubricData,
  //     section,
  //     url,
  //     overallComments,
  //     submissionState
  //   }
  // })
}

module.exports = getRubric
