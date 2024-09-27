import React from 'react';
import LogoutButton from '../logout-button';

import { render, renderApollo, cleanup, fireEvent } from '../../test-utils';
import { cache, isLoggedInVar } from '../../cache';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/react-testing'

describe('logout button', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('render snapshot', () => {
    const LogoutButtonElement = <LogoutButton />;

    // see https://stackoverflow.com/questions/70805929/how-to-fix-error-usehref-may-be-used-only-in-the-context-of-a-router-compon
    render(LogoutButtonElement, {wrapper: MockedProvider});
    
    // Snapshot test - ensure button has no unsuspecting changes between commits
    const ElementTree = renderer
      .create(<MockedProvider>{LogoutButtonElement}</MockedProvider>)
      .toJSON();

    expect(ElementTree).toMatchSnapshot();
  });

  it('renders logout button', async () => {
    renderApollo(<LogoutButton />);
  });

  it('complete logout', async () => {
    isLoggedInVar(true);
    localStorage.setItem('token', window.btoa('testTokenValue'));
    localStorage.setItem('userId', window.btoa('abc123'));
    const { getByTestId } = renderApollo(<LogoutButton />, { cache });
    fireEvent.click(getByTestId('logout-button'));
    expect(isLoggedInVar()).toBeFalsy();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userId')).toBeNull();
  });
});
