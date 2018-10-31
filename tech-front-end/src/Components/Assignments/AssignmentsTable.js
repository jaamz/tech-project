import React, { Component } from 'react';
import { getAllAssignments, getAllAssignmentsOrdered, getAllAssignmentsReversed, deleteAssignment } from '../../Redux/Actions/index';
import { IN_ORDER, RECENT_ORDER, NEED_ATTENTION } from '../../Redux/Constants/';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazy-load'
import { Button, Table, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import {formatDate} from '../../util/DateHelper'


class AssignmentsTable extends Component {
    componentDidMount() {
        // this.fetchAllAssignments()
    }

    // fetchAllAssignments = async () => {
    //     let { assignments } = this.props
    //     switch(this.props.sortOrder) {
    //         case IN_ORDER:
    //             await this.props.getAllAssignmentsOrdered();
    //             return assignments;
    //         case RECENT_ORDER:
    //             await this.props.getAllAssignmentsReversed();
    //             return assignments;
    //         case NEED_ATTENTION:
    //             await this.props.getAllAttentionAssignments();
    //             return assignments;
    //         default:
    //             return assignments;
    //     }
    // }

    determineStatus = (status_name) => {
        switch(status_name) {
            case 'Blocked':
                return 'error';
            case 'Waiting Merge':
                return 'warning';
            case 'Completed' || 'Release':
                return 'positive';
            case 'Not Started':
            default:
                return "";
        }
    }
    render() {
        let { assignments, header, showUpdate } = this.props
        // this.sortAssignments(this.props.sortOrder)
            return (
                <div>
                        {/* <LazyLoad height={300} offsetVertical={200}> */}
                            <div>
                                <Header color='blue'>{header}</Header>
                                <Table singleLine celled selectable>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                            <Table.HeaderCell>Project Name</Table.HeaderCell>
                                            <Table.HeaderCell>Status</Table.HeaderCell>
                                            <Table.HeaderCell>Start Date</Table.HeaderCell>
                                            <Table.HeaderCell>End Date</Table.HeaderCell>
                                            <Table.HeaderCell>Estimated Hours</Table.HeaderCell>
                                            <Table.HeaderCell>Final Elapsed Hours</Table.HeaderCell>
                                            <Table.HeaderCell> </Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {assignments && assignments.map((a) => {
                                            let assignment_id = a.assignment_id || "Error Assign ID /"
                                            let assignment_name = a.assignment_name || "Error Name /"
                                            let project_id = a.project_id || "Error Project ID /"
                                            let project_name = a.project_name || "Error Project ID /"
                                            let status_id = a.status_id || "Error Status ID /"
                                            let status_name = a.status_name || "Error Status ID /"
                                            let assignment_start_date = a.assignment_start_date && formatDate(a.assignment_start_date)
                                            let assignment_end_date = a.assignment_end_date && formatDate(a.assignment_end_date)
                                            let assignment_est_hours = a.assignment_est_hours || "Error Est Hours /"
                                            let assignment_final_hours = a.assignment_final_hours || "Error Final Hours /"
                                            return (
                                                <tr className={this.determineStatus(status_name)} key={assignment_id + assignment_name}>
                                                    <Table.Cell selectable><Link to={`/assignments/details/${assignment_id}`}>{assignment_name}</Link></Table.Cell>
                                                    <Table.Cell selectable><Link to={`/projects/details/${project_id}`}>{project_name}</Link></Table.Cell>
                                                    <Table.Cell>{status_name}</Table.Cell>
                                                    <Table.Cell>{assignment_start_date}</Table.Cell>
                                                    <Table.Cell>{assignment_end_date}</Table.Cell>
                                                    <Table.Cell>{assignment_est_hours}</Table.Cell>
                                                    <Table.Cell>{assignment_final_hours}</Table.Cell>
                                                    
                                                    <Table.Cell>
                                                    { showUpdate && 
                                                        <Link to={{
                                                            pathname: `/assignments/edit/${assignment_id}`,
                                                            state: {
                                                                assignment_name: assignment_name,
                                                                assignment_start_date: assignment_start_date,
                                                                assignment_end_date: assignment_end_date,
                                                                project_id: project_id,
                                                                status_id: status_id,
                                                                assignment_est_hours: assignment_est_hours,
                                                                assignment_final_hours: assignment_final_hours,
                                                                assignment_id: assignment_id
                                                            }
                                                        }}><Button secondary>Update</Button></Link> }
                                                        <Button color='red' onClick={() => this.props.deleteAssignment(assignment_id)}>Delete</Button>
                                                    </Table.Cell>
                                                </tr>
                                            );
                                        })}
                                    </Table.Body>
                                </Table>
                            </div>
                        {/* </LazyLoad> */}
                </div>
            );
    }
}

const mapStateToProps = ({ assignmentReducer }) => ({
    // assignments: assignmentReducer.assignments,
    // reversedAssignments: assignmentReducer.reversedAssignments
})

const mapDispatchToProps = dispatch => ({
    // getAllAssignments: () => dispatch(getAllAssignments()),
    
    deleteAssignment: id => dispatch(deleteAssignment(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentsTable);