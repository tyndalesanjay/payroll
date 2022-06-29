var express = require('express');
var router = express.Router();
var conn = require('../lib/db')

// Home


router.get('/', (req, res) => {
    if(req.session.loggedin === true && req.session.position === "Supervisor") {
        res.render('supervisor/index', {
            title: 'DashBoard',
            my_session: req.session
        })
    } else {
        res.redirect('/login/supervisor')
    }
});

// view employees
router.get('/employees', (req, res) => {
    if(req.session.loggedin === true && req.session.position === "Supervisor") {
        department = req.session.dept;

        conn.query(`SELECT emp.*, emp.id AS emp_id, dept.*, dept.id AS dept_id, post.*,
         post.id AS post_id FROM employees emp, departments dept, positions post WHERE 
         emp.emp_dept = dept.id AND emp.emp_post = post.id AND dept.dept_name = ? ORDER BY emp_id`, department, (err, results) => {
            if(err) {
                console.log(err)
                res.render('supervisor/view/view_employee', {
                    title : 'Employees',
                    emp : '',
                    my_session : req.session
                })
            } else {
                res.render('supervisor/view/view_employee', {
                    title : 'Employees',
                    emp : results,
                    my_session : req.session
                })
            }
        });
        
    } else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/supervisor')
    }
});

// Add Employees
router.get('/employee_add', (req, res) => {
    if(req.session.loggedin === true && req.session.position === "Supervisor") {

        conn.query(`SELECT * FROM positions`, (err, results) => {
            if(err) {
                console.log(err)
                res.render('supervisor/add/add_employee', {
                    title : 'Add | Employees',
                    post : '',
                    my_session : req.session
                })
            } else {
                res.render('supervisor/add/add_employee', {
                    title : 'Add | Employees',
                    post : results,
                    my_session : req.session
                })
            }
        });
        
    } else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/supervisor')
    }
});

// Post Employees
router.post('/add', (req, res) => {
    if(req.session.loggedin === true && req.session.position === "Supervisor") {
        
        let data = {
            emp_dept : req.session.dept_id,
            emp_fn : req.body.emp_fn,
            emp_ln : req.body.emp_ln,
            emp_post : req.body.position,
            emp_contact : req.body.emp_contact,
            emp_email : req.body.emp_email,
            emp_password : req.body.emp_password,
            emp_rate : req.body.rate
            
        };
        console.log(data)
        conn.query('INSERT INTO employees SET ?', data, (err, results) => {
            if(err) {
                console.log(err)
                req.flash('error', 'Employee was not added Successfully');
                res.redirect('/supervisor/employee_add')
            } else {
                req.flash('success', 'Employee Add');
                res.redirect('/supervisor/employee_add')
            }
        }); 
    } else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/supervisor')
    };
});

// get update
router.get('/employee_update/:emp_id', (req, res) => {
    if(req.session.loggedin === true && req.session.position === "Supervisor") {
        department = req.session.dept;

        conn.query(`SELECT emp.*, emp.id AS emp_id, dept.*, dept.id AS dept_id, post.*,
         post.id AS post_id FROM employees emp, departments dept, positions post WHERE 
         emp.emp_dept = dept.id AND emp.emp_post = post.id AND dept.dept_name = ? AND emp.id =` + req.params.emp_id, department, (err, results) => {
            if(err) {
                console.log(err)
                res.render('supervisor/add/update_employee', {
                    title : 'Employees',
                    emp : '',
                    my_session : req.session
                })
            } else {
                res.render('supervisor/add/update_employee', {
                    title : 'Employees',
                    emp : results,
                    my_session : req.session
                })
            }
        });
    } else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/supervisor')
    }
});

// update Employee
router.post('/update/:id', (req, res) => {
    if(req.session.loggedin === true && req.session.position === "Supervisor") {
        
        let data = {
            emp_dept : req.session.dept_id,
            emp_fn : req.body.emp_fn,
            emp_ln : req.body.emp_ln,
            emp_post : req.body.position,
            emp_contact : req.body.emp_contact,
            emp_email : req.body.emp_email,
            emp_password : req.body.emp_password,
            emp_rate : req.body.rate
            
        };
        console.log(data)
        conn.query('UPDATE employees emp SET ? WHERE emp.id =' + req.params.id, data, (err, results) => {
            if(err) {
                console.log(err)
                req.flash('error', 'Employee was not Updated Successful');
                res.redirect('/supervisor/employees')
            } else {
                req.flash('success', 'Employee Updated');
                res.redirect('/supervisor/employees')
            }
        }); 
    } else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/supervisor')
    };
});

// Work Hours
router.get('/emp_work_hours/:emp_id', (req, res) => {
    if(req.session.loggedin === true && req.session.position === "Supervisor") {

        department = req.session.dept;

        conn.query('SELECT truncate((TIMEDIFF(wh.end_time, wh.start_time)/10000), 2) AS hours, emp.emp_fn, emp.emp_ln, emp.id AS emp_id, wh.*, wh.id AS work_id, dept.*, dept.id AS dept_id FROM employees emp, work_hours wh, departments dept WHERE emp.emp_dept = dept.id AND wh.emp_id = emp.id AND dept.dept_name = ? AND wh.work_date BETWEEN CURDATE()-5 AND CURDATE() - INTERVAL 1 day AND wh.emp_id =' + req.params.emp_id, department,(err, results) => {
            if(err) {
                console.log(err)
                res.render('supervisor/hours', {
                    title : 'Work Hours',
                    emp : '',
                    my_session : req.session
                })
            } else {
                res.render('supervisor/hours', {
                    title : 'Work Hours',
                    emp : results,
                    my_session : req.session
                })
            }
            console.log(results)

        });
        
    } else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/supervisor')
    }
});

// Get Add OverTime
router.get('/emp_hour_details/:work_id', (req, res) => {
    if(req.session.loggedin === true && req.session.position === "Supervisor") {

        department = req.session.dept;

        conn.query('SELECT emp.emp_fn, emp.emp_ln, truncate((TIMEDIFF(wh.end_time, wh.start_time)/10000), 2) AS hours, truncate(SUM(overtime_hours), 2) AS total_overtime, emp.id AS emp_id, wh.*, wh.id AS work_id, dept.*, dept.id AS dept_id FROM employees emp, work_hours wh, departments dept WHERE emp.emp_dept = dept.id AND wh.emp_id = emp.id AND dept.dept_name = ? AND wh.id =' + req.params.work_id, department,(err, results) => {
            
            if(err) {
                console.log(err)
                res.render('supervisor/add/cal_overtime', {
                    title : 'Update | Work Hours',
                    emp : '',
                    my_session : req.session
                })
            } else {
                res.render('supervisor/add/cal_overtime', {
                    title : 'Update | Work Hours',
                    emp : results[0],
                    my_session : req.session
                })
            }

        });
        
    } else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/supervisor')
    }
});

// Post Overtime Update
router.post('/update_overtime/:id', (req, res) => {
    if(req.session.loggedin === true && req.session.position === "Supervisor") {
        let data = {
           start_time : req.body.start_time,
           end_time : req.body.end_time,
           hours_worked : req.body.hours_worked,
           overtime_hours : req.body.overtime_hours
        }

        console.log(data)
        conn.query('UPDATE work_hours wh SET ? WHERE wh.id=' + req.params.id, data, (err, results) => {
            if(err) {
                console.log(err)
                req.flash('error', 'Did Not Update')
                res.redirect('/supervisor/employees')
            } else {
                req.flash('success', 'Updated Successfully')
                res.redirect('/supervisor/employees')
            }
        });
    } else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/supervisor')
    }
});

// Get Summary
router.get('/summary/:emp_id', (req, res) => {
    department = req.session.dept;
    if(req.session.loggedin === true && req.session.position === "Supervisor") {
        conn.query('SELECT emp.id AS emp_id, truncate(SUM(hours_worked - overtime_hours), 2) AS total_worked, truncate(SUM(overtime_hours), 2) AS total_overtime FROM employees emp, work_hours wh, departments dept WHERE emp.emp_dept = dept.id AND wh.emp_id = emp.id AND dept.dept_name = ? AND wh.work_date BETWEEN CURDATE()-5 AND CURDATE() - INTERVAL 1 day AND wh.emp_id =' + req.params.emp_id, department,(err, results) => {
            console.log(err)
            console.log(results)
            if(err) {
                res.render('supervisor/add/summary', {
                    title : 'Summary | Work Hours',
                    emp : '',
                    my_session : req.session
                })
            } else {
                res.render('supervisor/add/summary', {
                    title : 'Summary | Work Hours',
                    emp : results[0],
                    my_session : req.session
                })
            }
        });
    } else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/supervisor')
    }
});

// Post Summary
router.post('/salary', (req, res) => {
    if(req.session.loggedin === true && req.session.position === "Supervisor") {
        let data = {
           emp_id : req.body.emp_id,
           emp_total_hours : req.body.total_hours,
           emp_total_overtime : req.body.overtime_hours,
           emp_pay_cycle : req.body.weeks,
        }
        conn.query('INSERT INTO emp_hours SET ?', data, (err, results) => {
            if(err) {
                console.log(err)
                req.flash('error', 'Did Not Send')
                res.redirect('/supervisor/employees')
            } else {
                req.flash('success', 'Sent Successfully')
                res.redirect('/supervisor/employees')
            }
        });
    } else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/supervisor')
    }
});

module.exports = router;
