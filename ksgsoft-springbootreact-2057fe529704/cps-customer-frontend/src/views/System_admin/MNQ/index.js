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
  CardFooter,
} from 'reactstrap';
import {
  fix_num,
  multi_query,
  timeout,
  verb
} from "../../../service/numberSearch";
import {connect} from 'react-redux'
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import "react-toastify/dist/ReactToastify.css";
import 'react-overlay-loader/styles.css';
import {error_mnq_message} from "../../../service/error_message";
import withLoadingAndNotification from "../../../components/HOC/withLoadingAndNotification";
import RestApi from "../../../service/RestApi";
const MgiMessage = require('../../../MgiMessage/MgiMessage').MgiMessage;

class MNQ extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nums: "",
      desc: '',
      mail: '',
      message: '',
      loading: false,
      datas: [],
      display: false
    };
  }

  handleChange = (event) => {
    const state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  };

  submit = async () => {
    this.setState({display: false});
    if (this.state.nums === "") {
      this.setState({message: "Please input Numbers."});
      return false;
    }
    if (this.state.ro === "") {
      this.setState({message: "Please input Resp Org"});
      return false;
    }
    let message = multi_query(this.props.somos.id, this.props.somos.ro, fix_num(this.state.nums));
    console.log(message);
    this.setState({loading: true});
    let res = await this.props.callApi2(RestApi.sendRequestNew, {'mod': 'MNQ', 'message': message, 'timeout': timeout});
    console.log(res.data.message);
    if (res.ok && res.data && res.data.message) {
      const message = new MgiMessage(res.data.message);
      let values = message.value(["NUM", "LACT", "RU", "DU", "SE", "STAT", "CRO", "CTEL", "NCON", "NOTES"]);
      console.log(values);
      let errors = message.value(["ERRV"]);
      let err_message = "";
      if (errors && errors.length) {
        for (let i = 0; i < errors.length; i++) {
          let error = errors[i].ERRV.split(",");
          err_message += error[2] + ":  " + error_mnq_message(error[0]) + "\n";
        }
        this.setState({message: err_message});
        return false;
      }
      this.setState({display: true});
      this.setState({datas: values})
    }
  };

  clear = () => {
    this.setState({
      message: '',
      ro: '',
      nums: '',
      desc: '',
      mail: '',
      display: false
    })
  };

  columns = [
    {
      Header: 'Number',
      accessor: 'NUM',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Resp Org',
      accessor: 'CRO',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Status',
      accessor: 'STAT',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Last Active',
      accessor: 'LACT',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Reserved Until',
      accessor: 'RU',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Disconnect Until',
      accessor: 'DU',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Effective Date',
      accessor: 'SE',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Contact Person',
      accessor: 'NCON',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Contact Number',
      accessor: 'CTEL',
      Cell: props => <div className="text-center">{props.value}</div>
    },
    {
      Header: 'Notes',
      accessor: 'NOTES',
      Cell: props => <div className="text-center">{props.value}</div>
    },
  ];

  render() {
    return (
      <div className="animated fadeIn">
        <Label className="ml-1"><strong style={{fontSize: 30}}>Multi Dial Number Query</strong></Label>
        <Row className="mt-3">
          <Col xs="6">
            <Card>
              <CardHeader>
                Multi Dial Numbers
              </CardHeader>
              <CardBody className="row">
                <Col xs="3" className="text-right">
                  <Label>Dial Numbers:</Label>
                </Col>
                <Col xs="5">
                  <textarea className="form-control" name="nums" id="nums" rows="15"
                            onChange={(ev) => this.handleChange(ev)}/>
                </Col>
                <Col xs="4">
                  {/*<Button size="md" color="primary">*/}
                  {/*Import*/}
                  {/*</Button>*/}
                  {/*<Input type="file" name="file" onChange={(ev)=>this.uploadfile(ev)}/>*/}
                </Col>
              </CardBody>
            </Card>
          </Col>
          <Col xs="6">
            <Card>
              <CardHeader>
                Request Information
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>Request Description:</Label>
                  <Input type="text" id="desc" name="desc" onChange={(ev) => this.handleChange(ev)} className="col-6"/>
                  <Label>E-mail Address:</Label>
                  <Input type="text" id="mail" name="mail" onChange={(ev) => this.handleChange(ev)} className="col-6"/>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Card>
          <CardBody>
            <div>
            {this.state.display &&
            <ReactTable data={this.state.datas} columns={this.columns} defaultPageSize={10} minRows="1" className="-striped -highlight"/>
            }</div>
            <Row className="mt-3">
              <Col xs="2" className="text-right">
                Message:
              </Col>
              <Col xs="10">
                <Input type="textarea" name="message" value={this.state.message}/>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <Row>
              <Col xs="6" className="text-left">
                <Button size="md" color="primary" onClick={this.submit} className="text-left">Submit</Button>
              </Col>
              <Col xs="6" className="text-right">
                <Button size="md" color="danger" onClick={this.clear} className="text-right">Clear</Button>
              </Col>
            </Row>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

export default connect((state) => ({somos: state.auth.profile.somos}))(withLoadingAndNotification(MNQ));
