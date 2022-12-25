const express = require("express")
const router = express.Router()
const { body, validationResult } = require('express-validator');
const fetchuser = require("../middlewares/fechuser");
const Note = require("../models/Note");

// route 1 : Get all the Notes , Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }

    // res.json([])
})

// route 2 : Add new Notes , Login required
router.post("/addnote", fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 characters ').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({ title, description, tag, user: req.user.id })
        const savedNote = await note.save()
        res.json(savedNote)

    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

// route 3 : Update note, Login requried
router.put("/updatenote/:id", fetchuser, async (req, res) => {
    const { title, description, tag } = req.body

    try {
        const newNote = {}
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(401).send("Not Found")
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not Allowed")
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.status(200).json(note)
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
})
// route 3 : delete note, Login requried
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(401).send("Not Found")
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not Allowed")
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.status(200).json({ note, success: "note has been deleted" })
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
})



module.exports = router