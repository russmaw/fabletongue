require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  presets: ['babel-preset-expo'],
});

module.exports = require('./App.tsx'); 