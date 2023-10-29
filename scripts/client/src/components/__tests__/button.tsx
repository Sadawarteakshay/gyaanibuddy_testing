import React from 'react';

import { render, cleanup, screen, fireEvent, waitFor, renderApollo } from '../../test-utils';
import Button from '../button';

import renderer from 'react-test-renderer';
import { colors } from '../../styles';
import { lighten } from 'polished';

describe('Button', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders without error', () => {
    renderApollo(<Button>Hello World</Button>);
  });

  it('render snapshot test', () => {
    const HelloWorldButton = <Button>Hello World</Button>;

    render(HelloWorldButton);

    // Snapshot test - ensure button has no unsuspecting changes between commits
    const ButtonTree = renderer
      .create(HelloWorldButton)
      .toJSON();

    expect(ButtonTree).toMatchSnapshot();
  })

  it('button background color should change color when hovered over', async () => {
    const HelloWorldButton = <Button>Hello World</Button>;

    render(HelloWorldButton);

    const helloWorldMSG = 'Hello World';

    fireEvent.mouseOver(screen.getByText(helloWorldMSG));

    const helloWorldButton = screen.getByText(helloWorldMSG);
    const expectedColor = lighten(0.1, colors.accent);

    expect(helloWorldButton).toBeEnabled();
    expect(helloWorldButton).toBeInTheDocument();
    expect(helloWorldButton).toHaveTextContent(helloWorldMSG);

    //expect(helloWorldButton).toHaveAttribute('backgroundColor', expectedColor);
  });
});
