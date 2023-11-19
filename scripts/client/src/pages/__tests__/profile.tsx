import React from 'react';

import { render, renderApollo, cleanup, waitFor } from '../../test-utils';
import Profile, { GET_MY_TRIPS } from '../profile';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing'

const mockLaunch = {
  __typename: 'Launch',
  id: 1,
  isBooked: true,
  rocket: {
    __typename: 'Rocket',
    id: 1,
    name: 'tester',
  },
  mission: {
    __typename: 'Mission',
    id: 1,
    name: 'test mission',
    missionPatch: '/',
  },
};

const mockMe = {
  __typename: 'User',
  id: 1,
  email: 'a@a.a',
  trips: [mockLaunch],
};

describe('Profile Page', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders profile page', async () => {
    const mocks = [
      {
        request: { query: GET_MY_TRIPS },
        result: { data: { me: mockMe } },
      },
    ];

    const { getByText } = renderApollo(<Profile />, { mocks });

    // if the profile renders, it will have the list of missions booked
    await waitFor(() => getByText(/test mission/i));
  });

  it('render snapshot', async () => {
    const mocks = [
      {
        request: { query: GET_MY_TRIPS },
        result: { data: { me: mockMe } },
      },
    ];

    const ProfileElement = <Profile />;

    // Snapshot test - ensure element has no unsuspecting changes between commits
    const ElementTree = renderer
      .create(<MockedProvider mocks={mocks} addTypename={false}>{ProfileElement}</MockedProvider>);
      
    expect(ElementTree).toMatchSnapshot();
  });
});
