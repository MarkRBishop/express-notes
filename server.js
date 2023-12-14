const express = require('express')
const fs = require('fs')
const path = require('path')
const uuid = require('./helpers/uuid')

const app = express()
const PORT = process.env.PORT || 3001;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'))
})

app.get('/api/notes', (req, res) => {
   fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading note file:', err)
            res.status(500).json({error: 'Internal Server Error'})
        } else {
            const notes = JSON.parse(data)
            console.log('Notes:', notes)
            res.json(notes)
        }
   })
})

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body
    const newNote = {
        id: uuid(),
        title,
        text,
    }
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'))
    notes.push(newNote)
    fs.writeFileSync('./db/db.json', JSON.stringify(notes))
    res.json(newNote)
})

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})