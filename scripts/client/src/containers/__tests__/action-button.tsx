import React from 'react';

import { render, renderApollo, cleanup, waitFor } from '../../test-utils';
import ActionButton from '../action-button';
import { cartItemsVar } from '../../cache';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('action button', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('render snapshot', () => {
    const ActionButtonElement = <ActionButton />;

    // see https://stackoverflow.com/questions/70805929/how-to-fix-error-usehref-may-be-used-only-in-the-context-of-a-router-compon
    render(ActionButtonElement, {wrapper: MemoryRouter});
    
    // Snapshot test - ensure button has no unsuspecting changes between commits
    const ElementTree = renderer
      .create(<MemoryRouter>{ActionButtonElement}</MemoryRouter>)
      .toJSON();

    expect(ElementTree).toMatchSnapshot();
  });

  it('renders without error', () => {
    const { getByTestId } = renderApollo(<ActionButton />);
    expect(getByTestId('action-button')).toBeTruthy();
  });

  it('shows correct label', () => {
    const { getByText, container } = renderApollo(<ActionButton />);
    getByText(/add to cart/i);

    // rerender with different props to same container
    waitFor(() => cartItemsVar(['1']));
    renderApollo(<ActionButton id="1" />, { container });
    getByText(/remove from cart/i);
    cartItemsVar([]);

    // rerender with different props to same container
    renderApollo(<ActionButton isBooked={true} />, { container });
    getByText(/cancel this trip/i);
  });
});
