const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const passport = require("passport");
//bring all routes
const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const question = require("./routes/api/question");
const linux = require("./routes/api/linux");

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

//mongodb config
const db = require("./setup/mydburl").mongoURL

//connect to database
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDb successfully connected"))
    .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());

//config for jwt token
require("./strategies/jsonwebtoken")(passport);

//home route
app.get("/", (req, res) => {
    res.send("Hello World!!")
});
//auth routes..importing from auth file ("./routes/api/auth")
app.use("/api/auth", auth)

//profile routes..importing from profile file ("./routes/api/profile")
app.use("/api/profile", profile)

//question routes..importing from question file ("./routes/api/questions")
app.use("/api/questions", question)

//question routes..importing from question file ("./routes/api/questions")
app.use("/api/linux", linux)

//listen to a port
const port = process.env.port || 9999
app.listen(port);
console.log(`http://127.0.0.1:${port}/`);
