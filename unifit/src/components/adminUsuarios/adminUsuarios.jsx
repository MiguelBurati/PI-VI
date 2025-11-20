import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal, ScrollView, Platform } from 'react-native';
import { useUser } from '../../context/UserContext';

const UserItem = ({ user, onDelete, onEditSelect, onEditSchedule }) => (
    <View style={styles.userCard}>
        <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.usuario.nome}</Text>
            <Text style={styles.userId}>ID: #{user.usuario.id} | Matrícula: {user.usuario.matricula ? 'Ativa' : 'Inativa'}</Text>
        </View>
        <View style={styles.userActions}>
            <TouchableOpacity onPress={() => onEditSchedule(user)} style={[styles.actionButton, styles.scheduleButton]}>
                <Text style={styles.actionText}>Treinos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onEditSelect(user)} style={[styles.actionButton, styles.editButton]}>
                <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(user)} style={[styles.actionButton, styles.deleteButton]}>
                <Text style={styles.actionText}>Deletar</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default function AdminUsuarios() {
    
    const { users, isLoading, saveUser, deleteUser, resetUsers } = useUser();

    const [nome, setNome] = useState('');
    const [matriculaStatus, setMatriculaStatus] = useState(true);
    const [editingUserId, setEditingUserId] = useState(null); 
    
    const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
    const [userToEditSchedule, setUserToEditSchedule] = useState(null);

    const usersArray = users ? Object.entries(users).map(([key, value]) => ({
        ...value,
        originalKey: key 
    })) : [];

    const handleEditSelect = (userItem) => {
        setEditingUserId(userItem.originalKey); 
        setNome(userItem.usuario.nome);
        setMatriculaStatus(userItem.usuario.matricula);
    };

    const clearForm = () => {
        setEditingUserId(null);
        setNome('');
        setMatriculaStatus(true);
    };

    const handleSave = async () => {
        if (!nome) {
            Alert.alert("Erro", "O nome do usuário não pode ser vazio.");
            return;
        }

        const currentUserData = editingUserId ? users[editingUserId] : {};
        
        const defaultSchedule = [
             { idDia: "dom", diaDaSemana: "Domingo", nomeTreino: "Descanso", exercicios: [] },
             { idDia: "seg", diaDaSemana: "Segunda-feira", nomeTreino: "A Definir", exercicios: [] },
             { idDia: "ter", diaDaSemana: "Terça-feira", nomeTreino: "A Definir", exercicios: [] },
             { idDia: "qua", diaDaSemana: "Quarta-feira", nomeTreino: "A Definir", exercicios: [] },
             { idDia: "qui", diaDaSemana: "Quinta-feira", nomeTreino: "A Definir", exercicios: [] },
             { idDia: "sex", diaDaSemana: "Sexta-feira", nomeTreino: "A Definir", exercicios: [] },
             { idDia: "sab", diaDaSemana: "Sábado", nomeTreino: "A Definir", exercicios: [] },
        ];

        const userData = {
            nome: nome,
            matricula: matriculaStatus,
            programacaoSemanal: currentUserData.programacaoSemanal || defaultSchedule 
        };

        const newId = await saveUser(userData, editingUserId);

        if (newId) {
            Alert.alert("Sucesso", `Usuário ${editingUserId ? 'editado' : 'cadastrado'} com sucesso!`);
            clearForm();
        } else {
            Alert.alert("Erro", "Falha ao salvar usuário.");
        }
    };

    const handleDelete = (userToDelete) => {
        if (Platform.OS === 'web') {
            const confirm = window.confirm(`Tem certeza que deseja deletar ${userToDelete.usuario.nome}?`);
            if (confirm) {
                deleteUser(userToDelete.originalKey);
                clearForm();
            }
            return;
        }

        Alert.alert(
            "Confirmação",
            `Tem certeza que deseja deletar o usuário ${userToDelete.usuario.nome}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Deletar", 
                    onPress: () => {
                        deleteUser(userToDelete.originalKey);
                        clearForm();
                    }, 
                    style: "destructive" 
                },
            ]
        );
    };

    const handleResetDatabase = () => {
        if (Platform.OS === 'web') {
            const confirm = window.confirm("Isso restaurará o banco de dados para o JSON original. Deseja continuar?");
            if (confirm) resetUsers();
            return;
        }

        Alert.alert(
            "Restaurar Padrão",
            "Isso apagará TODOS os usuários cadastrados e restaurará os originais do arquivo JSON. Tem certeza?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Restaurar", onPress: resetUsers, style: "destructive" }
            ]
        );
    };
    
    const handleEditSchedule = (user) => {
        setUserToEditSchedule(user);
        setScheduleModalVisible(true);
    };

    const handleCloseScheduleModal = () => {
        setUserToEditSchedule(null);
        setScheduleModalVisible(false);
    };

    const renderScheduleEditor = () => {
        if (!userToEditSchedule) return null;
        
        return (
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Editar Treinos: {userToEditSchedule.usuario.nome}</Text>
                
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                     <Text style={{color: '#D96600', fontWeight: 'bold', fontSize: 18}}>
                         Edição de treino do usuario
                     </Text>
                </View>
                
                <TouchableOpacity onPress={handleCloseScheduleModal} style={styles.modalCloseButton}>
                    <Text style={styles.saveButtonText}>Fechar</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#D96600" />
                <Text style={styles.loadingText}>Carregando dados...</Text>
            </View>
        );
    }
    
    const isEditing = editingUserId !== null;

    return (
        <View style={styles.containerPrincipal}>
            <Text style={styles.titleText}>Administração de Usuários</Text>

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>{isEditing ? 'Editar Usuário' : 'Novo Cadastro'}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nome Completo"
                    placeholderTextColor="#999"
                    value={nome}
                    onChangeText={setNome}
                />
                
                <View style={styles.radioContainer}>
                    <Text style={styles.radioLabel}>Matrícula:</Text>
                    <TouchableOpacity onPress={() => setMatriculaStatus(true)} style={[styles.radioOption, matriculaStatus && styles.radioActive]}>
                        <Text style={[styles.radioText, matriculaStatus && styles.radioTextActive]}>Ativa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setMatriculaStatus(false)} style={[styles.radioOption, !matriculaStatus && styles.radioActive]}>
                        <Text style={[styles.radioText, !matriculaStatus && styles.radioTextActive]}>Inativa</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>{isEditing ? 'Salvar Edição' : 'Cadastrar'}</Text>
                </TouchableOpacity>
                
                {isEditing && (
                    <TouchableOpacity onPress={clearForm} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancelar Edição</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.listTitle}>Usuários Cadastrados ({usersArray.length})</Text>
            <FlatList
                data={usersArray}
                keyExtractor={(item) => item.originalKey}
                renderItem={({ item }) => (
                    <UserItem 
                        user={item} 
                        onDelete={handleDelete} 
                        onEditSelect={handleEditSelect} 
                        onEditSchedule={handleEditSchedule} 
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <TouchableOpacity onPress={handleResetDatabase} style={styles.resetButton}>
                        <Text style={styles.resetButtonText}>Restaurar Dados Originais</Text>
                    </TouchableOpacity>
                }
            />
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={scheduleModalVisible}
                onRequestClose={handleCloseScheduleModal}
            >
                <View style={styles.centeredView}>
                    {renderScheduleEditor()}
                </View>
            </Modal>
        </View>
    );
}

// (Os estilos permanecem os mesmos, apenas a lógica mudou)
const styles = StyleSheet.create({
    containerPrincipal: { flex: 1, backgroundColor: '#f0f0f0', padding: 15 },
    titleText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
    loadingText: { marginTop: 10, color: '#555', fontSize: 16 },
    formContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#ccc' },
    formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    input: { height: 45, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 10, backgroundColor: '#f9f9f9' },
    radioContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, justifyContent: 'space-between' },
    radioLabel: { fontSize: 16, color: '#555' },
    radioOption: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5, borderWidth: 1, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center' },
    radioActive: { backgroundColor: '#D96600', borderColor: '#D96600' },
    radioText: { color: '#555', fontWeight: '500' },
    radioTextActive: { color: '#fff' },
    saveButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
    saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    cancelButton: { backgroundColor: '#ffc107', padding: 12, borderRadius: 5, alignItems: 'center' },
    cancelButtonText: { color: '#333', fontWeight: 'bold', fontSize: 16 },
    listTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    listContent: { paddingBottom: 20 },
    userCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 8, borderLeftWidth: 5, borderLeftColor: '#D96600', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
    userInfo: { flex: 1 },
    userName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    userId: { fontSize: 12, color: '#666' },
    userActions: { flexDirection: 'row', minWidth: 150 },
    actionButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 5, marginLeft: 8 },
    scheduleButton: { backgroundColor: '#00bcd4' },
    editButton: { backgroundColor: '#ffc107' },
    deleteButton: { backgroundColor: '#dc3545' },
    actionText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
    modalContent: { margin: 20, backgroundColor: "white", borderRadius: 20, padding: 35, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, width: '90%', height: '30%' },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    modalCloseButton: { backgroundColor: '#D96600', padding: 15, borderRadius: 10, marginTop: 20, width: '100%', alignItems: 'center' },
    resetButton: { marginTop: 20, marginBottom: 40, backgroundColor: '#6c757d', padding: 12, borderRadius: 8, alignItems: 'center' },
    resetButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});