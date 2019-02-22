const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const fswrite = promisify(fs.writeFile)
const fsappend = promisify(fs.appendFile)

const writeHeader = (pathToFile, header) => fswrite(pathToFile, header + '\r\n')
const append = (pathToFile, row) => fsappend(pathToFile, row + '\r\n')

const escapeComment = comment => '"' + comment.replace(/"/g, "'") + '"'

const writeToCSV = data => {
  const csv = path.join(__dirname, 'output.csv')

  const header = [
    'student_name',
    'student_number',
    'section_number',
    'ta_name',
    'ta_number',
    'total_paper_grade',
    'download_link'
  ]

  data[0].rubricData.forEach((_, i) => {
    header.push(`rubric_${i + 1}_grade`)
    header.push(`rubric_${i + 1}_comments`)
  })

  header.push('overall_comments')

  writeHeader(csv, header)

  data.forEach(studentData => {
    const row = [
      studentData.studentName,
      studentData.studentNumber,
      studentData.section,
      studentData.taName,
      studentData.taStudentNumber,
      studentData.totalGrade,
      studentData.url
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
