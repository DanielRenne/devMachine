import React from 'react';

import { Header, Container, Divider, Icon } from 'semantic-ui-react';
import MenuAppBar from './MenuAppBar'

import { pullRight, h1 } from './layout.css';

const Layout = ({ children }) => {
  return (
    <Container fluid>
      <MenuAppBar />
      {children}
      <Divider />
    </Container>
  );
};

export default Layout;
