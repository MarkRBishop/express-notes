const express = require('express')
const fs = require('fs')
const path = require('path')
const uuid = require('./helpers/uuid')

const app = express()
const PORT = process.env.PORT || 3001;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'))
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'))
    res.json(notes)
})

app.post('/api/notes', (req, res) => {
    const { noteName, noteText } = req.body
    const newNote = {
        id: uuid(),
        noteName,
        noteText,
    }
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'))
    notes.push(newNote)
    fs.writeFileSync('db.json', JSON.stringify(notes))
    res.json(newNote)
})

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})