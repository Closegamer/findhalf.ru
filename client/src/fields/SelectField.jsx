import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MDBSelect } from 'mdbreact';

export default class TextField extends Component {
  static propTypes = {
    meta: PropTypes.objectOf(PropTypes.any).isRequired,
    input: PropTypes.objectOf(PropTypes.any).isRequired,
    label: PropTypes.string.isRequired
  };
  static defaultProps = {
    group: true,
    containerClass: null,
    icon: null,
    disabled: false,
    readonly: false,
    options: [],
    search: false
  };

  render() {
    const {
      input,
      label,

      options,
      search
    } = this.props;

    return (
      <MDBSelect
        options={options}
        selected={input.value}
        label={label}
        search={search}
        getTextContent={input.onChange}
      />
    );
  }
}
