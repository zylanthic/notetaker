const express = require("express");
const fs = require("fs");
const path = require("path");
const util = require("util");



const readFileA = util.promisify(fs.readFile);
const writeFileA = util.promisify(fs.writeFile);


const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static("./develop/public"));

// get
app.get("/api/notes", function(req, res){
    readFileA("./develop/db/db.json", "utf8").then(function(data) {
        notes = [].concat(JSON.parse(data))
        res.json(notes)
    })
})

// post
app.post("/api/notes", function(req, res) {
    var note = req.body;
    readFileA("./develop/db/db.json", "utf8").then(function(data) {
        var notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1;
        notes.push(note);
        return notes;
    }).then(function(notes){
        writeFileA("./develop/db/db.json", JSON.stringify(notes));
        res.json(note)
    })
})

// delete
app.delete("/api/notes/:id", function(req, res){
    const idDelete = parseInt(req.params.id);
    readFileA("./develop/db/db.json", "utf8").then(function(data){
        const notes = [].concat(JSON.parse(data));
        const newNote = [];
        for (let i = 0; i < notes.length; i++) {
            if(idDelete !== notes[i].id) {
                newNote.push(notes[i])
            }
        }
        return newNote
    }).then(function(notes) {
        writeFileA("./develop/db/db.json", JSON.stringify(notes))
        res.send('Saved')
    })
})

// routes
app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname, "./develop/public/notes.html"));
});
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "./develop/public/index.html"));
});
app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "./develop/public/index.html"));
});

//listening
app.listen(PORT, function() {
    console.log("App listening on PORT" + PORT)
})