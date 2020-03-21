import React from 'react'
import {Card, Form, Collapse} from "reactstrap";
import CardBody from "reactstrap/es/CardBody";
import CardFormFooter from "../../components/Card/CardFormFooter";
import addInputGenerator from './addInput';
import {withApiCallAndNotification} from "../../components/HOC/withLoadingAndNotification";
import PropTypes from 'prop-types'
import {cardHeader} from "../../components/Card/CollapsibleCardHeader";

class AdditionalInfo extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      country: PropTypes.string,
      address: PropTypes.string,
      province: PropTypes.string,
      city: PropTypes.string,
      zipcode: PropTypes.string,
      tel1:PropTypes.string,
      tel2: PropTypes.string,
      mobile: PropTypes.string,
      fax: PropTypes.string,

      countryError:PropTypes.string,
      addressError:PropTypes.string,
      provinceError:PropTypes.string,
      cityError: PropTypes.string,
      zipError: PropTypes.string,
      tel1Error: PropTypes.string,
      tel2Error: PropTypes.string,
      mobileError: PropTypes.string,
      faxError: PropTypes.string
    }).isRequired,
    hasFooter: PropTypes.bool,
    inModal:PropTypes.bool,   // Whether this component is in Modal or Not.
    isCollapsible: PropTypes.bool,
    handleChange:PropTypes.func,
    resetHandler: PropTypes.func,
    updateHandler: PropTypes.func,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    hasFooter: false,
    inModal:false,
    isCollapsible: false
  };

  constructor(props) {
    super(props);
    this.addInput = addInputGenerator('additional-info-');
    this.state = {isCollapsed: false}
  }

  render() {
    const data = this.props.data;
    const Header = cardHeader(!this.props.inModal, this.props.isCollapsible);
    return(
      <Card>
        <Header
          toggle={() => this.setState({isCollapsed:!this.state.isCollapsed})}
                     isCollapsed = {this.state.isCollapsed}>Additional Information</Header>
        <Collapse isOpen={!this.state.isCollapsed}>
          <CardBody>
            <Form action="" method="post" className="form-horizontal">
              {this.addInput('country', 'Country', 'text', data.country, this.handleChange('country'), data.countryError, this.props.disabled)}
              {this.addInput('address', 'Address', 'text', data.address, this.handleChange('address'), data.addressError, this.props.disabled)}
              {this.addInput('province', 'Province', 'text', data.province, this.handleChange('province'), data.provinceError, this.props.disabled)}
              {this.addInput('city', 'City', 'text', data.city, this.handleChange('city'), data.cityError, this.props.disabled)}
              {this.addInput('zipcode', 'Zip Code', 'text', data.zipcode, this.handleChange('zipcode'), data.zipError, this.props.disabled)}
              {this.addInput('tel1', 'Tel-1', 'number', data.tel1, this.handleChange('tel1'), data.tel1Error, this.props.disabled)}
              {this.addInput('tel2', 'Tel-2', 'number', data.tel2, this.handleChange('tel2'), data.tel2Error, this.props.disabled)}
              {this.addInput('mobile', 'Mobile', 'number', data.mobile, this.handleChange('mobile'), data.mobileError, this.props.disabled)}
              {this.addInput('fax', 'Fax', 'number', data.fax, this.handleChange('fax'), data.faxError, this.props.disabled)}
            </Form>
          </CardBody>
        </Collapse>
        {this.props.hasFooter ? <CardFormFooter resetHandler={this.reset} updateHandler={this.updateAdditional}/> : undefined}
      </Card>
    )
  }

  handleChange = (key) => {
    return (evt) => {
      if (this.props.handleChange) {
        this.props.handleChange({[key]: evt.target.value});
      }
    };
  };

  reset = () => {
    this.props.resetHandler();
  };

  updateAdditional = () => {
    this.props.updateHandler(this.props.data);
  };
}

export default withApiCallAndNotification(AdditionalInfo)
