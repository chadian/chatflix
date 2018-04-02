import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Copy extends Component {
  static propTypes = {
    copyText: PropTypes.string,
    onCopy: PropTypes.func
  }

  static defaultProps = {
    onCopy: () => {}
  }

  createDummyElement() {
    let { copyText } = this.props;
    copyText = copyText || "";

    const dummyElement = document.createElement('div');
    dummyElement.innerHTML = copyText;

    // throw it way off screen
    dummyElement.style.height = '0px';
    dummyElement.style.position = 'absolute';
    dummyElement.style.right = '1000%';

    return dummyElement;
  }

  copy() {
    const {
      copyText,
      onCopy
    } = this.props;

    const dummyElement = this.createDummyElement();
    document.body.appendChild(dummyElement);

    const range = document.createRange();
    range.selectNode(dummyElement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    if (document.execCommand('copy') === true) {
      onCopy();
    }

    // clean up
    dummyElement.remove();
    selection.removeAllRanges();
  }

  render() {
    return this.props.render(this.copy.bind(this));
  }
};
