let db = require('../config/db');

const index = (req, res) => {
    res.status(200).send({ message: 'Employees Index' })
}

const getAllEmployees = async (req, res) => {
    try {
        let employees = await db.any(`SELECT e.employee_id, e.first_name, e.last_name, e.position 
                                    FROM employees AS e`)
        res.send({ employees })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}


const getEmployeeById = async (req, res) => {
    try {
        let employee_id = parseInt(req.params.id);
        let employee = await db.one('SELECT employee_id, first_name, last_name, position FROM employees WHERE employee_id = $1', employee_id);
        res.send({ employee })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const addEmployee = async (req, res) => {
    try {
        let { first_name, last_name, position } = req.body;
        let employee = await db.one(
            'INSERT INTO employees(first_name, last_name, position)' +
            'VALUES($1, $2, $3) RETURNING employees.employee_id, employees.first_name, employees.last_name, employees.position', [first_name, last_name, position]
        )
        res.status(200).send({ employee })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const updateEmployee = async (req, res) => {
    try {
        let { first_name, last_name, position } = req.body;
        let employee_id = parseInt(req.params.id);
        await db.any('UPDATE employees SET first_name = $1, last_name = $2, position = $3 WHERE employee_id = $4',
            [first_name, last_name, position, employee_id])
        let updatedEmployee = await db.one('SELECT * FROM employees WHERE employee_id = $1', employee_id);
        res.status(200).json({ employee: updatedEmployee })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const deleteEmployee = async (req, res) => {
    try {
        let employee_id = parseInt(req.params.id);
        let employee = await db.one('SELECT * FROM employees WHERE employee_id = $1', employee_id);
        await db.none('DELETE FROM employee_assignments WHERE employee_id = $1', employee_id);
        await db.none('DELETE FROM project_roles WHERE employee_id = $1', employee_id);
        await db.none('DELETE FROM employees WHERE employee_id = $1', employee_id);
        res.status(200).send({ message: employee });
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const getAllEmployeesHours = async (req, res) => {
    try {
        let employees_hours = await db.any(`
            SELECT a.assignment_est_hours, a.assignment_final_hours, e.first_name, e.last_name, e.employee_id
            FROM employee_assignments as ea
            INNER JOIN assignments as a ON ea.assignment_id = a.assignment_id
            INNER JOIN employees as e ON e.employee_id = ea.employee_id;`)
        res.status(200).send({ employees_hours })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

/**
 * Employee Assignment Controllers
 */

const getAllEmployeesAssignments = async (req, res) => {
    try {
        let employees_assignments = await db.any(
            `SELECT emp_assign_id, assignment_id, employee_id 
             FROM Employee_Assignments`)
        res.status(200).send({ employees_assignments })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}



const getAllEmployeeAssignments = async (req, res) => {
    try {
        let employee_id = req.params.e_id;
        let employee_assignments = await db.any(
            `SELECT ea.emp_assign_id, ea.assignment_id, ea.employee_id, e.first_name, e.last_name, a.assignment_id, a.assignment_name, a.assignment_start_date, a.assignment_end_date, a.assignment_est_hours, a.status_id, a.assignment_final_hours, p.project_id, p.project_name, s.status_id, s.status_name 
             FROM Employee_Assignments as ea 
             JOIN Assignments as a ON ea.assignment_id = a.assignment_id 
             JOIN Projects as p ON p.project_id = a.project_id
             JOIN Status_Types as s ON a.status_id = s.status_id
             JOIN Employees as e ON e.employee_id = ea.employee_id
             WHERE ea.employee_id = $1`,
                [employee_id]
        )
        res.status(200).send({ employee_assignments })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const getAllEmployeesToAssignment = async(req, res) => {
    try {
        let assignment_id = req.params.a_id;
        let assignment_employees = await db.any(
                `SELECT ea.emp_assign_id, ea.assignment_id, ea.employee_id, e.first_name, e.last_name, a.assignment_id, a.assignment_name
                FROM Employee_Assignments as ea
                INNER JOIN Employees as e ON ea.employee_id = e.employee_id
                INNER JOIN Assignments as a ON ea.assignment_id = a.assignment_id
                WHERE ea.assignment_id = $1`,
                 [assignment_id]
        )
        res.status(200).send({ assignment_employees })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const getEmployeeAssignment = async (req, res) => {
    try {
        let employee_id = req.params.e_id;
        let emp_assign_id = req.params.ea_id;
        let employee_assignments = await db.any(
                `SELECT emp_assign_id, assignment_id, employee_id 
                 FROM Employee_Assignments
                 WHERE employee_id = $1 AND assignment_id = $2`,
                 [employee_id, emp_assign_id]
        )
        res.status(200).send({ employee_assignments })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const addAssignmentToEmployee = async (req, res) => {
    try {
        let employee_id = req.params.e_id;
        let { assignment_id } = req.body;
        let employee_assignment = await db.one(
            'INSERT INTO Employee_Assignments (assignment_id, employee_id) ' +
            'VALUES($1, $2) ' +
            'RETURNING assignment_id, employee_id', [assignment_id, employee_id]
        )
        res.status(200).send({ employee_assignment })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const updateEmployeeToAssignment = async (req, res) => {
    try {
        let ea_id = req.params.ea_id;
        let { assignment_id, employee_id } = req.body;
        await db.any('UPDATE Employee_Assignments ' +
                     'SET assignment_id = $1, employee_id = $2 ' +
                     'WHERE emp_assign_id = $3',
            [assignment_id, employee_id, ea_id])
        let updatedEmployee = await db.one('SELECT * FROM Employee_assignments WHERE emp_assign_id = $1', employee_id);
        res.status(200).json({ employee: updatedEmployee })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const deleteAssignmentToEmployee = async (req, res) => {
    try {
        let employee_id = parseInt(req.params.e_id);
        let emp_assign_id = (req.params.ea_id);
        let employee_assignment = await db.one(
            'SELECT * FROM Employee_Assignments WHERE emp_assign_id = $1', emp_assign_id);
        await db.none('DELETE FROM Employee_Assignments WHERE emp_assign_id = $1', emp_assign_id);
        res.status(200).send({ message: employee_assignment });
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

module.exports = {
    index,
    getAllEmployees,
    addEmployee,
    deleteEmployee,
    getEmployeeById,
    updateEmployee,
    getAllEmployeesAssignments,
    getAllEmployeeAssignments,
    getAllEmployeesToAssignment,
    getEmployeeAssignment,
    addAssignmentToEmployee,
    updateEmployeeToAssignment,
    deleteAssignmentToEmployee,
    getAllEmployeesHours
}
