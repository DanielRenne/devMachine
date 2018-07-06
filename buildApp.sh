mkdir -p $1
cp -r web/ $1/web

directoryName=${PWD##*/} 

cd $1/web

curl https://github.com/esausilva/react-starter-boilerplate-hmr/blob/master/public/favicon.ico -o public/favicon.ico


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

rm -rf node_modules

yarn init -y

yarn add react react-dom react-prop-types react-router-dom semantic-ui-react

yarn add babel-core babel-loader babel-preset-env babel-preset-react babel-preset-stage-1 babel-polyfill css-loader style-loader html-webpack-plugin webpack webpack-dev-server webpack-cli -D

yarn add react-imported-component react-delay-render json-loader file-loader

yarn add react-hot-loader -D

yarn add extract-text-webpack-plugin@next -D

yarn add postcss-loader -D

yarn add rimraf cross-env -D

yarn add whatwg-fetch promise-polyfill

yarn add types/jss

yarn add @material-ui/core @material-ui/icons

yarn build



