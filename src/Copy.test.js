import React from "react";
import { shallow } from "enzyme";

import Copy from "./Copy";

let copyText;
let onCopyMock;
let wrapper;
let selectNodeMock;
let createRangeMock;
let addRangeMock;
let mockRange;
let execCommandMock;

// lots of `beforeEach` setup because so much of the DOM has to be mocked.
beforeEach(() => {
  selectNodeMock = jest.fn();
  mockRange = { selectNode: selectNodeMock };
  createRangeMock = document.createRange = jest
    .fn()
    .mockReturnValue(mockRange);

  addRangeMock = jest.fn();
  const getSelectionMock = (window.getSelection = jest
    .fn()
    .mockReturnValue({
      removeAllRanges: () => {},
      addRange: addRangeMock
    }));

  execCommandMock = (document.execCommand = jest
    .fn()
    .mockReturnValue(true));

  copyText = "text to be copied copy";
  onCopyMock = jest.fn();
  wrapper = shallow(<Copy
    onCopy={ onCopyMock } copyText={ copyText } render={ copyAction => {
      return <button onClick={ copyAction }>click to copy</button>;
    }}
  />);
});

afterEach(() => {
  document.createRange = undefined;
  window.getSelection = undefined;
  document.execCommand = undefined;
});

it("passes dummy node with copy text to selectNode", () => {
  wrapper.find("button").simulate("click");
  const createdDummyNode = selectNodeMock.mock.calls[0][0];
  expect(createdDummyNode instanceof window.Element);
  expect(createdDummyNode.innerHTML).toBe(copyText);
});

it("is removed from the dom after the click", () => {
  wrapper.find("button").simulate("click");
  const createdDummyNode = selectNodeMock.mock.calls[0][0];
  expect(createdDummyNode.parentNode).toBe(null);
});

it("calls addRange with created range", () => {
  wrapper.find("button").simulate("click");
  expect(addRangeMock).toBeCalledWith(mockRange);
});

it("calls exeCommand with 'copy' argument", () => {
  wrapper.find("button").simulate("click");
  expect(execCommandMock).toBeCalledWith("copy");
});
