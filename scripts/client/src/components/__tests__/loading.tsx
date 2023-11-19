import React from 'react';

import { render, cleanup } from '../../test-utils';
import Loading from '../loading';
import renderer from 'react-test-renderer';

describe('Loading', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders without error', () => {
    render(<Loading />);
  });

  it('render snapshot', () => {
    const LoadingElement = <Loading />;

    render(LoadingElement);

    // Snapshot test - ensure button has no unsuspecting changes between commits
    const ElementTree = renderer
      .create(LoadingElement)
      .toJSON();

    expect(ElementTree).toMatchSnapshot();
  });
});
