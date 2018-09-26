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


//@type - POST
//@route -  /api/linux
//@desc - route for submit linux question
//@access - PRIVATE
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    const newQuestion = new Linux({
        user: req.user.id,
        desc: req.body.desc,
        code: req.body.code,
        err: req.body.err,
        name: req.user.name,
    });
    newQuestion.save()
        .then(question => {
            return res.json(question);
        })
        .catch(err => console.log("Error in submitting Linux Question", err));
});

//@type - GET
//@route -  /api/linux
//@desc - route for showing all linux_question
//@access - PUBLIC
router.get("/", (req, res) => {
    Linux.find()
        .sort({ date: "desc" })
        .then(linux => {
            if (!linux) {

            }
            res.json(linux)
        })
        .catch(err => consol.log("Problem in fetching question", err));
});

//@type - DELETE
//@route -  /api/linux/delete/:qid
//@desc - route for deleting a specific linux_question
//@access - PRIVATE
router.delete("/delete/:qid", passport.authenticate("jwt", { session: false }), (req, res) => {
    Linux.findById(req.params.qid)
        .then(linux => {
            if (!linux) {
                return res.json({ NoLinuxQuestion: "Linux_Question Not found" });
            }
            Linux.findOneAndRemove({ _id: req.params.qid })
                .then(() => res.json({ Deleted: "Successfully Deleted!" }))
                .catch(err => console.log("Problem in deleting linux_question"));
        })
        .catch(err => console.log("Problem in fetching linux_question"));
});

//@type - DELETE
//@route -  /api/linux/all
//@desc - route for deleting a all linux_question of a user
//@access - PRIVATE
router.delete("/all", passport.authenticate("jwt", { session: false }), (req, res) => {
    Linux.find({ user: req.user.id }).remove()
        .then(() => res.json({ Deleted: "Successfully Deleted!" }))
        .catch(err => console.log("Problem in deleting all linux_question"));
});

//@type - POST
//@route -  /api/linux/answers/:id
//@desc - route for submit answers to linux_questions
//@access - PRIVATE
router.post("/answers/:qid", passport.authenticate("jwt", { session: false }), (req, res) => {
    Linux.findById(req.params.qid)
        .then(linux => {
            if (!linux) {
                return res.json({ QuestionNotFound: "Question not found" });
            }
            console.log(req.user.id);
            const newlinuxanswer = {
                user: req.user.id,
                text: req.body.text,
                name: req.user.name,

            }
            linux.answers.unshift(newlinuxanswer);
            linux.save()
                .then(linux => {
                    return res.json(linux);
                })
                .catch(err => console.log("Problem in submitting answer", err));
        })
        .catch(err => console.log("Problem in fetching linux_question", err));
});

//@type - POST
//@route -  /api/linux/upvote/:id
//@desc - route for upvoting linux questions 
//@access - PRIVATE
router.post("/upvote/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOne({ user: req.user._id }).then(profile => {
        Linux.findById(req.params.id)
            .then(linux => {
                if (!linux) {
                    return res.json({ QuestionNotFound: "Question not found!!" });
                }
                else {
                    if (linux.upvotes.filter(upvote => upvote.user.toString() ===
                        req.user.id.toString()).length > 0) {
                        const removethis = linux.upvotes
                            .map(item => item.id)
                            .indexOf(req.params.id);

                        linux.upvotes.splice(removethis, 1);
                        linux.save()
                            .then(questiondownvote => {
                                return res.json(questiondownvote);
                            })
                            .catch(err => console.log("Problem in saving after downvote", err));
                    }
                    else {
                        linux.upvotes.unshift({ user: req.user.id });
                        linux.save()
                            .then(linux => {
                                res.json(linux)
                            })
                            .catch(err => console.log("Problem in saving upvote", err));
                    }
                }
            })
            .catch(err => console.log("Error in fetching Question", err));
    }).catch(err => {
        console.log("Error in fetching profile", err);
    })
});


//@type - POST
//@route -  /api/linux/answers/upvote/:qid/:aid
//@desc - route for upvoting linux answers
//@access - PRIVATE
router.post("/answers/upvote/:qid/:aid", passport.authenticate("jwt", { session: false }), (req, res) => {
    console.log("working fine!")
    Profile.findOne({ user: req.user.id }).then(profile => {
        if (!profile) {
            res.json({ YourProfileNotFound: "You Profile is not Completed!Please Provide us your details!" });
        }
        Linux.findById(req.params.qid).then(linux => {
            if (!linux) {
                res.json({ LinuxQuestionNotFound: "No Linux Question Found" });
            }
            linux.answers.map(item => {

                if (item.id == req.params.aid) {
                    console.log(item); {
                        if (item.love.filter(upvote => upvote.user.toString() ===
                            req.user.id.toString()).length > 0) {
                            const removelove = item.love.map(itm => itm.user).indexOf(req.user.id);
                            item.love.splice(removelove, 1);

                        }
                        else {
                            item.love.unshift({ user: req.user.id });
                        }

                    }
                }
            });
            linux.save().then(linux => {
                return res.json(linux);

            }).catch(err => console.log("Problem in saving Answer upvotes", err));

        }).catch(err => console.log("Problem in fetching question", err));
    }).catch(err => console.log("Problem in fetching profile", err));
});
module.exports = router;
