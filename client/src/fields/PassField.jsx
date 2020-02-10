import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MDBInput } from 'mdbreact';
import { getError } from './utils';

export default class PassField extends Component {
  static propTypes = {
    meta: PropTypes.objectOf(PropTypes.any).isRequired,
    input: PropTypes.objectOf(PropTypes.any).isRequired,
    label: PropTypes.string.isRequired
  };
  static defaultProps = {
    group: true,
    type: 'text',
    containerClass: null,
    icon: null,
    disabled: false,
    readonly: false
  };
  render() {
    const {
      meta,
      input,
      label,
      group,
      type,
      containerClass,
      icon,
      readonly,
      disabled
    } = this.props;

    const error = getError(meta);

    return (
      <MDBInput
        error={!!error}
        onChange={input.onChange}
        onBlur={input.onBlur}
        onFocus={input.onFocus}
        label={label}
        group={group}
        type={type}
        autoComplete='off'
        containerClass={containerClass}
        icon={icon}
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
