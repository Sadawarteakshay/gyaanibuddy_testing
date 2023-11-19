import React from 'react';

import { render, cleanup, screen, fireEvent, waitFor, renderApollo } from '../../test-utils';
import Button from '../button';

import renderer from 'react-test-renderer';
import { colors } from '../../styles';
import { parseRGBConvertToHex } from "../../test_helper";

describe('Button', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders without error', () => {
    renderApollo(<Button>Hello World</Button>);
  });

  it('render snapshot test', () => {
    const HelloWorldButton = <Button>Hello World</Button>;

    // Snapshot test - ensure button has no unsuspecting changes between commits
    const ButtonTree = renderer
      .create(HelloWorldButton)
      .toJSON();

    expect(ButtonTree).toMatchSnapshot();
  })
  
  it('button should have correct text (no characters)', () => {
    const buttonTest = <Button></Button>;
    const nodeType = 'BUTTON';
    const validMessage = "";

    const { container } = render(buttonTest);
    
    const firstElement = container.firstChild;

    expect(firstElement?.nodeName).toBe(nodeType);
    expect(firstElement).toHaveTextContent(validMessage);
  });

  it('button should have correct text (some text)', () => {
    const buttonTest = <Button>Hello</Button>;
    const nodeType = 'BUTTON';
    const validMessage = "Hello";

    const { container } = render(buttonTest);

    const firstElement = container.firstChild;

    expect(firstElement?.nodeName).toBe(nodeType);
    expect(firstElement).toHaveTextContent(validMessage);
  });

  it('button should have correct text (numbers)', () => {
    const buttonTest = <Button>123456789</Button>;
    const nodeType = 'BUTTON';
    const validMessage = "123456789";

    const { container } = render(buttonTest);

    const firstElement = container.firstChild;

    expect(firstElement?.nodeName).toBe(nodeType);
    expect(firstElement).toHaveTextContent(validMessage);
  });

  it('button should have correct text (special characters)', () => {
    const buttonTest = <Button>!@#$%^&*;':"</Button>;
    const nodeType = 'BUTTON';
    const validMessage = "!@#$%^&*;':\"";

    const { container } = render(buttonTest);

    const firstElement = container.firstChild;

    expect(firstElement?.nodeName).toBe(nodeType);
    expect(firstElement).toHaveTextContent(validMessage);
  });

  it('button background should be in the document and have the correct color', async () => {
    const HelloWorldButton = <Button>Hello World</Button>;

    render(HelloWorldButton);

    const helloWorldMSG = 'Hello World';

    let helloWorldBtn = screen.getByText(helloWorldMSG);

    expect(helloWorldBtn).toBeEnabled();
    expect(helloWorldBtn).toBeInTheDocument();
    expect(helloWorldBtn).toHaveTextContent(helloWorldMSG);

    const style = window.getComputedStyle(helloWorldBtn);

    expect(parseRGBConvertToHex(style.backgroundColor)).toBe(colors.accent);

    //fireEvent.mouseOver(screen.getByText(helloWorldMSG));
    //let helloWorldBtn = await waitFor(() => screen.getByText(helloWorldMSG));
  });
});
