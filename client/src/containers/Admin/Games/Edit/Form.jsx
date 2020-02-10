import React from "react";
import { Field, reduxForm } from "redux-form";
import { TextField, SelectField, FileField } from "../../../../fields";
import { MDBBtn } from "mdbreact";
import store from "../../../../store";

let Form = props => {
  const { handleSubmit } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="humanId"
        component={TextField}
        type="text"
        label="Id игры (auto)"
        group
        disabled
      />
      <Field
        name="description"
        component={TextField}
        type="text"
        label="Описание"
        group
      />
      <Field
        name="caption"
        component={TextField}
        type="text"
        label="Название игры или приза"
        group
      />
      <Field
        name="marketPrice"
        component={TextField}
        type="text"
        label="Рыночная цена приза"
        group
      />
      <Field
        name="duration"
        component={SelectField}
        label="Период, секунд"
        group
        options={[
          {
            text: "15",
            value: 15
          },
          {
            text: "30",
            value: 30
          },
          {
            text: "45",
            value: 45
          },
          {
            text: "60",
            value: 60
          },
          {
            text: "80",
            value: 80
          },
          {
            text: "100",
            value: 100
          },
          {
            text: "120",
            value: 120
          },
          {
            text: "180",
            value: 180
          },
          {
            text: "88888",
            value: 88888
          }
        ]}
        search={false}
      />
      <Field
        name="autoBetting"
        component={SelectField}
        label="Автоставки"
        group
        options={[
          {
            text: "Да",
            value: "on"
          },
          {
            text: "Нет",
            value: "off"
          }
        ]}
        search={false}
      />
      <Field
        name="betSize"
        component={SelectField}
        label="Цена участия, рублей"
        group
        options={[
          {
            text: "10",
            value: 10
          },
          {
            text: "15",
            value: 15
          },
          {
            text: "20",
            value: 20
          },
          {
            text: "30",
            value: 30
          },
          {
            text: "100",
            value: 100
          }
        ]}
        search={false}
      />
      <Field
        name="singleStep"
        component={TextField}
        type="text"
        label="Шаг роста цены, рублей"
        group
      />
      <Field name="bigPic" component={FileField} />
      <MDBBtn type="submit" color="unique">
        Создать
      </MDBBtn>
    </form>
  );
};

Form = reduxForm({
  form: "createGame"
})(Form);

export default Form;
