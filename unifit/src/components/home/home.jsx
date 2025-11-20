import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import dbExercicios from '../../../assets/data/dbExercicios.json'; 

export default function Home() {
  const navigation = useNavigation();
  const { currentUser } = useUser();

  if (!currentUser) {
      return (
        <View style={styles.containerPrincipal}>
            <Text style={{color:'#fff'}}>Carregando usuário...</Text>
        </View>
      );
  }

  const usarDiaReal = false; 
  const diaIndex = usarDiaReal ? new Date().getDay() : 1; 
  const idDiaHoje = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'][diaIndex];

  const treinoDoDia = currentUser.programacaoSemanal.find(dia => dia.idDia === idDiaHoje);
  const nomeTreino = treinoDoDia ? treinoDoDia.nomeTreino : "Descanso";

  let listaExercicios = [];
  if (treinoDoDia && treinoDoDia.exercicios.length > 0) {
      listaExercicios = treinoDoDia.exercicios.map(prescrito => {
          const info = dbExercicios[prescrito.idEx];
          return { id: prescrito.idEx, nome: info ? info.nome : "Desconhecido" };
      });
  } else {
      listaExercicios = [{ id: 'descanso', nome: 'Descanso' }];
  }

  return (
    <View style={styles.containerPrincipal}>
        <View style={styles.containerGeral}>
            <View>
                <Text style={styles.textUpContainer}>Treino de {nomeTreino}</Text>
                <TouchableOpacity 
                    style={styles.containerBranco} 
                    onPress={() => navigation.navigate('Treino', { diaId: idDiaHoje })}
                >
                  <FlatList
                    data={listaExercicios}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => <Text style={styles.listItemText}>• {item.nome}</Text>}
                    contentContainerStyle={styles.listContainer}
                  />
                </TouchableOpacity>
            </View>
            <View>
                <Text style={styles.textUpContainer}>Ranking</Text>
                <View style={styles.containerBranco}>
                  <Text style={styles.listRanking}>Posição: 5º{'\n'}Dias Ativos: 25{'\n'}Pontos: 1250</Text>
                </View>
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  containerGeral: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 50, width: '100%' },
  containerBranco: { backgroundColor: '#ffffff', width: 300, height: 200, borderRadius: 10, borderWidth: 2, borderColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  textUpContainer: { color:'#ffff', marginLeft:10, marginBottom:5, fontSize: 18, fontWeight: 'bold' },
  listContainer: { padding: 15 },
  listItemText: { fontSize: 15, color: '#333333ff', marginBottom: 10 },
  listRanking: { fontSize: 15, color: '#333333ff', textAlign: 'left', padding: 15 },
});