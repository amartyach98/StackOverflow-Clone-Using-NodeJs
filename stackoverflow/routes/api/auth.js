const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jswt = require("jsonwebtoken");
const passport = require("passport");
const bodyparser = require("body-parser");
const key = require("../../setup/mydburl");


//@route - GET  /
//@desc - a route to /, testing purpose
//@access - PUBLIC
router.get("/", (req, res) => res.json({ auth: "auth is being tested" }));


//import schema for register a person

const Person = require("../../models/Person");

//@type - POST
//@route -  /api/auth/register
//@desc - route for registering users
//@access - PUBLIC

router.post("/register", (req, res) => {
    Person.findOne({ email: req.body.email })
        .then(person => {
            if (person) {
                return res.status(400).json({ emailerror: "You are already registered with us!! Please Login!!" });
            }
            else {

                const myperson = new Person({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    gender: req.body.gender,

                });

                //encrypt password using bcryptjs

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(myperson.password, salt, (err, hash) => {
                        if (err) {
                            console.log(err)
                        }
                        // Store hash in your password DB.
                        myperson.password = hash

                        myperson
                            .save()
                            .then(Person => res.json(Person))
                            .catch(err => console.log(err));

                    });
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
});


//@type - POST
//@route -  /api/auth/login
//@desc - route for loging users
//@access - PUBLIC

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    Person.findOne({ email: email })
        .then(person => {
            if (!person) {
                return res.status(400).json({ emailerror: "You are not Registered! Please Register!!" });
            }
            //unhashing password and check (bcryptjs)
            bcrypt.compare(password, person.password)
                .then(isCorrect => {
                    if (isCorrect) {
                        // return res.status(400).json({login:"login success"});
                        //use payload and create token for user
                        const payload = {
                            id: person.id,
                            name: person.name,
                            email: person.email
                        };
                        jswt.sign(
                            payload,
                            key.secret,
                            { expiresIn: '1h' },
                            (err, token) => {
                                if (err) {
                                    throw err
                                    res.json({
                                        success: false,
                                        token: "null"
                                    })
                                }
                                res.json({
                                    success: true,
                                    token: "Bearer " + token
                                })
                            }
                        )
                    }
                    else {
                        return res.status(400).json({ login: "Invalid password" });
                    }
                })
                .catch(err => {
                    console.log(err);
                });

        })
        .catch(err => {
            console.log(err);
        });


});

//@type - GET
//@route -  /api/auth/profile
//@desc - route for users profile
//@access - PRIVATE
router.get("/profile", passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req);
    res.json({
        //passport-jwt throw object user
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        propic: req.user.profilepic,
        gender: req.user.gender

    });
});

module.exports = router;