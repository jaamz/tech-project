import React, { Component } from 'react';
import { getAllEmployees, deleteEmployee } from '../../Redux/Actions/index';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazy-load';
import { Button, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

class EmployeesPage extends Component {
    state = {
        employees: []
    }
    componentDidMount() {
        this.fetchAllEmployees();
    }

    fetchAllEmployees = () => {
        this.props.getAllEmployees()

    };

    render() {
        let { employees } = this.props

        return (
            <div>
            <Link to='/createEmployees'><Button>Create</Button></Link>

    
            <LazyLoad height={100} offsetVertical={300}>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Employee ID</Table.HeaderCell>
                            <Table.HeaderCell>First Name</Table.HeaderCell>
                            <Table.HeaderCell>Last Name</Table.HeaderCell>
                            <Table.HeaderCell>Position</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>

                        {   
                            employees.map((em) => {
                            let employee_id = em.employee_id || "i"
                            let first_name = em.first_name;
                            let last_name = em.last_name;
                            let position = em.position;
                            return (
                                
                                <Table.Row key={employee_id}>
                                    <Table.Cell> {employee_id}</Table.Cell>
                                    <Table.Cell>{first_name}</Table.Cell>
                                    <Table.Cell>{last_name}</Table.Cell>
                                    <Table.Cell>{position}</Table.Cell>
                                    <Link to='/update-employee'><Button>Update</Button></Link>
                                    <Button onClick={() => this.props.deleteEmployee(employee_id)}>Delete</Button>
                                   
                                </Table.Row>

                            );
                                
                        })}
                    </Table.Body>
                </Table>
            </LazyLoad>
            </div>

        );
    }
}

const mapStateToProps = ({ employeeReducer }) => ({
    employees: employeeReducer.employees
})

const mapDispatchToProps = dispatch => ({
    getAllEmployees: () => dispatch(getAllEmployees()),
    deleteEmployee: (id) => dispatch(deleteEmployee(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(EmployeesPage);