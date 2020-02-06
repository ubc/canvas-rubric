const { flatten } = require('ramda')
const canvasAPI = require('node-canvas-api')

async function getRubric (courseId, assignmentId, rubricId) {
  const [TAs, submissions, rubric, sections] = await Promise.all([
    canvasAPI.getUsersInCourse(courseId, canvasAPI.getOptions.users.enrollmentType.ta),
    canvasAPI.getAssignmentSubmissions(courseId, assignmentId, canvasAPI.getOptions.submissions.submission_comments),
    canvasAPI.getRubric(courseId, rubricId),
    canvasAPI.getSections(courseId, canvasAPI.getOptions.users.include.students)
      .then(sections => flatten(
        sections
          .map(({ name, students }) => students
            .map(student => ({ ...student, section: name }))
          )
      ))
  ])
  return rubric.assessments.map(assessment => {
    // get TA info
    const taId = assessment.assessor_id
    const TA = TAs.find(ta => ta.id === taId) || {}
    const taName = TA.name || ''
    const taStudentNumber = TA.sis_user_id || ''

    // get student info
    const submissionId = assessment.artifact_id
    const submission = submissions
      .find(submission => submission.id === submissionId) || {}
    const studentId = submission.user_id || ''
    const student = sections
      .find(student => student.id === studentId) || {}
    const studentName = student.name || ''
    const studentNumber = student.sis_user_id || ''
    const section = student.section || ''

    // get rubric info
    const totalGrade = assessment.score
    const rubricData = assessment.data
      .map(({ points, comments }) => ({ points, comments }))

    // link to assignment
    const url = submission.attachments
      ? submission.attachments[0].url
      : ''

    // assignment overall comments, filter out student comments
    const overallComments = submission.submission_comments
      ? submission.submission_comments
        .filter(comment => comment.author.id !== studentId)
        .map(comment => comment.comment)
      : []

    return {
      taName,
      taStudentNumber,
      studentName,
      studentNumber,
      totalGrade,
      rubricData,
      section,
      url,
      overallComments
    }
  })
}

module.exports = getRubric
