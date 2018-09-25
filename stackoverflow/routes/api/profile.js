const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const passport = require("passport");

//load Person model
const Person = require("../../models/Person");
//load Person model
const Profile = require("../../models/profile");

//@type - GET
//@route -  /api/profile
//@desc - route for personal users profile
//@access - PRIVATE
router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (!profile) {
                return res.status(404).json({ profilenotfound: "No profile found" })
            }
            res.json(profile);
        })
        .catch(err => console.log(err));
});





//@type - POST
//@route -  /api/profile
//@desc - route for update & saving personal user profile
//@access - PRIVATE
router.post("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    const profilevalue = {};
    profilevalue.user = req.user.id;
    if (req.body.username) {

        profilevalue.username = req.body.username;
    }
    if (req.body.website) {

        profilevalue.website = req.body.website;
    }
    if (req.body.country) {
        profilevalue.country = req.body.country;
    }
    if (req.body.portfolio) {
        profilevalue.portfolio = req.body.portfolio;
    }
    if (typeof req.body.language !== undefined) {
        profilevalue.language = req.body.language.split(",");
    }

    //get social links
    profilevalue.social = {};
    if (req.body.youtube) {
        profilevalue.social.youtube = req.body.youtube;
    }
    if (req.body.facebook) {

        profilevalue.social.facebook = req.body.facebook;
    }
    if (req.body.Instagram) {
        profilevalue.social.Instagram = req.body.Instagram;
    }
    //do db work here
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (profile) {
                Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profilevalue },
                    { new: true }
                ).then(profile => {
                    res.json(profile)
                })
                    .catch(err => console.log('Problem in Update', err));
            }
            else {
                //checking is username is unique or not(already exist or not)
                Profile.findOne({ username: profilevalue.username })
                    .then(profile => {
                        if (profile) {
                            res.status(404).json({ username: "username already exists" })
                        }
                        else {
                            //save userprofile
                            new Profile(profilevalue).save()
                                .then(profile => res.json(profile))
                                .catch(err => console.log("Problem in Saving user profile", err));
                        }
                    })
                    .catch(err => console.log('Problem in Saving', err));
            }

        })
        .catch(err => console.log('Problem in fetching', err));

});


//@type - POST
//@route -  /api/profile/username
//@desc - route for getting userprofile based on username
//@access - PUBLIC
router.get("/:username", (req, res) => {
    Profile.findOne({ username: req.params.username })
        .populate("user", ["name", "profilepic"])
        .then(profile => {
            if (!profile) {
                res.status(404).json({ usernotfound: "User not found" })
            }
            res.json(profile);

        })
        .catch(err => console.log("Problem in Fetching Username", err))
});


//@type - POST
//@route -  /api/profile/id/username
//@desc - route for getting userprofile based on id
//@access - PUBLIC
router.get("/id/:user", (req, res) => {
    Profile.findOne({ id: req.params.user.id })
        .populate("user", ["name", "profilepic"])
        .then(profile => {
            if (!profile) {
                res.status(404).json({ usernotfound: "User not found" })
            }
            res.json(profile);

        })
        .catch(err => console.log("Problem in Fetching id", err))
});

//@type - GET
//@route -  /api/profile/find/everyone
//@desc - route for getting userprofile of everyone
//@access - PUBLIC
router.get("/find/everyone", (req, res) => {
    Profile.find()
        .populate("user", ["name", "profilepic"])
        .then(profile => {
            if (!profile) {
                res.status(404).json({ usernotfound: "User not found" })
            }
            res.json(profile);

        })
        .catch(err => console.log("Problem in Fetching id", err))
});


//@type - DELETE
//@route -  /api/profile/delete
//@desc - route for delete user based on ID
//@access - PRIVATE
router.delete("/delete", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
    Profile.findOneAndRemove({ user: req.user.id })
        .then(() => {
            Person.findOneAndRemove({ _id: req.user.id })
                .then(() => res.json({ Delete: "Deleted Successfully" }))
                .catch(err => console.log("problem in delete user-account", err))
        })
        .catch(err => console.log("problem in delete user-profile", err));
});

//@type - POST
//@route -  /api/profile/workrole
//@desc - route for adding workrole of a user
//@access - PRIVATE
router.post("/workrole", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (!profile) {
                res.json({ profilenotfound: "PROFILE NOT FOUND" })
            }
            const newwork = {
                role: req.body.role,
                company: req.body.company,
                country: req.body.country,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                details: req.body.details,
            };
            profile.workrole.unshift(newwork);
            profile.save()
                .then(profile => {
                    res.json(profile)
                })
                .catch(err => console.log("problem in save workprofile of a user", err));
        })
        .catch(err => console.log("problem in  workprofile of a user", err));
});


//@type - DELETE
//@route -  /api/profile/workrole/:w_id
//@desc - route for deleting a specific workrole
//@access - PRIVATE
router.delete("/workrole/:w_id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            //assignemnt to check if we got a profile
            const removethis = profile.workrole
                .map(item => item.id)
                .indexOf(req.params.w_id);

            profile.workrole.splice(removethis, 1);

            profile
                .save()
                .then(profile => {
                    return res.json(profile);
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
})
module.exports = router;