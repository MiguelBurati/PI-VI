import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext'; 

export default function Login() {
    
    const navigation = useNavigation();
    const { login, users } = useUser(); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLogin = async () => {
        console.log("Tentando logar...");
        const success = await login("user_1234"); 
        
        if (success) {
            navigation.navigate('MainApp');
        } else {

            const allKeys = users ? Object.keys(users) : [];
            if (allKeys.length > 0) {
                await login(allKeys[0]);
                navigation.navigate('MainApp');
            } else {
                Alert.alert("Erro de Dados", "Nenhum usuário encontrado. Entre como ADM e restaure os dados.");
            }
        }
    };

    const handleAdminLogin = async () => {
        const safeUsers = users || {};
        const firstUserKey = Object.keys(safeUsers)[0];
        
        if (firstUserKey) {
            await login(firstUserKey);
        }
        
        navigation.navigate('MainApp', { 
             screen: 'AdminUsuarios', 
        });
    };

    return (
        <SafeAreaView style={styles.containerPrincipal}>
            <View style={styles.content}>
                <Text style={styles.title}>Login</Text>
                <Text style={styles.inputLabel}>Email ou nº de telefone</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholderTextColor="#999" autoCapitalize="none" />
                <Text style={styles.inputLabel}>Senha</Text>
                <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#999" />
                
                <TouchableOpacity onPress={() => Alert.alert('Ops!', 'Funcionalidade a ser implementada.')} style={styles.forgotPasswordContainer}>
                    <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.adminLinkContainer} onPress={handleAdminLogin}>
                    <Text style={styles.adminLinkText}>Entrar como adm</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    containerPrincipal: { flex: 1, backgroundColor: '#595959' },
    content: { flex: 1, padding: 30, justifyContent: 'center' },
    title: { fontSize: 40, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 50 },
    inputLabel: { fontSize: 16, color: '#CCCCCC', marginBottom: 5 },
    input: { backgroundColor: '#FFFFFF', height: 50, borderRadius: 8, paddingHorizontal: 15, marginBottom: 20, fontSize: 16 },
    forgotPasswordContainer: { alignSelf: 'flex-end', marginBottom: 30 },
    forgotPasswordText: { color: '#FFFFFF', textDecorationLine: 'underline' },
    loginButton: { backgroundColor: '#D96600', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 40, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 6 },
    loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
    adminLinkContainer: { marginTop: 20, alignItems: 'center' },
    adminLinkText: { color: '#FFFFFF', textDecorationLine: 'underline', fontSize: 16 },
});