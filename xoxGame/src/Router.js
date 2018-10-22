import { createStackNavigator } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import AloneGame from './screens/AloneGame';
import FriendGame from './screens/FriendGame';
import NetworkGame from './screens/NetworkGame';

//This variable holds our screens in a stack navigator. It will be used in App.js as <Router />
const Router = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    GameScreen: {
      screen: FriendGame,
    },
    AloneGame: {
      screen: AloneGame
    },
    NetworkGame: {
      screen: NetworkGame
    }
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      header: null
    }
  }
);

export default Router;
