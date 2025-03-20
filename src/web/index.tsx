import { AppRegistry } from 'react-native';
import App from '../App.web';

AppRegistry.registerComponent('FableTongue', () => App);
AppRegistry.runApplication('FableTongue', {
  initialProps: {},
  rootTag: document.getElementById('root')
}); 