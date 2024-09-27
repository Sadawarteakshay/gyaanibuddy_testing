import React from 'react';

import { render, renderApollo, cleanup, fireEvent, waitFor } from '../../test-utils';
import BookTrips, { BOOK_TRIPS } from '../book-trips';
import { GET_LAUNCH } from '../cart-item';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing'

const mockLaunch = {
  __typename: 'Launch',
  id: 1,
  isBooked: true,
  rocket: {
    id: 1,
    name: 'tester',
  },
  mission: {
    name: 'test mission',
    missionPatch: '/',
  },
};

describe('book trips', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('render snapshot', () => {
    const BookTripElement = <BookTrips cartItems={[]} />;

    // see https://stackoverflow.com/questions/70805929/how-to-fix-error-usehref-may-be-used-only-in-the-context-of-a-router-compon
    render(BookTripElement, {wrapper: MockedProvider});
    
    // Snapshot test - ensure button has no unsuspecting changes between commits
    const ElementTree = renderer
      .create(<MockedProvider>{BookTripElement}</MockedProvider>)
      .toJSON();

    expect(ElementTree).toMatchSnapshot();
  });

  it('renders without error', () => {
    const { getByTestId } = renderApollo(<BookTrips cartItems={[]} />);
    expect(getByTestId('book-button')).toBeTruthy();
  });

  it('completes mutation and shows message', async () => {
    let mocks = [
      {
        request: { query: BOOK_TRIPS, variables: { launchIds: ['1'] } },
        result: {
          data: {
            bookTrips: [{ success: true, message: 'success!', launches: [] }],
          },
        },
      },
      {
        // we need this query for refetchQueries
        request: { query: GET_LAUNCH, variables: { launchId: '1' } },
        result: { data: { launch: mockLaunch } },
      },
    ];
    const { getByTestId } = renderApollo(<BookTrips cartItems={['1']} />, { mocks, addTypename: false });

    fireEvent.click(getByTestId('book-button'));

    // Let's wait until our mocked mutation resolves and
    // the component re-renders.
    // getByTestId throws an error if it cannot find an element with the given ID
    // and waitFor will wait until the callback doesn't throw an error
    await waitFor(() => getByTestId('message'));
  });

  // >>>> TODO
  it('correctly updates cache', () => {});
});
