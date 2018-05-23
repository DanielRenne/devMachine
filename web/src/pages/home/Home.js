import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Globalization from '../../components/Globalization';
import i18n from './i18n.json';

const Home = () => {
  Globalization.load(i18n);
  Globalization.report();
  return (
    <Layout>
      <p>HOME PAGE</p>
      <p>
        <Link to="/page/dynamic">Navigate to Dynamic Page</Link>
      </p>
    </Layout>
  );
};

export default Home;
