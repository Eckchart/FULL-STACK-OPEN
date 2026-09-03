const mongoose = require('mongoose')

// config
const password = process.argv[2]
const url = `mongodb+srv://fsopenUser:${password}@cluster0.4ahxgof.mongodb.net/phonebookApp?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })


const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)
if (process.argv.length === 5) {
  const personToAdd = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  personToAdd.save().then(result => {
    console.log(`added '${personToAdd.name}' number '${personToAdd.number}' to phonebook`)
    mongoose.connection.close()
  })
}
else if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}
else {
  console.log('incorrect number of arguments!')
  mongoose.connection.close()
  process.exit(1)
}
