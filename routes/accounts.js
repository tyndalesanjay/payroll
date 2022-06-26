var express = require('express');
var router = express.Router();
var conn = require('../lib/db')

// Home


router.get('/', (req, res) => {
    if(req.session.loggedin === true && req.session.department === "Accounts") {
        res.render('accounts/index', {
            title: 'DashBoard',
            my_session: req.session
        })
    } else {
        req.flash('error', 'Incorrect Email/Password, Try Again')
        res.redirect('/login/accounts')
    }
    console.log(results)
});

module.exports = router;
