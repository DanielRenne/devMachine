mkdir -p $1 && cd $1

directoryName=${PWD##*/} 


echo -e '
{
  "scripts": {
    "start":"webpack-dev-server --config webpack.config.development.js",
    "dev":"webpack-dev-server --config webpack.config.development.js",
    "prebuild": "rimraf dist",
    "build": "cross-env NODE_ENV=production webpack -p --config webpack.config.production.js"
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

yarn add extract-text-webpack-plugin@next -D

yarn add postcss-loader -D

yarn add rimraf cross-env -D

yarn add @material-ui/core@1.0.0-rc.1 @material-ui/icons

touch .babelrc

echo -e '{
  "presets": ["env", "react", "stage-1"],
  "plugins": ["react-hot-loader/babel"]
}' > .babelrc 

touch postcss.config.js

echo -e "module.exports = {
  plugins: [require('autoprefixer')]
};" > postcss.config.js

touch webpack.config.development.js
touch webpack.config.production.js

echo -e "const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  mode: 'production',
  entry: {
    vendor: ['semantic-ui-react'],
    app: './src/index.js'
  },
  output: {
    // We want to create the JavaScript bundles under a 
    // 'static' directory
    filename: 'static/[name].[hash].js',
    // Absolute path to the desired output directory. In our 
    //case a directory named 'dist'
    // '__dirname' is a Node variable that gives us the absolute
    // path to our current directory. Then with 'path.resolve' we 
    // join directories
    // Webpack 4 assumes your output path will be './dist' so you 
    // can just leave this
    // entry out.
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  // Change to production source maps
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        // We configure 'Extract Text Plugin'
        use: ExtractTextPlugin.extract({
          // loader that should be used when the
          // CSS is not extracted
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                // Allows to configure how many loaders 
                // before css-loader should be applied
                // to @import(ed) resources
                importLoaders: 1,
                camelCase: true,
                // Create source maps for CSS files
                sourceMap: true
              }
            },
            {
              // PostCSS will run before css-loader and will 
              // minify and autoprefix our CSS rules. We are also
              // telling it to only use the last 2 
              // versions of the browsers when autoprefixing
              loader: 'postcss-loader',
              options: {
                config: {
                  ctx: {
                    autoprefixer: {
                      browsers: 'last 2 versions'
                    }
                  }
                }
              }
            }
          ]
        })
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          test: 'vendor',
          name: 'vendor',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico'
    }),
    
    // Create the stylesheet under 'styles' directory
    new ExtractTextPlugin({
      filename: 'styles/styles.[hash].css',
      allChunks: true
    })
  ]
};" > webpack.config.production.js

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
};" > webpack.config.development.js

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
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
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

const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );

render(App);
if (module.hot) module.hot.accept('./components/App', () => render(App));" > index.js

mkdir components && cd $_
touch App.js Layout.js layout.css Home.js DynamicPage.js NoMatch.js

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

export default Layout;" > Layout.js

echo -e "import React from 'react';
import { Link } from 'react-router-dom';

import Layout from './Layout';

const Home = () => {
  return (
    <Layout>
      <p>HOME PAGE</p>
      <p>
        <Link to=\"/dynamic\">Navigate to Dynamic Page</Link>
      </p>
    </Layout>
  );
};

export default Home;" > Home.js

echo -e "import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class MenuAppBar extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
  };

  handleLogout = (event) => {
    this.setState({ auth: false });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <AppBar position=\"static\">
          <Toolbar>
            <IconButton className={classes.menuButton} color=\"inherit\" aria-label=\"Menu\">
              <MenuIcon />
            </IconButton>
            
                <Typography variant=\"title\" color=\"inherit\" className={classes.flex}>
                    <NavLink to=\"/\" activeStyle={{color:\"white\"}}>
                        Sample App
                    </NavLink>
                </Typography>
            
            {auth && (
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup=\"true\"
                  onClick={this.handleMenu}
                  color=\"inherit\"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id=\"menu-appbar\"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                  <MenuItem onClick={this.handleClose}>My account</MenuItem>
                  <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuAppBar);" > MenuAppBar.js



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



