import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const fswrite = fs.writeFileSync
const fsappend = fs.appendFileSync

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

export default writeToCSV
