import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Modal } from 'semantic-ui-react';
import EmployeeEdit from './EmployeeEdit'
import { Link } from 'react-router-dom';
class EmployeeRow extends Component {
    state={
        employeeModal: false
    }

    closeEmployeeModal = () => {
        this.setState({
            employeeModal: false
        })
    ;}

    onUpdateEmployeeModal = async (model) =>{
        model = {...model, employee_id: this.props.employee_id }
        await this.props.updateEmployee(model);
        this.closeEmployeeModal();
      }

    render() {
        let employee_id = this.props.employee.employee_id || "i";
        let first_name = this.props.employee.first_name;
        let last_name = this.props.employee.last_name;
        let position = this.props.employee.position;
        return (
                <Table.Row key={employee_id + first_name}>
                      <Table.Cell selectable>
                      <Link to={`/employees/details/${employee_id}`}>{first_name}</Link></Table.Cell>
                      <Table.Cell selectable>
                      <Link to={`/employees/details/${employee_id}`}>{last_name}</Link></Table.Cell>
                      <Table.Cell>{position}</Table.Cell>
                      <Table.Cell>
                      <Modal
                            onClose={this.closeEmployeeModal}
                            open={this.state.employeeModal}
                            trigger={<Button primary onClick={() => { this.setState({ employeeModal: true }) }}>Update</Button>} closeIcon>
                            <Modal.Header>Update Employee</Modal.Header>
                            <Modal.Content>
                                <Modal.Description>
                                    <EmployeeEdit onSubmit={this.onUpdateEmployeeModal}
                                      employee_id = {employee_id}
                                      first_name = {first_name}
                                      last_name = {last_name}
                                      position = {position}/>
                                </Modal.Description>
                            </Modal.Content>
                        </Modal>
                        <Button
                          color="red"
                          onClick={() => this.props.deleteEmployee(employee_id)}
                        >
                          Delete
                        </Button>
                      </Table.Cell>
                    </Table.Row>
        );
    }
}

EmployeeRow.propTypes = {

};

export default EmployeeRow;