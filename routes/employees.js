var express = require('express');
var router = express.Router();
var conn = require('../lib/db')

// Home


router.get('/', (req, res) => {
    if(req.session.loggedin === true && req.session.position === "Employee") {
        res.render('employees/index', {
            title: 'DashBoard',
            my_session: req.session
        })
    } else {
        res.redirect('/login/employee')
    }
});

// Get Start Time
router.get('/start', (req, res) => {
    if(req.session.loggedin === true && req.session.position === "Employee") {
        let data = {
            sessions : req.sessionID,
            emp_id : req.session.emp_id,
            work_date : new Date().toISOString().slice(0, 10),
            start_time : new Date().toLocaleTimeString('it-IT')
        }

        console.log(data)
        conn.query('INSERT INTO work_hours SET ?', data, (err, results) => {
           console.log(err)
           if(err) {
               req.flash('error', 'Did Not Sign In Successfully');
               res.redirect('/employee')
           } else {
               req.flash('success', 'You have Now Started');
               res.redirect('/employee')
           }
        });
    }
});

// Get End Time
router.get('/end', (req, res) => {
    if(req.session.loggedin === true && req.session.position === "Employee") {
        let data = {
            end_time : new Date().toLocaleTimeString('it-IT'),
        }
        session_id = req.sessionID

        console.log(data)
        conn.query('UPDATE work_hours wh SET ? WHERE wh.sessions = ?', [data, session_id], (err, results) => {
           console.log(err)
           if(err) {
               req.flash('error', 'Did Not Sign Out Successfully');
               res.redirect('/employee')
           } else {
               req.flash('success', 'You have Now Ended');
               res.redirect('/employee')
           }
        });
    }
});

module.exports = router;
