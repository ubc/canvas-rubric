const { flatten } = require('ramda')
const canvasAPI = require('node-canvas-api')

async function getRubric (courseId, assignmentId, rubricId) {
  const [enrollments, submissions, rubrics, sections] = await Promise.all([
    canvasAPI.getEnrollmentsInCourse(courseId),
    canvasAPI.getAssignmentSubmissions(courseId, assignmentId, canvasAPI.getOptions.submissions.submission_comments, canvasAPI.getOptions.submissions.rubric_assessment),
    canvasAPI.getRubric(courseId, rubricId),
    canvasAPI.getSections(courseId)
  ])

  const students = enrollments.filter(enrollment => enrollment.type == 'StudentEnrollment') // excludes StudentViewEnrollment but keeps StudentEnrollment, to keep studentView use enrollment.role
  const nonStudents = enrollments.filter(enrollment => enrollment.role != 'StudentEnrollment') // excludes both StudentViewEnrollment and StudentEnrollment
  
  return students.map(student => {
    const user = student.user || ''
    const enrollmentType = student.type || ''

    const userName = user.name || ''
    const userSISID = user.sis_user_id || ''
    const userCanvasID = user.id || ''

    const section = sections.find(student => student.course_section_id == sections.id ) || {}
    const sectionName = section.name || ''

    const submission = submissions.find(submission => submission.user_id == user.id) || {}
    const submissionId = submission.id || ''
    const submissionState = submission.workflow_state || ''
    
    const graderId = submission.grader_id || ''
    const grader = nonStudents.find(nonStudent => nonStudent.user_id == graderId) || {}

    const graderName = (grader.user && grader.user.name) || ''
    const graderRole = grader.role || ''

    const submissionScore = submission.score || ''
    const overallComments = submission.submission_comments
    ? submission.submission_comments
      .filter(comment => comment.author.id !== userCanvasID)
      .map(comment => comment.comment)
    : []
  
    const rubricAssessments = rubrics.assessments.find(rubric => rubric.artifact_id == submissionId) || {}

    const rubricScore = rubricAssessments.score || ''

    const rubricData = (rubricAssessments.data || []).map(({ points, comments }) => ({ points, comments }));


    const rubricGrader = nonStudents.find(nonStudent => nonStudent.user_id == rubricAssessments.assessor_id) || {}
    const rubricGraderName = (rubricGrader.user && rubricGrader.user.name) || ''
    const rubricGraderRole = rubricGrader.role || ''


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
      rubricScore,
      rubricGraderName,
      rubricGraderRole,
      rubricData,
      overallComments
    }

  })
}

module.exports = getRubric
