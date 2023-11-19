import React from 'react';

import { render, screen, renderApollo, cleanup } from '../../test-utils';
import Footer from '../footer';
import userEvent from '@testing-library/user-event'
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing'

describe('Footer', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders without error', () => {
    renderApollo(<Footer />);
  });

  // Can't snapshot test footer (running into an issue with MemoryRouter)

  it('contains Home, Cart, and Profile MenuItems', async () => {
    const HelloWorldButton = <Footer />;
    
    renderApollo(HelloWorldButton); 
    
    let homeItem = await screen.getByText('Home');
    
    expect(homeItem).toHaveTextContent('Home');
    expect(homeItem).toBeEnabled();
    //expect(homeItem).toHaveAttribute('to', '/');
  });

  // do cart, and profile
});
