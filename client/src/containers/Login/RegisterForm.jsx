import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import emailValidator from 'email-validator';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { MDBCard, MDBRow, MDBCol, MDBIcon, MDBBtn } from 'mdbreact';
import { TextField, PassField, CheckBoxField } from '../../fields';

let RegisterForm = props => {
  const {
    handleSubmit,
    agree,
    classes,
    toggleFormType,
    error,
    submitting
  } = props;
  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <MDBCard className={classes.card}>
        <div className='text-white rgba-stylish-strong py-5 px-5 z-depth-4 form-dark'>
          <div className='text-center'>
            <h3 className='white-text mb-5 mt-4'>
              <strong>Регистрация</strong>{' '}
              <small>
                <MDBIcon icon='user-plus' className='green-text' />
              </small>
            </h3>
          </div>
          <Field
            name='nick'
            component={TextField}
            type='text'
            label='Имя в системе'
            group
          />
          <Field
            name='email'
            component={TextField}
            type='text'
            label='Email'
            group
          />
          <Field
            name='password'
            component={PassField}
            label='Пароль'
            group
            type='password'
          />
          <Field
            name='agree'
            component={CheckBoxField}
            label={
              <label className='form-check-label white-text' htmlFor='agree'>
                Принимаю{' '}
                <a href='#!' className='green-text font-weight-bold'>
                  Пользовательское соглашение
                </a>
              </label>
            }
          />
          {!!error && (
            <blockquote className='blockquote bq-danger'>
              <small>{error}</small>
            </blockquote>
          )}
          <MDBRow className='d-flex align-items-center mb-4'>
            <div className='text-center mb-3 col-md-12'>
              <MDBBtn
                color='success'
                rounded
                className='btn-block z-depth-1'
                type='submit'
                disabled={!agree || submitting}
              >
                {submitting ? (
                  <React.Fragment>
                    <div className='spinner-grow spinner-grow-sm' role='status'>
                      <span className='sr-only'>Загрузка...</span>
                    </div>
                    <div className='spinner-grow spinner-grow-sm' role='status'>
                      <span className='sr-only'>Загрузка...</span>
                    </div>
                    <div className='spinner-grow spinner-grow-sm' role='status'>
                      <span className='sr-only'>Загрузка...</span>
                    </div>
                  </React.Fragment>
                ) : (
                  'Зарегистрироваться'
                )}
              </MDBBtn>
            </div>
          </MDBRow>
          <MDBCol md='12'>
            <p className='font-small white-text d-flex justify-content-end'>
              Уже зарегистрировались?
              <span
                className={classNames(
                  'green-text ml-1 font-weight-bold',
                  classes.link
                )}
                onClick={e => toggleFormType('login')}
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

  if (values && !values.password) {
    errors.password = 'Введите пароль';
  }

  if (values && !values.nick) {
    errors.nick = 'Введите имя';
  }

  return errors;
};

RegisterForm.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired
};

RegisterForm.defaultProps = {
  classes: {}
};

RegisterForm = reduxForm({
  form: 'register',
  destroyOnUnmount: false,
  validate
})(RegisterForm);

const selector = formValueSelector('register');

RegisterForm = connect(state => {
  // can select values individually
  const agree = selector(state, 'agree');
  return {
    agree
  };
})(RegisterForm);

export default RegisterForm;
