const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

// config //
const password = process.argv[2]
const url = `mongodb+srv://fsopenUser:${password}@cluster0.4ahxgof.mongodb.net/noteApp?appName=Cluster0`

mongoose.set('strictQuery', false)

// `family: 4` = only use IPv4 addresses
mongoose.connect(url, { family: 4 })
////////////


const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean
})
const Note = mongoose.model('Note', noteSchema)
const note = new Note({
  content: 'HTML is easy',
  important: true
})

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

// The parameter of '.find()' is an object expressing search conditions.
Note.find({}).then(result => {
  result.forEach(note => {
    console.log('note', note)
  })
  mongoose.connection.close()
})
