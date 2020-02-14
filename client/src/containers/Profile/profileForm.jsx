import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { MDBBtn } from "mdbreact";
import { TextField, TextArea, DateField } from "../../fields";
import "./styles.css";
import "../Admin/styles.css";

const ProfileForm = props => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit} autoComplete="on">
      <Field
        name="user"
        component={TextField}
        label={"Ник"}
        group
        disabled
        type="text"
      />
      <Field
        name="email"
        component={TextField}
        label={"Email"}
        group
        disabled
        type="email"
      />
      <Field
        name="dob"
        component={DateField}
        label={"Дата рождения"}
        group
        type="date"
      />

      <Field
        name="phone"
        component={TextArea}
        label={"Телефон для связи"}
        group
        type="text"
      />
      <MDBBtn color="unique" className="admin-buttons" type="submit">
        Обновить
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
  form: "profileForm",
  validate,
  destroyOnUnmount: false
})(ProfileForm);
