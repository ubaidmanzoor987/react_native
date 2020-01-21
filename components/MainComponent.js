import React, { Component } from 'react';
import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import {View,Platform} from 'react-native';
import {createAppContainer,SafeAreaView} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import {createDrawerNavigator} from 'react-navigation-drawer';
import About from './AboutComponent';
const MyHeader = (navigation) => {
    return{
        headerStyle : {
            backgroundColor:'#512DA8',
        },
        headerTintColor:'#fff',
        headerTitleStyle:{
            color:"#fff"
        }
    };
}

const MenuNavigator = createAppContainer(createStackNavigator({
    Menu:{screen:Menu},
    Dishdetail:{screen:Dishdetail}
},{
    initialRouteName:"Menu",
    defaultNavigationOptions : ({navigation})=>{
        return MyHeader(navigation)
    }
}));

const HomeNavigator = createAppContainer(createStackNavigator({
    Home:{screen:Home},
    
},{
    initialRouteName:"Home",
    defaultNavigationOptions : ({navigation})=>{
        return MyHeader(navigation)
    }
}));
const AboutNavigator = createAppContainer(createStackNavigator({
    About:{screen:About},
    
},{
    initialRouteName:"About",
    defaultNavigationOptions : ({navigation})=>{
        return MyHeader(navigation)
    }
}));
const ContactNavigator = createAppContainer(createStackNavigator({
    Contact:{screen:Contact},
    
},{
    initialRouteName:"Contact",
    defaultNavigationOptions : ({navigation})=>{
        return MyHeader(navigation)
    }
}));
const MainNavigator = createAppContainer(createDrawerNavigator({
    Home: 
      { screen: HomeNavigator,
        navigationOptions: {
          title: 'Home',
          drawerLabel: 'Home'
        }
      },
    About: 
      { screen: AboutNavigator,
        navigationOptions: {
          title: 'About Us',
          drawerLabel: 'About Us'
        }, 
      },
    Menu: 
      { screen: MenuNavigator,
        navigationOptions: {
          title: 'Menu',
          drawerLabel: 'Menu'
        }, 
      },
    Contact: 
      { screen: ContactNavigator,
        navigationOptions: {
          title: 'Contact Us',
          drawerLabel: 'Contact Us'
        }, 
      }
}, {
  drawerBackgroundColor: '#D1C4E9'
}));
class Main extends Component {
  
  render() {
    return (
       
        <View style={{flex:1 , paddingTop:Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight}}>
            <MainNavigator />
        </View>
     
    );
  }
}
  
export default Main;