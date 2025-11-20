import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native'; 
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'; 
import { createStackNavigator } from '@react-navigation/stack'; 


import Login from '../login/login';
import Home from '../home/home';
import Programacao from '../programacao/programacao';
import Treino from '../treino/treino'; 
import AdminUsuarios from '../adminUsuarios/adminUsuarios';

import { UserProvider, useUser } from '../../context/UserContext'; 

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator(); 

const Tema = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#595959', 
    card: '#ffffff',
  },
};

function CustomDrawerContent(props) { 
    const { currentUser } = useUser(); 


    const nomeUsuario = currentUser?.usuario?.nome || "Visitante";
    const idUsuario = currentUser?.usuario?.id || "---";
    const fotoUri = currentUser?.usuario?.fotoUri; 

    const FALLBACK_IMAGE = require('../../../assets/logo unifit.jpg');
    const fotoSource = fotoUri ? { uri: fotoUri } : FALLBACK_IMAGE;

    return(
        <DrawerContentScrollView
            {...props}
            style={{backgroundColor: '#262424', flex: 1}}
            contentContainerStyle={{ paddingTop: 0}}
        >
            <View style={styles.userInfoContainer}>
                <Image source={fotoSource} style={styles.userImage} /> 
                <View>
                    <Text style={styles.userName}>{nomeUsuario}</Text>
                    <Text style={styles.userId}>#{idUsuario}</Text>
                </View>
            </View>
            <DrawerItemList {...props}/>
        </DrawerContentScrollView>
    );
}

function MainDrawerScreen() {
    return (
        <Drawer.Navigator 
            initialRouteName="Home"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerActiveTintColor: '#D96600',
                drawerInactiveTintColor: '#FFFFFF',
                headerStyle: { height: 60, backgroundColor: '#ffffff' },
                headerTintColor: '#000000',
            }}
        >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Programacao" component={Programacao} />
            <Drawer.Screen name="Treino" component={Treino} />
            <Drawer.Screen name="AdminUsuarios" component={AdminUsuarios} options={{ title: 'Adm. Usuários' }} />
        </Drawer.Navigator>
    );
}

const AppContent = () => {
    const { isLoading } = useUser();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#D96600" />
                <Text style={styles.loadingText}>Carregando dados...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer theme={Tema}>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen 
                    name="Login" 
                    component={Login} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="MainApp" 
                    component={MainDrawerScreen} 
                    options={{ headerShown: false }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default function App() {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
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
        borderRadius: 20, 
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#595959',
    },
    loadingText: {
        marginTop: 10,
        color: '#FFFFFF',
        fontSize: 16,
    }
});