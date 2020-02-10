import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { MDBBtn } from "mdbreact";
import { TextField, TextArea } from "../../fields";
import "./styles.css";
import "../Admin/styles.css";

const ContactForm = props => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit} autoComplete="on">
      <Field
        name="user"
        component={TextField}
        label={"Представьтесь, пожалуйста"}
        group
        type="text"
      />
      <Field
        name="email"
        component={TextField}
        label={"Введите email"}
        group
        type="email"
      />
      <Field
        name="header"
        component={TextField}
        label={"Введите тему сообщения"}
        group
        type="text"
      />
      <Field
        name="message"
        component={TextArea}
        label={"Введите сообщение"}
        group
        type="textarea"
        rows={"15"}
        maxlength={"2000"}
      />
      <MDBBtn color="unique" className="admin-buttons" type="submit">
        Отправить
      </MDBBtn>
    </form>
  );
};

const validate = values => {
  const errors = {};

  if (values && !values.header) {
    errors.header = "Вы не заполнили поле темы сообщения";
  }

  if (values && !values.message) {
    errors.header = "Вы не заполнили поле сообщения";
  }

  return errors;
};

export default reduxForm({
  form: "contactForm",
  validate,
  destroyOnUnmount: false
})(ContactForm);
