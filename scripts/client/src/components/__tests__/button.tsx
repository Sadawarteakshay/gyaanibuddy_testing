import React from 'react';

import { render, cleanup, screen, fireEvent, waitFor } from '../../test-utils';
import Button from '../button';

import renderer from 'react-test-renderer';
import { colors } from '../../styles';

describe('Button', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders without error', () => {
    const HelloWorldButton = <Button>Hello World</Button>;

    render(HelloWorldButton);

    // Snapshot test - ensure button has no unsuspecting changes between commits
    const ButtonTree = renderer
      .create(HelloWorldButton)
      .toJSON();

    expect(ButtonTree).toMatchSnapshot();
  });

  // it('button background color should change color when hovered over', async () => {
  //   const HelloWorldButton = <Button>Hello World</Button>;

  //   render(HelloWorldButton);

  //   fireEvent.mouseOver(screen.getByText('Hello World'));

  //   expect(screen.)
  // });
});
