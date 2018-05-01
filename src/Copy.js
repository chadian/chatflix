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

    // dummy element is used to hold the text to be copied
    const dummyElement = this.createDummyElement();

    // from testing, the element has to be in the document
    // to be selectable and copyable
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
    const copy = this.copy.bind(this);
    return this.props.render(copy);
  }
};
