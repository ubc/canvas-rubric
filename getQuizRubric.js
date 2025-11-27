import { flatten } from 'ramda'
import {
  getOptions,
  getQuizSubmissions,
  getRubric as getCanvasRubric,
  getSections
} from 'node-canvas-api'

export default async function getQuizRubric (courseId, quizId, rubricId) {
  const [quizSubmissions, rubric, sections] = await Promise.all([
    getQuizSubmissions(courseId, quizId)
      .then(submissions => flatten(submissions.map(x => x.quiz_submissions))),
    getCanvasRubric(courseId, rubricId),
    getSections(courseId, getOptions.users.include.students)
      .then(sections => flatten(
        sections
          .map(({ name, students }) => students
            .map(student => ({ ...student, section: name }))
          )
      ))
  ])

  return rubric.assessments.map(assessment => {
    // get student info
    const submissionId = assessment.artifact_id
    const submission = quizSubmissions
      .find(submission => submission.submission_id === submissionId) || {}
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

    return {
      studentName,
      studentNumber,
      totalGrade,
      rubricData,
      section
    }
  })
}
