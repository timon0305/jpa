import React from 'react'
import {Col, FormFeedback, FormGroup, Input, Label} from "reactstrap";

/**
 * addInput function generator
 * @param prefix
 * @returns {function(*, *, *, *, *, *)}
 */
export default function addInputGenerator(prefix) {
  return (name, label, type, value, handleChange, validate='', disabled=false) => {
    const id = prefix + name;
    const onChange = handleChange ? (value) => handleChange(value) : undefined;
    return (
      <FormGroup row>
        <Col sm="3">
          <Label htmlFor={id}>{label}: </Label>
        </Col>
        <Col xs="12" sm="9">
          <Input type={type} id={id} name={name} onChange={handleChange} value={'' || value}
                 invalid={validate || false} disabled={disabled} className="form-control"/>
          {validate && <FormFeedback>{validate}</FormFeedback>}
        </Col>
      </FormGroup>
    );
  };
}
