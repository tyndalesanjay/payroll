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

// Get Total Hours
router.get('/salary_calculation', (req, res) => {
    if(req.session.loggedin === true && req.session.department === "Accounts") {
        
        conn.query(`SELECT eh.*, eh.id AS hours_id, emp.emp_fn, emp.emp_ln, 
            TRUNCATE((emp.emp_rate * eh.emp_total_hours), 2) AS total_hours_pay, 
            TRUNCATE(((emp_rate * dept_overtime_rate) * eh.emp_total_overtime), 2) AS total_overtime_pay, 
            TRUNCATE(((emp_rate * dept_overtime_rate) * eh.emp_total_overtime) + (emp.emp_rate * eh.emp_total_hours), 2) AS total_pay 
            FROM payroll.departments dept, employees emp, emp_hours eh WHERE emp.emp_dept = dept.id AND eh.emp_id = emp.id`, (err, results) => {
            if(err) {
                console.log(err)
                res.render('accounts/view/salaries', {
                    title: 'Salaries | Employees',
                    sal : '',
                    my_session: req.session
                })
            } else {
                res.render('accounts/view/salaries', {
                    title: 'Salaries | Employees',
                    sal : results,
                    my_session: req.session
                })
            }
        });
        
    } else {
        req.flash('error', 'Incorrect Email/Password, Try Again')
        res.redirect('/login/accounts')
    }
});


// Get by pay cycle
router.post('/cycle', (req, res) => {
    if(req.session.loggedin === true && req.session.department === "Accounts") {
        
        emp_pay_cycle = req.body.cycle

        conn.query(`SELECT eh.*, eh.id AS hours_id, emp.emp_fn, emp.emp_ln, 
        TRUNCATE((emp.emp_rate * eh.emp_total_hours), 2) AS total_hours_pay, 
        TRUNCATE(((emp_rate * dept_overtime_rate) * eh.emp_total_overtime), 2) AS total_overtime_pay,
        TRUNCATE(((emp_rate * dept_overtime_rate) * eh.emp_total_overtime) + (emp.emp_rate * eh.emp_total_hours), 2) AS total_pay 
        FROM payroll.departments dept, employees emp, emp_hours eh WHERE emp.emp_dept = dept.id AND eh.emp_id = emp.id AND eh.emp_pay_cycle = ?`, [emp_pay_cycle],(err, results) => {

            if(err) {
                console.log(err)
                res.render('accounts/view/salaries', {
                    title: 'Salaries | Employees',
                    sal : '',
                    my_session: req.session
                })
            } else {
                res.render('accounts/view/salaries', {
                    title: 'Salaries | Employees',
                    sal : results,
                    my_session: req.session
                })
            }
        });
    } else {
        req.flash('error', 'Incorrect Email/Password, Try Again')
        res.redirect('/login/accounts')
    }
});

module.exports = router;
