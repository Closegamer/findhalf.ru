import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { MDBCard, MDBRow, MDBIcon, MDBBtn } from "mdbreact";
import { TextField } from "../../fields";

let FreeKassa = props => {
  const { handleSubmit, classes, submitting } = props;
  return (
    <div>
      <iframe
        src="http://www.free-kassa.ru/merchant/forms.php?gen_form=1&m=177267&default-sum=100&button-text=Перевести&encoding=CP1251&type=v3&id=699900"
        width="100%"
        height="400px"
        frameBorder="0"
        target="_parent"
      ></iframe>
    </div>
  );
};

export default FreeKassa;
