const fs = require('fs')
const path = require('path')
const fswrite = fs.writeFileSync
const fsappend = fs.appendFileSync
const writeHeader = (pathToFile, header) => fswrite(pathToFile, header + '\r\n')
const append = (pathToFile, row) => fsappend(pathToFile, row + '\r\n')

const escapeComment = comment => '"' + comment.replace(/"/g, "'") + '"'

const writeToCSV = (studentData, rubrics, filename) => {
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

  rubrics.data.forEach((_, i) => {
    header.push(`rubric_${i + 1}_grade`)
    header.push(`rubric_${i + 1}_comments`)
  })

  header.push('overall_comments')

  writeHeader(csv, header)

  studentData.forEach(sd => {
    const row = [
      escapeComment(sd.userName),
      sd.userSISID,
      sd.userCanvasID,
      //studentData.enrollmentType,
      sd.sectionName,
      sd.submissionState,
      sd.submissionScore,
      //studentData.graderId,
      //escapeComment(studentData.graderName),
      //studentData.graderRole,
      escapeComment(sd.rubricGraderName),
      sd.rubricGraderRole,
      sd.rubricScore,
    ]

    sd.rubricData.forEach(({ points, comments }) => {
      row.push(points)
      row.push(escapeComment(comments))
    })

    sd.overallComments.forEach(comments => row.push(escapeComment(comments)))
    append(csv, row)
  })
}

module.exports = writeToCSV
