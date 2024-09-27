import React from 'react';

import { render, cleanup } from '../../test-utils';
import MenuItem from '../menu-item';
import { renderApollo } from '../../test-utils';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('Menu Item', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders without error', () => {
    renderApollo(<MenuItem to="/wow" />);
  });

  it('render snapshot', () => {
    const PageContainerElement = <MenuItem to="/wow" />;

    // see https://stackoverflow.com/questions/70805929/how-to-fix-error-usehref-may-be-used-only-in-the-context-of-a-router-compon
    render(PageContainerElement, {wrapper: MemoryRouter});
    
    // Snapshot test - ensure button has no unsuspecting changes between commits
    const ElementTree = renderer
      .create(<MemoryRouter>{PageContainerElement}</MemoryRouter>)
      .toJSON();

    expect(ElementTree).toMatchSnapshot();
  });
});
