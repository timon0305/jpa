import React, {Component} from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Fade,
  Collapse,
} from 'reactstrap';
import withLoadingAndNotification from "../../../components/HOC/withLoadingAndNotification";
// import storage from "../../../service/storage";


class ReservationLimit extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleLarge = this.toggleLarge.bind(this);


    this.state = {
      collapse: true,
      collapse_note: true,
      collapse_setting: true,
      fadeIn: true,
      fadeIn_note: true,
      fadeIn_setting: true,
      timeout: 300,
      timeout_note: 300,
      timeout_setting: 300,
      large: false
    };
  }

  toggle() {
    this.setState({collapse: !this.state.collapse});
  }

  togglenote() {
    this.setState({collapse_note: !this.state.collapse_note});
  }

  toggle_setting() {
    this.setState({collapse_setting: !this.state.collapse_setting});
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
    });
  }

  reset = () => {
    window.location.reload();
  }

  render() {

    return (
      <div className="animated fadeIn">
        <Label className="ml-1"><strong style={{fontSize: 30}}>Reservation Limit</strong></Label>
        <Row className="mt-3">
          <Col xs="12">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Card>
                <CardHeader>
                  <strong style={{fontSize: 20}}>System Reservation Limit Parameters</strong>
                  <div className="card-header-actions">
                    <a className="card-header-action btn btn-minimize" data-target="#collapseExample"
                       onClick={this.toggle.bind(this)}><i
                      className={this.state.collapse ? "icon-arrow-up" : "icon-arrow-down"}></i></a>
                  </div>
                </CardHeader>
                <Collapse isOpen={this.state.collapse} id="collapseExample">
                  <CardBody>
                    <Row>
                      <Col xs="4">
                        <Label htmlFor="working_numbers">% Working Numbers</Label>
                        <Row>
                          <Col xs="12" md="9">
                            <Input type="text" name="working_numbers" id="working_numbers" value="7.5"/>
                          </Col>
                          <Col xs="12" md="3">
                            <Label>or</Label>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs="5">
                        <Label htmlFor="total_reserved">Total Number Reserved</Label>
                        <Row>
                          <Col xs="12" md="9">
                            <Input type="text" name="total_reserved" id="total_reserved" value="2,000"/>
                          </Col>
                          <Col xs="12" md="3">
                            <Label>Not to Exceed</Label>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs="3">
                        <Label htmlFor="spare_numbers">% Spare Numbers</Label>
                        <Input type="text" name="spare_numbers" id="spare_numbers" value="3"/>
                      </Col>
                      <table style={{borderBottom: 1, borderBottomColor: 'black'}} className="table-bordered"/>
                    </Row>
                    <Row className="mt-5">
                      <Col xs="12" md="6">
                        <FormGroup row>
                          <Col md="5">
                            <Label htmlFor="pre_time">Pre Reservation Time (Mins) : </Label>
                          </Col>
                          <Col xs="12" md="7">
                            <Input type="number" id="pre_time" name="pre_time" autoComplete="text" value="1"/>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="5">
                            <Label htmlFor="allocation">Number Allocation :</Label>
                          </Col>
                          <Col xs="12" md="7">
                            <Input type="select" id="allocation" name="allocation" autoComplete="text">
                              <option>Off</option>
                            </Input>

                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="5">
                            <Label htmlFor="trasitional_time">Transitional to spare time (Central) :</Label>
                          </Col>
                          <Col xs="12" md="7">
                            <Input type="text" id="trasitional_time" name="trasitional_time" autoComplete="text" value="11:00 PM"/>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="5">
                            <Label htmlFor="last_updated">Last Data Updated :</Label>
                          </Col>
                          <Col xs="12" md="7">
                            <Input type="text" id="last_updated" name="last_updated" autoComplete="text" value="06/08/2018"/>
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col xs="12" md="6">
                        <FormGroup row>
                          <Col md="5">
                            <Label htmlFor="blocking">Enable Blocking : </Label>
                          </Col>
                          <Col xs="12" md="7">
                            <Input type="select" id="blocking" name="blocking" autoComplete="text">
                              <option>Yes</option>
                            </Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="5">
                            <Label htmlFor="reserved_time">Reserved to spare time (Central) : </Label>
                          </Col>
                          <Col xs="12" md="7">
                            <Input type="text" id="reserved_time" name="reserved_time" autoComplete="text" value="11:00 PM"/>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="5">
                            <Label htmlFor="updated_by">Updated By : </Label>
                          </Col>
                          <Col xs="12" md="7">
                            <Input type="text" id="updated_by" name="updated_by" autoComplete="text" value="XQ01000"/>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Collapse>
              </Card>
            </Fade>
          </Col>
          <Col xs="12">
            <Fade timeout={this.state.timeout_setting} in={this.state.fadeIn_setting}>
              <Card>
                <CardHeader>
                  <strong style={{fontSize: 20}}>Result</strong>
                  <div className="card-header-actions">
                    <a className="card-header-action btn btn-minimize" data-target="#collapseExample"
                       onClick={this.toggle_setting.bind(this)}><i
                      className={this.state.collapse_setting ? "icon-arrow-up" : "icon-arrow-down"}></i></a>
                  </div>
                </CardHeader>
                <Collapse isOpen={this.state.collapse_setting} id="collapseExample">
                  <CardBody>
                    <Label>Remaining Reservation Limit</Label>
                    <FormGroup row>
                      <Col xs="3">
                        <Row>
                          <Col xs="4">
                            <Label>Entity</Label>
                          </Col>
                          <Col xs="8">
                            <Input type="text" name="entity" id="entity" value="XQ"/>
                          </Col>
                        </Row>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col xs="4">
                        <Label htmlFor="max_limit">Max Reservation Limit</Label>
                        <Row>
                          <Col xs="12" md="11">
                            <Input type="text" name="max_limit" id="max_limit" value="2,000"/>
                          </Col>
                          <Col xs="12" md="1">
                            <Label><strong>-</strong></Label>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs="5">
                        <Label htmlFor="count_reserve">Count of Reserved Numbers</Label>
                        <Row>
                          <Col xs="12" md="11">
                            <Input type="text" name="count_reserve" id="count_reserve" value="35"/>
                          </Col>
                          <Col xs="12" md="1">
                            <Label><strong>=</strong></Label>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs="3">
                        <Label htmlFor="remain_reserve">Remaining Reservation</Label>
                        <Input type="text" name="remain_reserve" id="remain_reserve" value="1,965"/>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col xs="4">
                        <Label htmlFor="working_count">Working Number Count</Label>
                        <Input type="text" name="working_count" id="working_count" value="8,138"/>
                      </Col>
                      <Col xs="5">
                        <Label htmlFor="last_refresh">Last Refreshed</Label>
                        <Input type="text" name="last_refresh" id="last_refresh" value="11/19/2018 03:19 AM"/>
                      </Col>
                    </FormGroup>
                    <Button size="md" color="primary" onClick={this.reset}>Refresh</Button>
                  </CardBody>
                </Collapse>
              </Card>
            </Fade>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withLoadingAndNotification(ReservationLimit);
