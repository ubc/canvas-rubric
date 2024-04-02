const { flatten } = require('ramda')
const canvasAPI = require('node-canvas-api')

async function getRubric (courseId, assignmentId, rubricId) {
  const [enrollments, submissions, sections] = await Promise.all([
    canvasAPI.getEnrollmentsInCourse(courseId),
    canvasAPI.getAssignmentSubmissions(courseId, assignmentId, canvasAPI.getOptions.submissions.submission_comments, canvasAPI.getOptions.submissions.rubric_assessment),
    canvasAPI.getRubric(courseId, rubricId),
    canvasAPI.getSections(courseId)
  ])

  console.log(enrollments)
  console.log(submissions)
  console.log(sections)

  return ({enrollments, submissions, sections})
  
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
