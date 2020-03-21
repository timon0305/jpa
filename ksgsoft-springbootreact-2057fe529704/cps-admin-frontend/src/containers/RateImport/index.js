import React from 'react';
import {Card, CardBody, Col, Row, Label, Input, Button, FormFeedback} from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import withLoadingAndNotification from "../../components/HOC/withLoadingAndNotification";
import {cardHeader} from '../../components/Card/CollapsibleCardHeader'
import RestApi from "../../service/RestApi";
import FormGroup from "reactstrap/es/FormGroup";
import CardFooter from "reactstrap/es/CardFooter";
import CardHeader from "reactstrap/es/CardHeader";
import InputGroup from "reactstrap/es/InputGroup";

const Header = cardHeader(true, false);
class RateImport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [], delimiter: 'comma', file: '', filename: '', carriers: [],
      columns: new Array(20), header: false,
      ocn: null, lata: null, npa: null, nxx: null, npanxx: null, init_duration: "", increment_duration: "", inter_rate: null, intra_rate: null,
      insert_type: 'update', eff_date: new Date(), validName: false, validCarrier: false, name: null, carrier_name: "", isCode: false, code: 1
    };
  }

  componentDidMount() {
    let newCol = [];
    for (let i = 1; i <= this.state.columns.length; i++) {
      newCol.push("Column " + i);
    }
    this.setState({columns: newCol});
    // Get carriers
    this.props.callApi(RestApi.getRateDeckList, response => {
      console.log(response);
      if (response.ok) {
        let carriers = [];
        for (let i = 0; i< response.data.length; i++) {
          if (carriers.indexOf(response.data[i].carrier)===-1) {
            carriers.push(response.data[i].carrier);
          }
        }
        this.setState({carriers})
      }
    })
  }

  parse_rate = () => {
    if (this.state.name === null) {this.setState({validName: true}); return false;}
    else if (this.state.carrier_name === "") {this.setState({validCarrier: true}); return false;}

    let data = {
      filename: this.state.filename,
      delimiter: this.state.delimiter,
      // insertType: this.state.insert_type,
      hasColumnHeader: this.state.header,
      rate_name: this.state.name,
      carrier_name: this.state.carrier_name,
      init_duration: this.state.init_duration,
      increment_duration: this.state.increment_duration,
      eff_date: this.state.eff_date.toLocaleDateString("en-US")
    };
    if (this.state.npa && this.state.npa.trim() !== "NONE") {data.npa = this.state.npa;}
    if (this.state.nxx && this.state.nxx.trim() !== "NONE") {data.nxx = this.state.nxx;}
    if (this.state.npanxx && this.state.npanxx.trim() !== "NONE") {data.npanxx = this.state.npanxx;}
    if (this.state.lata && this.state.lata.trim() !== "NONE") {data.lata = this.state.lata;}
    if (this.state.ocn && this.state.ocn.trim() !== "NONE") {data.ocn = this.state.ocn;}
    if (this.state.inter_rate && this.state.inter_rate.trim() !== "NONE") {data.inter_rate = this.state.inter_rate;}
    if (this.state.intra_rate && this.state.intra_rate.trim() !== "NONE") {data.intra_rate = this.state.intra_rate;}
    this.props.callApi(RestApi.insertRate, response => {}, data)
  };

  // view_import = () => {
  //   this.props.navigate("/cprgen/view_rate");
  // };

  handle = (file) => {
    this.setState({file: file});
    let data = new FormData();
    data.append("file", file);
    data.append("delimiter", this.state.delimiter);
    this.props.callApi(RestApi.uploadRate, response => {
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
    this.setState({validName: false, validCarrier: false})
  };

  handleDate = (date) => {this.setState({eff_date: date});};

  render() {
    return (
      <Row>
        <Col xs="12">
          <Card>
            <Header>Import Rate Decks</Header>
            <CardBody>
              <FormGroup row>
                <Label className="col-2">Select Rate List File:</Label>
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
                {/*<Col lg="1"/>*/}
                {/*<Col lg="3" className="row">*/}
                  {/*<Label className="col-6">Import Type:</Label>*/}
                  {/*<Input type="select" name="insert_type" className="col-6 form-control-sm" onChange={this.handleChange}>*/}
                    {/*<option value="update">Update</option>*/}
                    {/*<option value="overwrite">Overwrite</option>*/}
                  {/*</Input>*/}
                {/*</Col>*/}
                <Col lg="1"/>
                <Col lg="4" className="row">
                  <Label className="col-6"> Has Column Header:<Input type="checkbox" name="header" onChange={(ev) => {this.setState({header: ev.target.checked})}} className="ml-5"/></Label>
                </Col>
              </FormGroup>
              <Card>
                <CardHeader>
                  <strong>Column Information</strong>
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col lg="4" className="row text-right">
                      <Col lg="5"><Label className="mt-4">Rate Name:</Label></Col>
                      <Col lg="7">
                        <Input type="text" name="name" className="form-control-sm mt-4" onChange={this.handleChange} invalid={this.state.validName}/>
                        {this.state.validName ? <FormFeedback className="text-left">Please input Rate Name!</FormFeedback> : ""}

                      </Col>
                    </Col>
                    <Col lg="4" className="row text-right">
                      <Col lg="5"><Label className="mt-4">Carrier Name:</Label></Col>
                      <InputGroup className="col-lg-7 mt-4">
                        <Input type="select" name="carrier_name" className="form-control-sm mr-1" onChange={this.handleChange}>
                          <option value=""/>
                          {this.state.carriers.map(value => (
                            <option value={value}>{value}</option>
                          ))}
                        </Input>
                        <Label>Or</Label>
                        <Input type="text" name="carrier_name" className="form-control-sm ml-1" onChange={this.handleChange} invalid={this.state.validCarrier}/>
                        {this.state.validCarrier ? <FormFeedback className="text-left">Please select or input Carrier Name!</FormFeedback> : ""}
                      </InputGroup>
                    </Col>
                    <Col lg="4"/>
                    {this.renderIndex("LATA:", 'lata')}
                    {this.renderIndex("NPA:", 'npa')}
                    {this.renderIndex("NXX:", 'nxx')}
                    {this.renderIndex("OCN:", 'ocn')}
                    {this.renderIndex("NPANXX:", 'npanxx')}
                    {this.renderIndex("Interstate rate:", 'inter_rate')}
                    {this.renderIndex("Intrastate rate:", 'intra_rate')}
                    <Col lg="4" className="row text-right">
                      <Col lg="5">
                        <Label className="mt-4">Init Duration:</Label>
                      </Col>
                      <Col lg="7">
                        <Input type="text" name="init_duration" className="form-control-sm mt-4" onChange={this.handleChange}/>
                      </Col>
                    </Col>
                    <Col lg="4" className="row text-right">
                      <Col lg="5">
                        <Label className="mt-4">Increment Duration:</Label>
                      </Col>
                      <Col lg="7">
                        <Input type="text" name="increment_duration" className="form-control-sm mt-4" onChange={this.handleChange}/>
                      </Col>
                    </Col>
                    <Col lg="4" className="row text-right">
                      <Col lg="5"><Label className="mt-4">Effective Date:</Label></Col>
                      <Col lg="7">
                        <DatePicker
                          selected={this.state.eff_date}
                          onChange={this.handleDate}
                          className="form-control-sm mt-4"
                        />
                      </Col>
                    </Col>
                  </FormGroup>
                </CardBody>
              </Card>
            </CardBody>
            <CardFooter className="text-right">
              <Button size="md" color="primary" className="text-white font-weight-bold" onClick={this.parse_rate}>IMPORT</Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    );
  }

  renderIndex = (title, name) => {
    return <Col lg="4" className="row text-right">
      <Col lg="5">
        <Label className="mt-4">{title}</Label>
      </Col>
      <Col lg="7">
        <Input type="select" name={name} className="form-control-sm mt-4" onChange={this.handleChange}>
          <option value={null}>NONE</option>
          {this.state.columns.map((i, d) => {return <option value={d}>{i}</option>})}
        </Input>
      </Col>
    </Col>
  }
}

export default withLoadingAndNotification(RateImport);
