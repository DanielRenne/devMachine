import React from 'react';
import { Header } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Globalization from '../../components/Globalization';
import Loading from '../../components/Loading';
import DynamicPage from './DynamicPage'
import importedComponent from 'react-imported-component';
import i18n from './i18n.json';

const Dynamic = ({ match }) => {
  Globalization.load(i18n);
  Globalization.report();
  // console.log(match);
  return (
    <Layout>
      <Header as="h2">Dynamic Page</Header>
      <p>This page was loaded asynchronously!!!</p>
      <DynamicPage match={match}/>
    </Layout>
  );
};

export default Dynamic;
