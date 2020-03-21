import React from 'react';
import {Card, CardBody, Col, Row, Label, Input, Button, FormFeedback} from 'reactstrap';
import withLoadingAndNotification from "../../components/HOC/withLoadingAndNotification";
import {cardHeader} from '../../components/Card/CollapsibleCardHeader'
import RestApi from "../../service/RestApi";
import FormGroup from "reactstrap/es/FormGroup";
import CardFooter from "reactstrap/es/CardFooter";
import CardHeader from "reactstrap/es/CardHeader";

const Header = cardHeader(true, false);
class LergImport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [], delimiter: 'comma', file: '', filename: '',
      columns: new Array(20), header: false,
      state: "0", lata: "0", npa: "0", nxx: "0", x: "0", carrier: "0", acna: "0", cic: "0", insert_type: 'overwrite',
      valid_state: false, valid_lata: false, valid_npa: false, valid_nxx: false, valid_x: false, valid_carrier: false,
      valid_anca: false, valid_cic: false
    };
  }

  componentDidMount() {
    let newCol = [];
    for (let i = 1; i <= this.state.columns.length; i++) {
      newCol.push("Column " + i);
    }
    this.setState({columns: newCol})
  }

  parse_lerg = () => {
    if (this.state.state === null) {this.setState({valid_state: true}); return false;}
    else if (this.state.lata === null) {this.setState({valid_lata: true}); return false;}
    else if (this.state.npa === null) {this.setState({valid_npa: true}); return false;}
    else if (this.state.nxx === null) {this.setState({valid_nxx: true}); return false;}
    else if (this.state.x === null) {this.setState({valid_x: true}); return false;}
    else if (this.state.carrier === null) {this.setState({valid_carrier: true}); return false;}
    else if (this.state.acna === null) {this.setState({valid_acna: true}); return false;}
    else if (this.state.cic === null) {this.setState({valid_cic: true}); return false;}

    let data = {
      filename: this.state.filename,
      delimiter: this.state.delimiter,
      insertType: this.state.insert_type,
      hasColumnHeader: this.state.header,
      state: parseInt(this.state.state),
      lata: parseInt(this.state.lata),
      npa: parseInt(this.state.npa),
      nxx: parseInt(this.state.nxx),
      x: parseInt(this.state.x),
      carrier: parseInt(this.state.carrier),
      acna: parseInt(this.state.acna),
      cic: parseInt(this.state.cic),
    };
    this.props.callApi(RestApi.insertLerg, response => {}, data)
  };

  view_import = () => {
    this.props.navigate("/cprgen/view_lerg");
  };

  export_lerg = () => {

  };

  handle = (file) => {
    this.setState({file: file});
    let data = new FormData();
    data.append("file", file);
    data.append("delimiter", this.state.delimiter);
    this.props.callApi(RestApi.uploadLerg, response => {
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
    this.setState({
      valid_state: false, valid_lata: false, valid_npa: false, valid_nxx: false,
      valid_x: false, valid_carrier: false, valid_acna: false, valid_cic: false
    })
  };

  render() {
    return (
      <Row>
        <Col xs="12">
          <Card>
            <Header>Import RGLE</Header>
            <CardBody>
              <FormGroup row>
                <Label className="col-2">Select Lerg List File:</Label>
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
                    {this.renderIndex("State:", 'state', this.state.valid_state)}
                    {this.renderIndex("LATA:", 'lata', this.state.valid_lata)}
                    {this.renderIndex("NPA:", 'npa', this.state.valid_npa)}
                    {this.renderIndex("NXX:", 'nxx', this.state.valid_nxx)}
                    {this.renderIndex("X:", 'x', this.state.valid_x)}
                    {this.renderIndex("Carrier:", 'carrier', this.state.valid_carrier)}
                    {this.renderIndex("ACNA:", 'acna', this.state.valid_acna)}
                    {this.renderIndex("CIC:", 'cic', this.state.valid_cic)}
                  </FormGroup>
                </CardBody>
              </Card>
            </CardBody>
            <CardFooter className="text-right">
              <Button size="md" color="primary" className="text-white font-weight-bold" onClick={this.parse_lerg}>IMPORT</Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    );
  }

  renderIndex = (title, name, valid) => {
    return <Col lg="2" className="row text-right">
      <Col lg="5">
        <Label className="mt-4">{title}</Label>
      </Col>
      <Col lg="7">
        <Input type="select" name={name} className="form-control-sm mt-4" onChange={this.handleChange} invalid={valid}>
          {this.state.columns.map((i, d) => {return <option value={d}>{i}</option>})}
        </Input>
        {valid ? <FormFeedback className="text-left">Please input {name}!</FormFeedback> : ""}
      </Col>
    </Col>
  }
}

export default withLoadingAndNotification(LergImport);
