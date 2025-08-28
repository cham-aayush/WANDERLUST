const express = require('express');
const router = express();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');


router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});

router.post('/signup',
     wrapAsync(async (req, res) => {
try{
    const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Wanderlust!');
        res.redirect('/listings');
        });
} catch(e){
    req.flash('error', e.message);
    res.redirect('/signup');
}
        
}));


router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post("/login", saveRedirectUrl,
    passport.authenticate("local",{
    failureFlash:true,
    failureRedirect:"/login"
}),async (req,res)=>{
    req.flash("success","Logged In");
    res.redirect(res.locals.redirectUrl || '/listings');
});

router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Logged Out");
        res.redirect('/listings');
      });
}); 


module.exports = router;
