const fs = require('fs')
const path = require('path')
const fswrite = fs.writeFileSync
const fsappend = fs.appendFileSync
const writeHeader = (pathToFile, header) => fswrite(pathToFile, header + '\r\n')
const append = (pathToFile, row) => fsappend(pathToFile, row + '\r\n')

const escapeComment = comment => '"' + comment.replace(/"/g, "'") + '"'

const writeToCSV = (data, filename) => {
  const csv = path.join(__dirname, '/output/', filename)

  const header = [
    'student_name',
    'student_number',
    'student_canvas_id',
    //'student_role',
    'section_name',    
    'submission_state',
    'submission_score',
    //'grader_id',
    //'grader_name',
    //'grader_role',
    'rubric_grader_name',
    'rubric_grader_role',
    'total_rubric_score',
  ]

  data[0].rubricData.forEach((_, i) => {
    header.push(`rubric_${i + 1}_grade`)
    header.push(`rubric_${i + 1}_comments`)
  })

  header.push('overall_comments')

  writeHeader(csv, header)

  data.forEach(studentData => {
    const row = [
      escapeComment(studentData.userName),
      studentData.userSISID,
      studentData.userCanvasID,
      //studentData.enrollmentType,
      studentData.sectionName,
      studentData.submissionState,
      studentData.submissionScore,
      //studentData.graderId,
      //escapeComment(studentData.graderName),
      //studentData.graderRole,
      escapeComment(studentData.rubricGraderName),
      studentData.rubricGraderRole,
      studentData.rubricScore,
    ]

    studentData.rubricData.forEach(({ points, comments }) => {
      row.push(points)
      row.push(escapeComment(comments))
    })

    studentData.overallComments.forEach(comments => row.push(escapeComment(comments)))
    append(csv, row)
  })
}

module.exports = writeToCSV
