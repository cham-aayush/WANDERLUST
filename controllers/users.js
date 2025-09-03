const User = require('../models/user.js');

module.exports.signupForm = (req, res) => {
    res.render('users/signup.ejs');
};

module.exports.signup = async (req, res) => {
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
        
};

module.exports.loginForm = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.login = async (req,res)=>{
    req.flash("success","Logged In");
    res.redirect(res.locals.redirectUrl || '/listings');
}

module.exports.logout = (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Logged Out");
        res.redirect('/listings');
      });
}