import React from 'react';
import {Card, CardBody, Col, Row, Label, Input, Button, InputGroup} from 'reactstrap';
import withLoadingAndNotification from "../../components/HOC/withLoadingAndNotification";
import {cardHeader} from '../../components/Card/CollapsibleCardHeader'
import RestApi from "../../service/RestApi";
import FormGroup from "reactstrap/es/FormGroup";
import CardFooter from "reactstrap/es/CardFooter";
import CardHeader from "reactstrap/es/CardHeader";
import FormFeedback from "reactstrap/es/FormFeedback";
import {Type} from "../../constants/Notifications";


const Header = cardHeader(true, false);
class CDRImport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [], delimiter: 'comma', file: '', filename: '', columns: new Array(20), header: false, name: '', isName: false,
      row_ani: "NONE", cost: "NONE", rate: "NONE", duration: "NONE", lrn: "NONE", insert_type: 'overwrite', duration_unit: "", isUnit: false
    };
  }

  componentDidMount() {
    let newCol = [];
    for (let i = 1; i <= this.state.columns.length; i++) {
      newCol.push("Column " + i);
    }
    this.setState({columns: newCol})
  }

  parse_cdr = () => {
    if (this.state.file === "") {this.props.showNotification(Type.WARNING, "Please import file!"); return false;}
    // if (this.state.name === "") {this.setState({isName: true}); return false;}
    let data = {
      filename: this.state.filename,
      delimiter: this.state.delimiter,
      insertType: this.state.insert_type,
      hasColumnHeader: this.state.header,
      // name: this.state.name
    };
    if (this.state.row_ani && this.state.row_ani.trim() !== "NONE") {data.row_ani = this.state.row_ani;}
    if (this.state.duration && this.state.duration.trim() !== "NONE"){
      if (this.state.duration_unit !== "") {
        data.duration = this.state.duration;
        data.durationUnit = this.state.duration_unit;
      } else {
        this.setState({isUnit: true});
        return false;
      }
    }
    if (this.state.cost && this.state.cost.trim() !== "NONE") {data.cost = this.state.cost;}
    if (this.state.rate && this.state.rate.trim() !== "NONE") {data.rate = this.state.rate;}
    if (this.state.lrn && this.state.lrn.trim() !== "NONE") {data.lrn = this.state.lrn;}

    this.props.callApi(RestApi.insertCDR, response => {}, data)
  };

  handle = (file) => {
    this.setState({
      file: file,
      row_ani: 'NONE', rate: 'NONE', cost: 'NONE', duration: 'NONE', duration_unit: '', lrn: 'NONE', name: ''
    });
    let data = new FormData();
    data.append("file", file);
    data.append("delimiter", this.state.delimiter);
    this.props.callApi(RestApi.uploadCDR, response => {
      console.log(response);
      if (response.ok) {
        this.setState({
          filename: response.data.filename,
        });
        let newCol = [];
        let data = response.data.columns;
        for (let i = 1; i <= this.state.columns.length; i++) {
          let prefix = data[i-1] !== "" ? "-" + data[i-1] : "";
          newCol.push("Column " + i + prefix);
        }
        this.setState({columns: newCol})
      }
    }, data)
  };

  handleChange = (ev) => {
    let state = {};
    state[ev.target.name] = ev.target.value;
    this.setState(state);
    this.setState({isUnit: false, isName: false})
  };

  render() {
    return (
      <Row>
        <Col xs="12">
          <Card>
            <Header>CDR Import</Header>
            <CardBody>
              <FormGroup row>
                <Label className="col-2">Select CDR List File:</Label>
                <Input type="file" name="selectFile" className="col-9" onChange={(ev) => this.handle(ev.target.files[0])} accept='.csv'/>
              </FormGroup>
              <FormGroup row>
                <Col lg="3" className="row">
                  <Label className="col-6">Column Delimeter:</Label>
                  <Input type="select" name="delimeter" className="col-6 form-control-sm" onChange={this.handleChange}>
                    <option value="comma">"( , )" -- Comma</option>
                    <option value="pipe">"( | )" -- Pipe</option>
                    <option value="tab">"( \t )" -- Tab</option>
                    <option value="semicolon">"( ; )" -- Semicolon</option>
                  </Input>
                </Col>
                <Col lg="1"/>
                <Col lg="3" className="row">
                  <Label className="col-6">Import Type:</Label>
                  <Input type="select" name="insert_type" className="col-6 form-control-sm" onChange={this.handleChange}>
                    <option value="overwrite">Overwrite</option>
                    <option value="append">Append</option>
                  </Input>
                </Col>
                <Col lg="1"/>
                <Col lg="4" className="row">
                  <Label className="col-6"> Has Column Header:<Input type="checkbox" name="header" onChange={(ev) => {this.setState({header: ev.target.checked})}} className="ml-5"/></Label>
                </Col>
              </FormGroup>
              <Card>
                <CardHeader>
                  <strong>Select Column Index</strong>
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    {/*<Col lg="4" className="row text-right">*/}
                      {/*<Col lg="5">*/}
                        {/*<Label className="mt-4">CDR Name:</Label>*/}
                      {/*</Col>*/}
                      {/*<Col lg="7">*/}
                        {/*<Input type="text" name="name" className="form-control-sm mt-4" onChange={this.handleChange} value={this.state.name} invalid={this.state.isName}/>*/}
                        {/*{this.state.isName && <FormFeedback className="text-left">Please input CDR name!</FormFeedback>}*/}
                      {/*</Col>*/}
                    {/*</Col>*/}
                    {this.renderIndex("Row ANI:", 'row_ani', this.state.row_ani)}
                    {this.renderIndex("Rate:", 'rate', this.state.rate)}
                    {this.renderIndex("Cost:", 'cost', this.state.cost)}
                    {this.renderIndex("Lrn:", 'lrn', this.state.lrn)}
                    <Col lg="4" className="row text-right">
                      <Col lg="5"><Label className="mt-4">Duration:</Label></Col>
                      <InputGroup className="col-lg-7 mt-4">
                        <Input type="select" name="duration" className="form-control-sm mr-1" onChange={this.handleChange} value={this.state.duration}>
                          <option value="NONE">NONE</option>
                          {this.state.columns.map((i, d) => (
                            <option value={d}>{i}</option>
                          ))}
                        </Input>
                        <Label>And</Label>
                        <Input type="select" name="duration_unit" className="form-control-sm ml-1" onChange={this.handleChange} invalid={this.state.isUnit} value={this.state.duration_unit}>
                          <option value=""/>
                          <option value="minute">Minute</option>
                          <option value="second">Second</option>
                        </Input>
                        {this.state.isUnit && <FormFeedback>Please select duration unit!</FormFeedback>}
                      </InputGroup>
                    </Col>
                  </FormGroup>
                </CardBody>
              </Card>
            </CardBody>
            <CardFooter className="text-right">
              <Button size="md" color="primary" className="text-white font-weight-bold" onClick={this.parse_cdr}>IMPORT</Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    );
  }

  renderIndex = (title, name, value) => {
    return <Col lg="4" className="row text-right">
      <Col lg="5">
        <Label className="mt-4">{title}</Label>
      </Col>
      <Col lg="7">
        <Input type="select" name={name} className="form-control-sm mt-4" onChange={this.handleChange} value={value}>
          <option value="NONE">NONE</option>
          {this.state.columns.map((i, d) => {return <option value={d}>{i}</option>})}
        </Input>
      </Col>
    </Col>
  }
}

export default withLoadingAndNotification(CDRImport);
