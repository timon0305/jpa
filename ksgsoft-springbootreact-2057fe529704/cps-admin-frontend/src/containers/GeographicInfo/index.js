import React, {Component} from 'react';
import {Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row,} from 'reactstrap';

import withLoadingAndNotification from "../../components/HOC/withLoadingAndNotification";

class GeographicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    return (
      <div className="animated fadeIn" style={{height: '100%'}}>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <strong className="card-title-big">Geographic Information</strong>
              </CardHeader>
              <CardBody>
                <Row>
                  {this.renderInput("state", "State:", "select")}
                  {this.renderInput("npa", "NPA:", "select")}
                  {this.renderInput("npanxx", "NPANXX:", "number")}
                  {this.renderInput("lata", "LATA:", "select")}
                </Row>
                <div className="text-right mt-3">
                  <Button type="reset" size="md" color="danger" className="mr-2"><i className="fa fa-refresh"/> Reset</Button>
                  <Button type="submit" size="md" color="primary"><i className="fa fa-search"/> Find</Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  renderInput = (name, title, type) => {
    return <Col xs="12" md="3">
      <FormGroup row>
        <Col md="3" className="text-right">
          <Label htmlFor={name}>{title}</Label>
        </Col>
        <Col xs="12" md="7">
          <Input type={type} name={name} className="form-control-sm">
            {/*{type === "select" && <option/>}*/}
          </Input>
        </Col>
      </FormGroup>
    </Col>
  }
}

export default withLoadingAndNotification(GeographicInfo);
