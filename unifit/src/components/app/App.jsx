import { DrawerActions, NavigationContainer, DefaultTheme } from '@react-navigation/native';

import { StyleSheet, Text, View, Image } from 'react-native';

import { 
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList
 } from '@react-navigation/drawer';

//import das telas 
import Home from '../home/home';
import Programacao from '../programacao/programacao';
import Treino from '../treino/treino';

//criar a navegacao com drawer
const Drawer = createDrawerNavigator();

//refazer drawer pra por a imagem
function CustomDrawerContent(props) {
  const fakeUser = {
    nome: "Beutrano",
    id: "#0001",
    foto: require('../../../assets/users/user01.jpeg')
  };

  return(
    <DrawerContentScrollView
      {...props}
      style={{backgroundColor: '#262424', flex: 1}}
      contentContainerStyle={{ paddingTop: 0}}
    >

      <View style={styles.userInfoContainer}>
        <Image source={fakeUser.foto} style={styles.userImage} />
        <View>
          <Text style={styles.userName}>{fakeUser.nome}</Text>
          <Text style={styles.userId}>{fakeUser.id}</Text>
        </View>
      </View>
      <DrawerItemList {...props}/>

    </DrawerContentScrollView>
  );
}

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
    <NavigationContainer theme={Tema} >
      <Drawer.Navigator
        initialRouteName="Home"
        
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        
        screenOptions={{

          drawerActiveTintColor: '#D96600',
          
          drawerInactiveTintColor: '#FFFFFF',
          
          headerStyle: {
            height: 40,
            backgroundColor: '#ffffff'
          },
          
          headerTintColor: '#000000ff',
        }}
      >
        <Drawer.Screen name="Home" component={Home}/>
        <Drawer.Screen name="Programacao" component={Programacao}/>
        <Drawer.Screen name="Treino" component={Treino}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20, 
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    marginBottom: 10,
  },

  userImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 15, 
  },

  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  userId: {
    fontSize: 14,
    color: '#CCCCCC',
  },

});
