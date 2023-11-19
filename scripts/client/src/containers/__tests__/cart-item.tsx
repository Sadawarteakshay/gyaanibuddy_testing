import React from 'react';

import { render, renderApollo, cleanup, waitFor } from '../../test-utils';
import CartItem, { GET_LAUNCH } from '../cart-item';
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

describe('cart item', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('render snapshot', async () => {
    let mocks = [
      {
        request: { query: GET_LAUNCH, variables: { launchId: '1' } },
        result: { data: { launch: mockLaunch } },
      },
    ];

    const CartItemElement = <CartItem launchId={'1'} />;

    // see https://stackoverflow.com/questions/70805929/how-to-fix-error-usehref-may-be-used-only-in-the-context-of-a-router-compon
    // Used this as well https://www.apollographql.com/docs/react/development-testing/testing/
    render(<MockedProvider mocks={mocks} addTypename={false}>
      {CartItemElement}
    </MockedProvider>);
    
    // Todo somehow wait for cart to load

    // Snapshot test - ensure element has no unsuspecting changes between commits
    const ElementTree = renderer
      .create(<MockedProvider mocks={mocks} addTypename={false}>{CartItemElement}</MockedProvider>)
      .toJSON();
      
    expect(ElementTree).toMatchSnapshot();
  });

  it('queries item and renders without error', () => {
    let mocks = [
      {
        request: { query: GET_LAUNCH, variables: { launchId: '1' } },
        result: { data: { launch: mockLaunch } },
      },
    ];

    // since we know the name of the mission, and know that name
    // will be rendered at some point, we can use getByText
    const { getByText } = renderApollo(<CartItem launchId={'1'} />, {
      mocks,
      addTypename: false,
    });

    // check the loading state
    getByText(/loading/i);

    return waitFor(() => getByText(/test mission/i));
  });

  it('renders with error state', () => {
    let mocks = [
      {
        request: { query: GET_LAUNCH, variables: { launchId: 1 } },
        error: new Error('aw shucks'),
      },
    ];

    // since we know the error message, we can use getByText
    // to recognize the error
    const { getByText } = renderApollo(<CartItem launchId={'1'} />, {
      mocks,
      addTypename: false,
    });

    waitFor(() => getByText(/aw shucks/i));
  });
});
