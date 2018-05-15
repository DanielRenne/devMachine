mkdir -p $1 && cd $1

directoryName=${PWD##*/} 


echo -e '
{
  "scripts": {
    "start": "webpack-dev-server"
  }
}
' > package.json

rm -rf public
rm -rf src
rm -rf node_modules

yarn init -y

yarn add react react-dom react-prop-types react-router-dom semantic-ui-react

yarn add babel-core babel-loader babel-preset-env babel-preset-react babel-preset-stage-1 css-loader style-loader html-webpack-plugin webpack webpack-dev-server webpack-cli -D

yarn add react-imported-component react-delay-render

yarn add react-hot-loader -D

touch .babelrc

echo -e '{
  "presets": ["env", "react", "stage-1"],
  "plugins": ["react-hot-loader/babel"]
}' > .babelrc 

touch webpack.config.js

echo -e "const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const port = process.env.PORT || 3000;

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  devtool: 'inline-source-map',
    module: {
    rules: [

      // First Rule
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },

      // Second Rule
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico'
    })
  ],
  devServer: {
    host: 'localhost',
    port: port,
    historyApiFallback: true,
    open: true,
    hot: true
  }
};" > webpack.config.js



mkdir public && cd public
touch index.html

curl https://github.com/esausilva/react-starter-boilerplate-hmr/blob/master/public/favicon.ico -o favicon.ico

echo -e '<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.css"></link>
  <title>webpack-for-react</title>
</head>

<body>
  <div id="root"></div>
</body>

</html>' > index.html

cd ..
mkdir src && cd $_
touch index.js

echo -e "import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

ReactDOM.render(<App />, document.getElementById('root'));

render(App);

// Webpack Hot Module Replacement API
if (module.hot) module.hot.accept('./components/App', () => render(App));" > index.js

mkdir components && cd $_
touch App.js Layout.js Layout.css Home.js DynamicPage.js NoMatch.js

echo -e "import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import importedComponent from 'react-imported-component';
import Home from './Home';
import Loading from './Loading';

const AsyncDynamicPAge = importedComponent(
  () => import('./DynamicPage'),
  {
    LoadingComponent: Loading
  }
);

const AsyncNoMatch = importedComponent(
  () => import('./NoMatch'),
  {
    LoadingComponent: Loading
  }
);

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path=\"/\" component={Home} />
          <Route exact path=\"/dynamic\" component={AsyncDynamicPAge} />
          <Route component={AsyncNoMatch} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;" > App.js

echo -e "import React from 'react';
import { Loader } from 'semantic-ui-react';
import ReactDelayRender from 'react-delay-render';

const Loading = () => <Loader active size=\"massive\" />;

export default ReactDelayRender({ delay: 300 })(Loading);" > Loading.js

echo -e ".pull-right {
  display: flex;
  justify-content: flex-end;
}

.h1 {
  margin-top: 10px !important;
  margin-bottom: 20px !important;
}" > layout.css

echo -e "import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Container, Divider, Icon } from 'semantic-ui-react';

import { pullRight, h1 } from './layout.css';

const Layout = ({ children }) => {
  return (
    <Container>
      <Link to=\"/\">
        <Header as=\"h1\" className={h1}>
          webpack-for-react
        </Header>
      </Link>
      {children}
      <Divider />
      <p className={pullRight}>
        Made with <Icon name=\"heart\" color=\"red\" /> by Esau Silva
      </p>
    </Container>
  );
};

export default Layout;" > Layout.js

echo -e "import React from 'react';
import { Link } from 'react-router-dom';

import Layout from './Layout';

const Home = () => {
  return (
    <Layout>
      <p>Hello World of React and Webpack!</p>
      <p>
        <Link to=\"/dynamic\">Navigate to Dynamic Page</Link>
      </p>
    </Layout>
  );
};

export default Home;" > Home.js

echo -e "import React from 'react';
import { Header } from 'semantic-ui-react';

import Layout from './Layout';

const DynamicPage = () => {
  return (
    <Layout>
      <Header as=\"h2\">Dynamic Page</Header>
      <p>This page was loaded asynchronously!!!</p>
    </Layout>
  );
};

export default DynamicPage;" > DynamicPage.js

echo -e "import React from 'react';
import { Icon, Header } from 'semantic-ui-react';

import Layout from './Layout';

const NoMatch = () => {
  return (
    <Layout>
      <Icon name=\"minus circle\" size=\"big\" />
      <strong>Page not found!</strong>
    </Layout>
  );
};

export default NoMatch;" > NoMatch.js



