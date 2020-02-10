import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import emailValidator from 'email-validator';
import { Field, reduxForm } from 'redux-form';
import { MDBCard, MDBRow, MDBCol, MDBIcon, MDBBtn } from 'mdbreact';
import { TextField } from '../../fields';

let RecoveryForm = props => {
  const { handleSubmit, classes, toggleFormType } = props;
  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <MDBCard className={classes.card}>
        <div className='text-white rgba-stylish-strong py-5 px-5 z-depth-4 form-dark'>
          <div className='text-center'>
            <h3 className='white-text mb-5 mt-4'>
              <strong>Забыли пароль?</strong>{' '}
              <small>
                <MDBIcon icon='key' className='green-text' />
              </small>
            </h3>
          </div>
          <Field
            name='email'
            component={TextField}
            type='text'
            label='Email, указанный при регистрации'
            group
          />
          <MDBRow className='d-flex align-items-center mb-4'>
            <div className='text-center mb-3 col-md-12'>
              <MDBBtn
                color='success'
                rounded
                className='btn-block z-depth-1'
                type='submit'
              >
                Восстановить
              </MDBBtn>
            </div>
          </MDBRow>
          <MDBCol md='12'>
            <p className='font-small white-text d-flex justify-content-end'>
              Вспомнили пароль?
              <span
                className={classNames(
                  'green-text ml-1 font-weight-bold',
                  classes.link
                )}
                onClick={() => toggleFormType('login')}
              >
                Войдите
              </span>
            </p>
          </MDBCol>
        </div>
      </MDBCard>
    </form>
  );
};

const validate = values => {
  const errors = {};

  if (values && !values.email) {
    errors.email = 'Введите email';
  } else {
    const isEmailValid = emailValidator.validate(values.email);
    if (!isEmailValid) errors.email = 'Введите корректный email';
  }

  return errors;
};

RecoveryForm.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired
};

RecoveryForm.defaultProps = {
  classes: {}
};

RecoveryForm = reduxForm({
  form: 'recovery',
  destroyOnUnmount: false,
  validate
})(RecoveryForm);

export default RecoveryForm;
