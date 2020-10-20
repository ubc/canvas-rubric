const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const fswrite = promisify(fs.writeFile)
const fsappend = promisify(fs.appendFile)

const writeHeader = (pathToFile, header) => fswrite(pathToFile, header + '\r\n')
const append = (pathToFile, row) => fsappend(pathToFile, row + '\r\n')

const writeToCSV = (data, filename) => {
  const csv = path.join(__dirname, '/output/', filename)

  const header = [
    'student_name',
    'student_number',
    'section',
    'total_grade'
  ]

  data[0].rubricData.forEach((_, i) => {
    header.push(`rubric_${i + 1}_grade`)
  })

  writeHeader(csv, header)

  data.forEach(studentData => {
    const row = [
      studentData.studentName,
      studentData.studentNumber,
      studentData.section,
      studentData.totalGrade
    ]

    studentData.rubricData.forEach(({ points }) => {
      row.push(points)
    })

    append(csv, row)
  })
}

module.exports = writeToCSV
