import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row
} from "reactstrap";
import {AdminPrivileges, DisplayNames, NMSPrivileges} from "../../constants/Privileges";
import {AppSwitch} from "@coreui/react";
import mutate from "immer";
import {cardHeader} from "../../components/Card/CollapsibleCardHeader";
import ModalFormFooter from "../../components/Card/ModalFormFooter";
import {connect} from 'react-redux';

const Header = cardHeader(false, true);

class RoleEditModal extends React.Component {
  static propTypes = {
    role: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      description: PropTypes.string,
      privileges:PropTypes.arrayOf(PropTypes.string)
    }),
    isEditable:PropTypes.bool,
    updateHandler:PropTypes.func,
    handleRoleUpdate:PropTypes.func,
    resetHandler:PropTypes.func,
    ...Modal.propTypes,
  };

  static defaultProps = {
    isEditable: false
  };

  constructor(props) {
    super(props);
    this.state = {isNMSVisible: true, isAdminVisible:true}
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    // Update privilege panel hidden
    if (prevProps.isOpen !== this.props.isOpen && this.props.isOpen) {
      this.setState({
        isAdminVisible: true,
        isNMSVisible: true
      })
    }
  }

  render() {
    return (
      <Modal className="modal-lg" isOpen={this.props.isOpen}>
        {/*Close Button*/}
        <ModalHeader toggle={this.props.toggle}>{this.props.isEditable ? (this.props.role.id ? "Edit Role" : "Create a new Role") : "View Role"}</ModalHeader>
        <ModalBody /**style={{overflow:'scroll', maxHeight:300}}**/>
          <Card>
            <CardHeader>
              <strong>Main</strong>
            </CardHeader>
            <CardBody>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="name"><strong>Role Name: </strong></Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" name="name" autoComplete="text" value={this.props.role.name} onChange={this.handleNameChange} disabled={!this.props.isEditable}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="description"><strong>Description: </strong></Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" name="description" autoComplete="text" value={this.props.role.description} onChange={this.handleDescriptionChange} disabled={!this.props.isEditable}/>
                </Col>
              </FormGroup>
            </CardBody>
          </Card>
          {/*Admin Privileges*/}
          <Card>
            <Header isOpen={this.state.isAdminVisible} toggle={() => this.setState({isAdminVisible: !this.state.isAdminVisible})}>Admin Privileges</Header>
            <Collapse isOpen={this.state.isAdminVisible} >
              <CardBody>
                <Form>
                  <Row>{AdminPrivileges.map(this.renderPrivilege)}</Row>
                </Form>
              </CardBody>
            </Collapse>
          </Card>

          {/*Somos Privileges*/}
          <Card>
            <Header isOpen={this.state.isNMSVisible} toggle={() => this.setState({isNMSVisible: !this.state.isNMSVisible})}>NMS Privileges</Header>
            <Collapse isOpen={this.state.isNMSVisible} >
              <CardBody>
                <Form>
                  <Row>{NMSPrivileges.map(this.renderPrivilege)}</Row>
                </Form>
              </CardBody>
            </Collapse>
          </Card>
        </ModalBody>
        {this.props.isEditable && <ModalFormFooter updateHandler={this.updateRole} resetHandler={this.props.resetHandler} updateTitle={this.props.role.id ? 'Update' : 'Add'}/>}
      </Modal>
    )
  }

  renderPrivilege = (privilege) => {
    const privilegeDisabled = !this.props.availablePrivileges.includes(privilege);
    const id = "switch_" + privilege;
    return (
      <Col sm="6" key={"role" + id}>
        <FormGroup row>
          <Col xs="9">
            <Label htmlFor={id} style={privilegeDisabled || !this.props.isEditable ? {color:'gray'} : {}}>{DisplayNames[privilege]}</Label>
          </Col>
          <Col xs="3" className="text-right">
            <AppSwitch variant={'3d'} outline={'alt'} color={'primary'}
                       checked={this.props.role.privileges.includes(privilege)}
                       name={id} disabled={!this.props.isEditable || privilegeDisabled}
                       onClick={() => this.togglePrivilege(privilege)}
            />
          </Col>
        </FormGroup>
      </Col>
    )
  };

  togglePrivilege = (privilege) => {
    const newRole = mutate(this.props.role, (r) => {
      const index = r.privileges.indexOf(privilege);
      if (index === -1){
        r.privileges.push(privilege);
      } else {
        r.privileges.splice(index, 1);
      }
    });
    this.props.handleRoleUpdate(newRole);
  };

  handleNameChange = (evt) => {
    const newRole = mutate(this.props.role, r => {
      r.name = evt.target.value;
    });
    this.props.handleRoleUpdate(newRole);
  };

  handleDescriptionChange = (evt) => {
    const newRole = mutate(this.props.role, r => {
      r.description = evt.target.value;
    });
    this.props.handleRoleUpdate(newRole);
  };

  updateRole = () => {
    this.props.updateHandler(this.props.role.id);
  }
}

export default connect(state => ({
  availablePrivileges:state.auth.privileges
})
)(RoleEditModal);
