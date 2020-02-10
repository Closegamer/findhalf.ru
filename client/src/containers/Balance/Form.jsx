import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { MDBCard, MDBRow, MDBIcon, MDBBtn } from "mdbreact";
import { TextField } from "../../fields";
import FreeKassa from "./freeKassa";

let Form = props => {
  const { handleSubmit, classes, submitting } = props;
  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <MDBCard className={classes.card}>
        <div className="text-white rgba-stylish-strong py-5 px-5 z-depth-4 form-dark payForm">
          <div className="text-center">
            <h3 className="white-text mb-5 mt-4">
              <strong>Пополнить баланс</strong>{" "}
              <small>
                <MDBIcon icon="credit-card" className="green-text" />
              </small>
            </h3>
          </div>
          <Field
            name="balance"
            component={TextField}
            type="text"
            label="Введите сумму"
            group
            normalize={value => Number(value)}
          />
          <MDBBtn
            color="success"
            rounded
            className="btn-block z-depth-1"
            type="submit"
            disabled={submitting}
          >
            Зачислить на счет
          </MDBBtn>
        </div>
      </MDBCard>
    </form>
  );
};

Form.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired
};

Form.defaultProps = {
  classes: {}
};

Form = reduxForm({
  form: "balance"
})(Form);

export default Form;
