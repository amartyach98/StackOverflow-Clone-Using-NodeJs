const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const passport = require("passport");

//load Person model
const Person = require("../../models/Person");
//load Person model
const Profile = require("../../models/profile");
//load Question model
const Question = require("../../models/Question");
//load Linux model
const Linux = require("../../models/Linux");


//@type - GET
//@route -  /api/linux
//@desc - route for submit linux question
//@access - PRIVATE
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    const newQuestion = new Linux({
        user: req.user.id,
        desc: req.body.desc,
        code: req.body.code,
        err: req.body.err
    });
    newQuestion.save()
        .then(question => {
            return res.json(question);
        })
        .catch(err => console.log("Error in submitting Linux Question", err));
});
module.exports = router;
