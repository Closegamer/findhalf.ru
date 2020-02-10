import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MDBInput } from 'mdbreact';
import { getError } from './utils';

export class CheckBoxField extends Component {
  static propTypes = {
    meta: PropTypes.objectOf(PropTypes.any).isRequired,
    input: PropTypes.objectOf(PropTypes.any).isRequired,
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired
  };
  static defaultProps = {
    disabled: false,
    readonly: false
  };
  render() {
    const { meta, input, label, disabled, readonly } = this.props;
    const error = getError(meta);
    return (
      <MDBInput
        checked={!!input.value}
        type='checkbox'
        id={input.name}
        error={!!error}
        onChange={input.onChange}
        onBlur={input.onBlur}
        onFocus={input.onFocus}
        label={label}
        autoComplete='off'
        className={!!error ? 'is-invalid' : null}
        disabled={disabled}
        readOnly={readonly}
        valueDefault={input.value}
      >
        <div className='invalid-tooltip'>{error}</div>
      </MDBInput>
    );
  }
}

export default CheckBoxField;
