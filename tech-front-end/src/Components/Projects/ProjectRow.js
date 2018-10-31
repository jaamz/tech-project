import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Modal } from 'semantic-ui-react';
import ProjectEdit from './ProjectEdit'
import { Link } from 'react-router-dom';
import { formatDate } from '../../util/DateHelper'


class ProjectRow extends Component {
    state={
        projectModal: false
    }

    closeProjectModal = () => {
        this.setState({
            projectModal: false
        })
    ;}

    onUpdateProjectModal = async (model) =>{
        model = {...model, project_id: this.props.project_id }
        await this.props.updateProject(model);
        this.closeProjectModal();
      }

    render() {
        let project_id = this.props.projects.project_id || "i";
        let project_name = this.props.projects.project_name;
        let project_start_date = this.props.projects.project_start_date;
        let project_end_date = this.props.projects.project_end_date;
        
        return (
            <Table.Row key={project_id + project_name}>
            <Table.Cell selectable><Link to={`/projects/details/${project_id}`}>{project_name}</Link></Table.Cell>
            <Table.Cell>{project_start_date && formatDate(project_start_date)}</Table.Cell>
            <Table.Cell>{project_end_date && formatDate(project_end_date)}</Table.Cell>
            <Table.Cell>
                <Modal
                    onClose={this.closeProjectModal}
                    open={this.state.projectModal}
                    trigger={<Button color="black" onClick={() => { this.setState({ projectModal: true }) }}>Update</Button>} closeIcon>
                    <Modal.Header>Update Project</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <ProjectEdit onSubmit={this.onUpdateProjectModal}
                                project_id = {project_id}
                                project_name = {project_name}
                                project_start_date ={project_start_date}
                                project_end_date ={project_end_date}
                            />

                        </Modal.Description>
                    </Modal.Content>
                </Modal>
                <Button color='red' onClick={() => this.props.deleteProject(project_id)}>Delete</Button>
            </Table.Cell>
        </Table.Row>
        );
    }
}

ProjectRow.propTypes = {

};

export default ProjectRow;