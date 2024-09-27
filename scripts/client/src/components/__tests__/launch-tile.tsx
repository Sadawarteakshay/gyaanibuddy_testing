import React from 'react';

import { render, cleanup } from '../../test-utils';
import LaunchTile from '../launch-tile';
import { renderApollo } from '../../test-utils';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('Launch Tile', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders without error', () => {
    renderApollo(
      <LaunchTile
        launch={{
          __typename: 'Launch',
          isBooked: false,
          id: '1',
          mission: { name: 'the first one', __typename: 'Mission', missionPatch: null },
          rocket: { name: 'harambe', __typename: 'Rocket', id: '1' },
        }}
      />,
    );
  });

  it('render snapshot', () => {
    const LaunchTileElement = <LaunchTile
      launch={{
        __typename: 'Launch',
        isBooked: false,
        id: '1',
        mission: { name: 'the first one', __typename: 'Mission', missionPatch: null },
        rocket: { name: 'harambe', __typename: 'Rocket', id: '1' },
      }}
    />;

    // see https://stackoverflow.com/questions/70805929/how-to-fix-error-usehref-may-be-used-only-in-the-context-of-a-router-compon
    render(LaunchTileElement, {wrapper: MemoryRouter});
    
    // Snapshot test - ensure button has no unsuspecting changes between commits
    const ElementTree = renderer
      .create(<MemoryRouter>{LaunchTileElement}</MemoryRouter>)
      .toJSON();

    expect(ElementTree).toMatchSnapshot();
  });
});
