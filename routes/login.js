var express = require('express');
var router = express.Router();
var conn = require('../lib/db')

/* GET home page. */
router.get('/supervisor', (req, res) => {
    res.render('supervisor/login', {title: 'Login Page'})
});

// Check auth
router.post('/slogin', function(req, res, next) {
        emp_email = req.body.emp_email,
        emp_password = req.body.emp_password
    
    conn.query('SELECT emp.*, emp.id AS emp_id, dept.*, dept.id AS dept_id, post.*, post.id AS post_id FROM employees emp, departments dept, positions post WHERE emp_email = ? AND BINARY emp_password = ? AND emp.emp_dept = dept.id AND emp.emp_post = post.id', [emp_email, emp_password], (err, results) => {
        console.log(results)
        
        if (results.length <= 0) {
            req.flash('error', 'Incorrect username or password');
            res.redirect('/login/supervisor')
        } else {
            req.flash('success', 'SuperVisor Logged In');
            req.session.loggedin = true
            req.session.emp_id = results[0].emp_id,
            req.session.emp_fn = results[0].emp_fn,
            req.session.emp_ln = results[0].emp_ln,
            req.session.dept_id = results[0].dept_id,
            req.session.dept = results[0].dept_name,
            req.session.post_id = results[0].post_id,
            req.session.position = results[0].post_name
            res.redirect('/supervisor');
             
        }
    });
});

// Logout Super Admin
router.get('/sadminlogout', function (req, res) {
    req.session.destroy();
    res.redirect('/login/supervisor');
  });

/* ********************************************************************************** */
// Account Login

router.get('/accounts', (req, res) => {
    res.render('accounts/login', {title : 'Accounts | Login'})
});


router.post('/accAuth', (req, res) => {

    emp_email = req.body.emp_email,
    emp_password = req.body.emp_password
    conn.query('SELECT emp.*, emp.id AS emp_id, dept.*, dept.id AS dept_id, post.*, post.id AS post_id FROM employees emp, departments dept, positions post WHERE emp_email = ? AND BINARY emp_password = ? AND emp.emp_dept = dept.id AND emp.emp_post = post.id', [emp_email, emp_password], (err, results) => {
        console.log(results)
        if (results.length <= 0) {
            req.flash('error', 'Incorrect username or password');
            res.redirect('/login/accounts')
        } else {
            req.flash('success', 'Employee Logged In');
            req.session.loggedin = true
            req.session.emp_id = results[0].emp_id,
            req.session.emp_fn = results[0].emp_fn,
            req.session.emp_ln = results[0].emp_ln,
            req.session.dept_id = results[0].dept_id,
            req.session.department = results[0].dept_name,
            req.session.post_id = results[0].post_id,
            req.session.position = results[0].post_name
            res.redirect('/accounts');
        }
        console.log(req.session.dept_id)
    });

})

// Logout Admin
router.get('/acclogout', function (req, res) {
    req.session.destroy();
    res.redirect('/login/accounts');
});


/* ********************************************************************************** */
// Employee Login

router.get('/employee', (req, res) => {
    res.render('employees/login', {title : 'Employees | Login'})
});


router.post('/empAuth', (req, res) => {

    emp_email = req.body.emp_email,
    emp_password = req.body.emp_password
    conn.query('SELECT emp.*, emp.id AS emp_id, dept.*, dept.id AS dept_id, post.*, post.id AS post_id FROM employees emp, departments dept, positions post WHERE emp_email = ? AND BINARY emp_password = ? AND emp.emp_dept = dept.id AND emp.emp_post = post.id', [emp_email, emp_password], (err, results) => {
        console.log(results)
        if (results.length <= 0) {
            req.flash('error', 'Incorrect username or password');
            res.redirect('/login/employee')
        } else {
            req.flash('success', 'Employee Logged In');
            req.session.loggedin = true
            req.session.emp_id = results[0].emp_id,
            req.session.emp_fn = results[0].emp_fn,
            req.session.emp_ln = results[0].emp_ln,
            req.session.dept_id = results[0].dept_id,
            req.session.department = results[0].dept_name,
            req.session.post_id = results[0].post_id,
            req.session.position = results[0].post_name
            res.redirect('/employee');
        }
    });

})

// Logout Tour Admin
router.get('/emplogout', function (req, res) {
    req.session.destroy();
    res.redirect('/login/employee');
});

module.exports = router;