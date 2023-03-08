var express = require('express');
var router = express.Router();
const permissions = require('../perms')

module.exports = (app, passport, bcrypt, checkAuthenticated, checkNotAuthenticated, saltRounds, User,checkAdmin) => {

    router.get('/', checkNotAuthenticated, function (req, res) {
        res.render("userAuth/home");
    });
    router.get('/login', checkNotAuthenticated, function (req, res) {

        res.render("userAuth/login");

    });
    router.post('/login', passport.authenticate("local", {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true

    }));

    //REGISTER
    router.get('/register', checkNotAuthenticated, function (req, res) {

        res.render("userAuth/register");

    });
    router.get('/notApproved', checkAuthenticated, function (req, res) {

        res.render("userAuth/notApproved");

    });
    router.post("/register", checkNotAuthenticated,async function (req, res) {
        var role;
        var approved;
        const users = await User.query();
        if (users.length===0){
            role = "admin";
            approved = 1;
        }
        else{
            role = 'viewer';
            approved = 0;
        }
        bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
            try {
                let UP = await User.query().insert({
                    email: req.body.email,
                    password: hash,
                    approved:approved,
                    role: role
                });
                res.redirect("login");
            } catch (err) {
                console.error(err);
            }

        });

    });



    app.use('/', router);

}
