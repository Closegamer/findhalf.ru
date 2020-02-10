import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import classNames from 'classnames';
import { MDBCard, MDBRow, MDBCol, MDBIcon, MDBBtn } from 'mdbreact';
import { TextField, PassField } from '../../fields';
import emailValidator from 'email-validator';

const LoginForm = props => {
  const { handleSubmit, submitting, error, classes, toggleFormType } = props;
  return (
    <form onSubmit={handleSubmit} className={classes.form} autoComplete='off'>
      <MDBCard className={classes.card}>
        <div className='text-white rgba-stylish-strong py-5 px-5 z-depth-4 form-dark'>
          <div className='text-center'>
            <h3 className='white-text mb-5 mt-4'>
              <strong>Вход</strong>{' '}
              <small>
                <MDBIcon icon='sign-in-alt' className='green-text' />
              </small>
            </h3>
          </div>
          <Field
            name='email'
            component={TextField}
            label='Email'
            group
            type='text'
            //icon='envelope'
          />
          <Field
            name='password'
            component={PassField}
            label='Пароль'
            group
            type='password'
            containerClass='mb-0'
            //icon='key'
          />
          <p className='font-small white-text d-flex justify-content-end'>
            Забыли
            <span
              className={classNames(
                'green-text ml-1 font-weight-bold',
                classes.link
              )}
              onClick={e => toggleFormType('recovery')}
            >
              пароль?
            </span>
          </p>
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
                disabled={submitting}
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
                  'Войти'
                )}
              </MDBBtn>
            </div>
          </MDBRow>
          <MDBCol md='12'>
            <p className='font-small white-text d-flex justify-content-end'>
              Нет учетной записи?
              <span
                className={classNames(
                  'green-text ml-1 font-weight-bold',
                  classes.link
                )}
                onClick={e => toggleFormType('register')}
              >
                Регистрация
              </span>
            </p>
          </MDBCol>
        </div>
      </MDBCard>
    </form>
  );
};

LoginForm.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired
};

LoginForm.defaultProps = {
  classes: {}
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

  return errors;
};

export default reduxForm({
  form: 'login', // a unique identifier for this form
  validate,
  destroyOnUnmount: false
})(LoginForm);
