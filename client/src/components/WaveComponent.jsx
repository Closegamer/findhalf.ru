import React from 'react';
import { MDBWaves } from 'mdbreact';

class WaveComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cursorPos: {}
    };
  }

  handleClick = e => {
    e.stopPropagation();
    e.preventDefault();
    // Waves - Get Cursor Position
    let cursorPos = {
      top: e.clientY,
      left: e.clientX,
      time: Date.now() // time indicates particular clicks
    };
    this.setState({ cursorPos: cursorPos });
  };

  render() {
    const { tag, className, onClick } = this.props;
    return React.createElement(
      tag,
      {
        className: `${className} Ripple-parent`,
        onMouseUp: this.handleClick,
        onTouchStart: this.handleClick,
        onClick
      },
      <div>
        {this.props.children}
        <MDBWaves cursorPos={this.state.cursorPos} />
      </div>
    );
  }
}

WaveComponent.defaultProps = {
  tag: 'div',
  className: 'customWaveComponent',
  onClick: () => undefined
};

export default WaveComponent;
