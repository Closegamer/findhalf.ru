import React, { Component } from 'react';
import { MDBFileInput } from 'mdbreact';
import { getError } from './utils';

class FileField extends Component {
  render() {
    const { meta, input } = this.props;
    const error = getError(meta);
    return (
      <MDBFileInput
        getValue={input.onChange}
        btnTitle='Картинка'
        btnColor='unique'
      >
        <div className='invalid-tooltip'>{error}</div>
      </MDBFileInput>
    );
  }
}

export default FileField;
