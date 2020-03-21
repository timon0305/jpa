import React, {Component} from 'react'
import {Col, Input, Label, Modal, ModalHeader, Row} from "reactstrap";
import PropTypes from "prop-types";
import ModalBody from "reactstrap/es/ModalBody";
import ReactTable from 'react-table'
import '../../scss/react-table.css'
import FormFeedback from "./index";

class ViewCPRModal extends Component {
  static propTypes = {
    data: PropTypes.object,
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    columns: PropTypes.arrayOf(PropTypes.object),
    fetchData: PropTypes.func,
    total_page: PropTypes.number,
    handler: PropTypes.func,
    totalCost: PropTypes.string,
    averageRate: PropTypes.string,
    defaultCarrier: PropTypes.string,
    defaultCarrierNpaNxx: PropTypes.string,

    ...Modal.propTypes,
  };

  static defaultProps = {
    isEditable: true
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal className="modal-xl" isOpen={this.props.isOpen}>
        <ModalHeader toggle={this.props.toggle}>View CPR Report</ModalHeader>
        <ModalBody>
          <Row>
            <Col lg="12" className="row mb-2">
              <Col lg="6" className="row">
                <Col lg="6" className="text-right">
                  <Label className="font-weight-bold">Total Cost:</Label>
                </Col>
                <Col lg="6">
                  <Input type="text" className="form-control-sm" value={this.props.totalCost && this.props.totalCost.toFixed(3)}/>
                </Col>
              </Col>
              <Col lg="6" className="row">
                <Col lg="6" className="text-right">
                  <Label className="font-weight-bold">Average Rate:</Label>
                </Col>
                <Col lg="6">
                  <Input type="text" className="form-control-sm" value={this.props.averageRate && this.props.averageRate.toFixed(5)}/>
                </Col>
              </Col>
              <Col lg="6" className="row mt-1">
                <Col lg="6" className="text-right">
                  <Label className="font-weight-bold">Default Carrier:</Label>
                </Col>
                <Col lg="6">
                  <Input type="text" className="form-control-sm" value={this.props.defaultCarrier && this.props.defaultCarrier}/>
                </Col>
              </Col>
              <Col lg="6" className="row mt-1">
                <Col lg="6" className="text-right">
                  <Label className="font-weight-bold">Default Carrier NPANXX:</Label>
                </Col>
                <Col lg="6">
                  <Input type="text" className="form-control-sm" value={this.props.defaultCarrier && this.props.defaultCarrierNpaNxx}/>
                </Col>
              </Col>
            </Col>
            <Col lg="12">
              <ReactTable
                manual
                data={this.props.data}
                columns={this.props.columns}
                defaultPageSize={10}
                onFilteredChange={(filter) => {
                  let filters = [];
                  filters.push(filter);
                  this.handleChange("filter", filters)
                }}
                onSortedChange={(sort) => {
                  let sorts = [];
                  sorts.push(sort);
                  this.handleChange("sort", sorts);
                }}
                onPageChange={(page) => {
                  this.handleChange("page", page);
                }}
                onPageSizeChange={(pageSize) => {
                  this.handleChange("pageSize", pageSize)
                }}
                minRows={this.props.data.length && this.props.data.length}
                pages={this.props.total_page}
                onFetchData={this.props.fetchData}
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    );
  }

  handleChange = (type, value) => {
    this.props.handler(type, value);
  }
}

export default ViewCPRModal
