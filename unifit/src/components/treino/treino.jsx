import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, SafeAreaView, Linking } from 'react-native'; 
import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; 
import { useUser } from '../../context/UserContext'; 
import dbExercicios from '../../../assets/data/dbExercicios.json'; 

const ExercicioAcordeao = ({ exercicio }) => {
    const [expandido, setExpandido] = useState(false); 

    const [cargas, setCargas] = useState(
      Array(exercicio.series).fill(exercicio.carga || '')
    );

    const handleVideoPress = () => {
        const videoUri = dbExercicios[exercicio.id] ? dbExercicios[exercicio.id].videoUri : null;
        
        if (videoUri) {
            Linking.openURL(videoUri).catch(err => console.error("Erro ao abrir link", err));
        } else {
            alert("Vídeo não disponível para este exercício.");
        }
    };

    const renderSeries = () => {
        const seriesArray = Array.from({ length: exercicio.series }, (_, i) => i + 1);
        
        return seriesArray.map((numSerie, index) => (
            <View key={index} style={styles.serieRow}>
                <Text style={styles.serieText}>Série {numSerie}:</Text>
                
                <Text style={styles.repeticoesText}>
                  {exercicio.repeticoes} Repetições
                </Text>
                
                <TextInput
                    style={styles.cargaInput}
                    keyboardType='numeric'
                    placeholder='Kg'
                    placeholderTextColor="#999"
                    value={cargas[index]}
                    onChangeText={(text) => {
                      const newCargas = [...cargas];
                      newCargas[index] = text;
                      setCargas(newCargas);
                    }}
                />
            </View>
        ));
    };

    return (
        <View style={styles.exercicioCard}>
            <TouchableOpacity 
                onPress={() => setExpandido(!expandido)}
                style={styles.headerAcordeao}
            >
                <Text style={styles.nomeExercicio}>{exercicio.nome}</Text>
                
               
                <TouchableOpacity onPress={handleVideoPress} style={styles.videoIconContainer}>
                    <FontAwesome name="play-circle" size={28} color="#D96600" /> 
                </TouchableOpacity>

                
                <FontAwesome 
                    name={expandido ? "angle-up" : "angle-down"} 
                    size={24} 
                    color="#555" 
                />
            </TouchableOpacity>

            {expandido && (
                <View style={styles.conteudoAcordeao}>
                    {renderSeries()}
                    <Text style={styles.pontosText}>Pontos: 10</Text>
                </View>
            )}
        </View>
    );
};

export default function Treino() {
    const route = useRoute();
    const { diaId } = route.params || {}; 
    const { currentUser } = useUser(); 

    if (!currentUser) return (
        <SafeAreaView style={styles.containerPrincipal}>
            <Text style={styles.screenTitle}>Erro: Usuário não logado</Text>
        </SafeAreaView>
    );

 
    const idDoDia = diaId || 'seg';
    const treinoDoDia = currentUser.programacaoSemanal.find(dia => dia.idDia === idDoDia);
    
    let listaExercicios = [];
    let nomeTreino = "Treino";

    if (treinoDoDia) {
        nomeTreino = treinoDoDia.nomeTreino;
        if (treinoDoDia.exercicios.length > 0) {
            listaExercicios = treinoDoDia.exercicios.map(prescrito => {
                const info = dbExercicios[prescrito.idEx];
                return { 
                    ...prescrito, 
                    id: prescrito.idEx, 
                    nome: info ? info.nome : 'Ex. Não encontrado' 
                };
            });
        } else {
            
             listaExercicios = [{ id: 'descanso', nome: 'Descanso. Aproveite!' }];
        }
    }

    return (
        <SafeAreaView style={styles.containerPrincipal}>
            <Text style={styles.screenTitle}>
                {treinoDoDia ? `Treino de ${nomeTreino}` : 'Carregando...'}
            </Text>
            
            <FlatList
                data={listaExercicios}
                keyExtractor={(item) => item.id}
   
                renderItem={({ item }) => {
                    if (item.id === 'descanso') {
                        return <Text style={{color:'#fff', textAlign:'center', marginTop: 20}}>{item.nome}</Text>
                    }
                    return <ExercicioAcordeao exercicio={item} />
                }} 
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    containerPrincipal: {
        flex: 1,
        backgroundColor: '#595959', 
        paddingTop: 10,
    },
    screenTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginVertical: 10,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 30, 
    },
    
    exercicioCard: {
        backgroundColor: '#444444', 
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden', 
        borderWidth: 1,
        borderColor: '#666',
    },
    headerAcordeao: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#ffffff', 
    },
    nomeExercicio: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1, 
    },
    videoIconContainer: {
        marginLeft: 10, 
        marginRight: 10, 
    },
    conteudoAcordeao: {
        padding: 15,
        backgroundColor: '#f9f9f9', 
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    pontosText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#D96600',
        marginTop: 10,
        textAlign: 'right',
    },
    serieRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    serieText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        width: '20%',
    },
    repeticoesText: {
        fontSize: 14,
        color: '#555',
        width: '35%',
        textAlign: 'right',
    },
    cargaInput: {
        width: '25%',
        height: 35,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        textAlign: 'center',
        fontSize: 14,
        backgroundColor: '#ffffff',
    },
});