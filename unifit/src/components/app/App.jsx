import { DrawerActions, NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../home/home';

const Drawer = createDrawerNavigator();

const Tema = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#595959', // A sua cor
    card: '#ffffff',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={Tema}>
      <Drawer.Navigator initialRouteName="Home"
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#262424',
          },
          drawerActiveTintColor: '#D96600',
          drawerInactiveTintColor: '#FFFFFF'
        }}
      >
        <Drawer.Screen name="Home" component={Home}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});
