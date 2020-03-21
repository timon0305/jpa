import React from 'react';
import {withLoadingOverlay} from "../../components/HOC/withLoadingAndNotification";
import {Col, Row} from "reactstrap";
import Versions from "./Versions";
import Notifications from "./Notifications";

export default withLoadingOverlay( ({}) => (
  <>
    <Row>
      <Col className="xs-12">
        <Versions/>
      </Col>
    </Row>
    <Row>
      <Col className="xs-12">
        <Notifications/>
      </Col>
    </Row>
  </>
  )
);
