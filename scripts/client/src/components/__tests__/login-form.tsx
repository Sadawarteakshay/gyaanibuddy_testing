import React from 'react';
import renderer from 'react-test-renderer';

import { render, cleanup } from '../../test-utils';
import LoginForm from '../login-form';

describe('Login Form', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders without error', () => {
    const loginFormObject = <LoginForm login={() => {}}/>;

    render(loginFormObject);

    const loginFormTree = renderer
      .create(loginFormObject)
      .toJSON();

    expect(loginFormTree).toMatchSnapshot();
  });

  it('render snapshot', () => {
    const LoginFormElement = <LoginForm login={() => {}}/>;

    render(LoginFormElement);

    // Snapshot test - ensure button has no unsuspecting changes between commits
    const ElementTree = renderer
      .create(LoginFormElement)
      .toJSON();

    expect(ElementTree).toMatchSnapshot();
  });
});
