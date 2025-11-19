import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTreinoProgramacao } from '../useTreinoProgramacao/useTreinoProgramacao';

export default function Home() {

  const navigation = useNavigation();

  const usarDiaReal = false; 
  const { nomeTreino, listaExerciciosDoDia } = useTreinoProgramacao("user_1234", usarDiaReal);
  
  const diaIndex = usarDiaReal ? new Date().getDay() : 1; 
  const idDiaHoje = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'][diaIndex];

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
                    data={listaExerciciosDoDia}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                      <Text style={styles.listItemText}>• {item.nome}</Text>
                    )}
                    contentContainerStyle={styles.listContainer}
                  />
                </TouchableOpacity>
            </View>
            
            <View>
                <Text style={styles.textUpContainer}>Ranking</Text>
                <View style={styles.containerBranco}>
                  
                  <Text style={styles.listRanking}>
                    Posição:<br/>
                    Dias Ativos:<br/>
                    Pontos:
                  </Text>
                </View>
            </View>
        </View>
    </View>
  );
}


const styles = StyleSheet.create({

  containerPrincipal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  containerGeral: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50,
    width: '100%',
  },

  containerBranco: {
    backgroundColor: '#ffffff',
    width: 300,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    justifyContent: 'center', 
    alignItems: 'center',
  },

  textUpContainer: {
    color:'#ffff',
    marginLeft:10,
    marginBottom:5,
    fontSize: 18, 
    fontWeight: 'bold',
  },

  listContainer: {
    padding: 15,
  },
  listItemText: {
    fontSize: 15,
    color: '#333333ff',
    marginBottom: 10, 
  },
  listRanking: {
    fontSize: 15,
    color: '#333333ff',
    textAlign: 'left',
    padding: 15,
  }

});