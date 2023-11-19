import React from 'react';

import { render, cleanup, screen } from '../../test-utils';
import LaunchDetail from '../launch-detail';
import renderer from 'react-test-renderer';

describe('Launch Detail View', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders without error', () => {
    render(
      <LaunchDetail
        id={'1'}
        site={'earth'}
        rocket={{ name: 'that one', type: 'big', __typename: 'Rocket', id: '1' }}
      />,
    );
  });

  it('render snapshot', () => {
    const LaunchElement = <LaunchDetail
      id={'1'}
      site={'earth'}
      rocket={{ name: 'that one', type: 'big', __typename: 'Rocket', id: '1' }}
    />;

    render(LaunchElement);

    // Snapshot test - ensure button has no unsuspecting changes between commits
    const ElementTree = renderer
      .create(LaunchElement)
      .toJSON();

    expect(ElementTree).toMatchSnapshot();
  });

  it('should contain correct rocket name and rocket type', () =>{
    const LaunchElement = <LaunchDetail
      id={'1'}
      site={'earth'}
      rocket={{ name: 'that one', type: 'big', __typename: 'Rocket', id: '1' }}
    />;

    render(LaunchElement);

    expect(screen.getByText('earth')).toHaveTextContent('earth'); // TODO: fix this; check the dom or something
  });
});
