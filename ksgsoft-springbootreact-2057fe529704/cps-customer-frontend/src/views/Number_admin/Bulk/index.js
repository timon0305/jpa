import React, {Component} from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import ReactTable from 'react-table'
import '../../../scss/react-table.css'
import withLoadingAndNotification from "../../../components/HOC/withLoadingAndNotification";


class Bulk extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleLarge = this.toggleLarge.bind(this);


    this.state = {
      tooltipOpen: [false, false],
      collapse: true,
      collapse_setting: true,
      fadeIn: true,
      fadeIn_setting: true,
      timeout: 300,
      timeout_setting: 300,
    };
  }

  toggle() {
    this.setState({collapse: !this.state.collapse});
  }


  toggleLarge() {
    this.setState({
      large: !this.state.large,
    });
  }

  render() {
    const data = [{
      request_id: 'R73426',
      creation_date: '2018-02-07',
      completion_date: '2018-02-07',
      user_id: 'ZXS01RJK',
      status: 'COMPLETED',
    }];
    const columns = [
      {
        Header: 'Request ID',
        accessor: 'request_id'
      },
      {
        Header: 'Creation Date',
        accessor: 'creation_date',
      },
      {
        Header: 'Completion Date',
        accessor: 'completion_date'
      },
      {
        Header: 'User ID',
        accessor: 'user_id'
      },
      {
        Header: 'Status',
        accessor: 'status'
      },
    ];
    return (
      <div className="animated fadeIn">
        <Label className="ml-1"><strong style={{fontSize: 30}}>Bulk Requests Lists</strong></Label>
        <FormGroup row>
          <Col xs="12">
            <Row className="bs-wizard" style={{borderBottom:0}}>
              <Col xs="6" className="bs-wizard-step complete">
                <div className="text-center bs-wizard-stepnum">Search</div>
                <div className="progress">
                  <div className="progress-bar"/>
                </div>
                <a href="#" className="bs-wizard-dot"/>
              </Col>
              <Col xs="6" className="bs-wizard-step complete">
                <div className="text-center bs-wizard-stepnum">Results</div>
                <div className="progress">
                  <div className="progress-bar"/>
                </div>
                <a href="#" className="bs-wizard-dot"/>
              </Col>
            </Row>
          </Col>
        </FormGroup>
        <Row className="mt-3">
          <Col xs="12">
            <Card>
              <CardBody>
                <FormGroup row>
                  <Col xs="3">
                    <Input type="text" name="search" id="search" placeholder="Search"/>
                  </Col>
                  <Col xs="9" className="text-right">
                    <Button size="lg" color="link"><i className="fa fa-trash" style={{fontSize: 30}}/></Button>
                    <Button size="lg" color="link"><i className="fa fa-download" style={{fontSize: 30}}/></Button>
                    <Button size="lg" color="link"><i className="fa fa-print" style={{fontSize: 30}}/></Button>
                  </Col>
                </FormGroup>
                <ReactTable data={data} columns={columns}/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withLoadingAndNotification(Bulk);
