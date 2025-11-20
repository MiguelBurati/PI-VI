import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dbUsuariosDefault from '../../assets/data/dbUsuarios.json';

const STORAGE_KEY = '@unifit_usuarios';
const AUTH_KEY = '@unifit_auth_user_id';

const UserContext = createContext({});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState(dbUsuariosDefault);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const loadUsersAndAuth = useCallback(async () => {
        setIsLoading(true);
        try {
            const storedData = await AsyncStorage.getItem(STORAGE_KEY);
            let parsedUsers = dbUsuariosDefault;

            if (storedData) {
                try {
                    const data = JSON.parse(storedData);

                    if (data && Object.keys(data).length > 0) {
                        parsedUsers = data;
                    }
                } catch (e) {
                    console.error("JSON inválido, usando padrão.");
                }
            }

            if (!parsedUsers['user_1234']) {
                parsedUsers = { ...parsedUsers, ...dbUsuariosDefault };
            }
            
            setUsers(parsedUsers);

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsedUsers));

            const lastUserId = await AsyncStorage.getItem(AUTH_KEY);
            if (lastUserId && parsedUsers[lastUserId]) {
                console.log("Login automático:", lastUserId);
                setCurrentUser(parsedUsers[lastUserId]);
            } else if (parsedUsers['user_1234']) {

                setCurrentUser(parsedUsers['user_1234']);
            }

        } catch (error) {
            console.error("Erro fatal no Context:", error);
            setUsers(dbUsuariosDefault);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsersAndAuth();
    }, [loadUsersAndAuth]);

    const login = async (userId) => {
        if (users && users[userId]) {
            setCurrentUser(users[userId]);
            await AsyncStorage.setItem(AUTH_KEY, userId);
            return true;
        }
        return false;
    };

    const logout = async () => {
        setCurrentUser(null);
        await AsyncStorage.removeItem(AUTH_KEY);
    };

    const saveUser = async (userData, idToUpdate) => {

        const userId = idToUpdate || `user_${Date.now()}`;
        
        setUsers(prevUsers => {
            const safeUsers = prevUsers || {};

            const existingProgramacao = safeUsers[userId]?.programacaoSemanal || [];
            const newProgramacao = userData.programacaoSemanal || existingProgramacao;

            const newUserEntry = {
                usuario: {
                    nome: userData.nome,
                    id: userData.id || userId.replace('user_', ''),
                    matricula: userData.matricula !== undefined ? userData.matricula : true,
                    fotoUri: userData.fotoUri || null,
                },
                programacaoSemanal: newProgramacao.length > 0 ? newProgramacao : [],
            };

            const updatedUsers = { ...safeUsers, [userId]: newUserEntry };

            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers))
                .catch(e => console.error("Erro ao salvar:", e));

            if (currentUser && `user_${currentUser.usuario.id}` === userId) {
                setCurrentUser(newUserEntry);
            }

            return updatedUsers;
        });

        return userId;
    };

    const deleteUser = async (userId) => {
        setUsers(prevUsers => {
            const updatedUsers = { ...prevUsers };
            delete updatedUsers[userId];

            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));

            if (currentUser && `user_${currentUser.usuario.id}` === userId) {
                setCurrentUser(null);
                AsyncStorage.removeItem(AUTH_KEY);
            }

            return updatedUsers;
        });
    };

    const resetUsers = async () => {
        setIsLoading(true);
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dbUsuariosDefault));
            setUsers(dbUsuariosDefault);
            
            if (dbUsuariosDefault['user_1234']) {
                setCurrentUser(dbUsuariosDefault['user_1234']);
                await AsyncStorage.setItem(AUTH_KEY, 'user_1234');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ 
            users, 
            currentUser, 
            isLoading, 
            login, 
            logout, 
            saveUser, 
            deleteUser, 
            resetUsers 
        }}>
            {children}
        </UserContext.Provider>
    );
};