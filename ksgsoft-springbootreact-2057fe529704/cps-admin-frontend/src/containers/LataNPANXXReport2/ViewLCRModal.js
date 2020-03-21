import React, {Component} from 'react'
import {Col, Modal, ModalHeader, Row} from "reactstrap";
import PropTypes from "prop-types";
import ModalBody from "reactstrap/es/ModalBody";
import ReactTable from 'react-table'
import '../../scss/react-table.css'

class ViewLCRModal extends Component {
  static propTypes = {
    data: PropTypes.object,
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    columns: PropTypes.arrayOf(PropTypes.object),
    fetchData: PropTypes.func,
    total_page: PropTypes.number,
    handler: PropTypes.func,
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
        <ModalHeader toggle={this.props.toggle}>View LCR Report</ModalHeader>
        <ModalBody>
          <Row>
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

export default ViewLCRModal
