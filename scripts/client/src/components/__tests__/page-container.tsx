import React from 'react';

import { render, cleanup } from '../../test-utils';
import PageContainer from '../page-container';
import renderer from 'react-test-renderer';

describe('Page Container', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders without error', () => {
    render(<PageContainer />);
  });

  it('render snapshot', () => {
    const PageContainerElement = <PageContainer />;

    render(PageContainerElement);

    // Snapshot test - ensure button has no unsuspecting changes between commits
    const ElementTree = renderer
      .create(PageContainerElement)
      .toJSON();

    expect(ElementTree).toMatchSnapshot();
  });
});
