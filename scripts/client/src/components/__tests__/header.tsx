import React from 'react';

import { render, cleanup, screen } from '../../test-utils';
import Header from '../header';
import renderer from 'react-test-renderer';

describe('Header', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders without error', () => {
    render(<Header />);
  });

  it('render snapshot test', () => {
    const HeaderElement = <Header />;

    render(HeaderElement);

    // Snapshot test - ensure button has no unsuspecting changes between commits
    const ButtonTree = renderer
      .create(HeaderElement)
      .toJSON();

    expect(ButtonTree).toMatchSnapshot();
  });

  it('should contain correct img', () =>{
    const HeaderElement = <Header />;

    render(HeaderElement);

    expect(screen.getByAltText('Space dog')).toHaveAttribute('src', 'dog-3.png');
  });
});
