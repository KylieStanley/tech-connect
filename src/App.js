import React, { Component } from 'react';
import LoginScreen from './LoginScreen'
import ProfileScreen from './ProfileScreen'
import ProfilePage from './ProfilePage'
import HomeScreen from './HomeScreen'
import ModalScreen from './ModalScreen'
import MessagesInbox from './MessagesInbox'
import SearchScreen from './SearchScreen'
import NavigationService from '../NavigationService';
import Icon from 'react-native-vector-icons/Feather';
import { createStackNavigator, createAppContainer, createBottomTabNavigator, createSwitchNavigator } from "react-navigation";
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import thunk from 'redux-thunk';
import rootReducer from '../reducers'
import { MenuProvider } from 'react-native-popup-menu'

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

const SecondaryHomeNav = createStackNavigator(
  {
    Home: HomeScreen,
    ProfilePage,
  },
  {
    headerMode: 'none',
    initialRouteName: "Home"
  }
)

const SecondaryProfileNav = createStackNavigator(
  {
    UserProfilePage: {
      screen: ProfilePage,
      params: {
        user: false
      }
    },
    ConnectionProfilePage: ProfilePage
  },
  {
    headerMode: 'none',
    initialRouteName: "UserProfilePage"
  }
)

const AppNavBar = createBottomTabNavigator(
  {
    Home: SecondaryHomeNav,
    Profile: SecondaryProfileNav,
    Messages: MessagesInbox,
    Search: SearchScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'home'
        } else if (routeName === 'Profile') {
          iconName = 'user'
        } else if (routeName === 'Messages') {
          iconName = 'message-circle'
        } else if (routeName === 'Schedule') {
          iconName = 'calendar'
        } else if (routeName === 'Search') {
          iconName = 'search'
        }

        return <Icon name={iconName} size={25} color={tintColor} />;
      }
    }),
    tabBarOptions: {
      activeTintColor: '#4AA9C5',
      inactiveTintColor: 'gray',
    }
  }
)


const AppNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    NavBar: AppNavBar,
    EditProfile: ProfileScreen
  },
  {
    headerMode: 'none',
    initialRouteName: "Login"
  }
)

const RootStack = createStackNavigator(
  {
    Main: {
      screen: AppNavigator,
    },
    Modal: {
      screen: ModalScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);


const AppContainer = createAppContainer(RootStack)

export default class App extends Component {
    
  render() {
    return (
        <MenuProvider>
      <Provider store={ store }>
          <AppContainer 
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
      </Provider>
        </MenuProvider>
    );
  }
}



