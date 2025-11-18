import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';


import { useTreinoProgramacao } from '../useTreinoProgramacao/useTreinoProgramacao';

import Treino from '../treino/treino.jsx';
import { useNavigation } from '@react-navigation/native';

export default function Home() {

  const navigation = useNavigation();

  const { nomeTreino, listaExerciciosDoDia } = useTreinoProgramacao("user_1234", false);

  
  return (
    <View style={styles.containerPrincipal}>
        <View style={styles.containerGeral}>
            <View>
                <Text style={styles.textUpContainer}>Treino do Dia</Text>
                <TouchableOpacity style={styles.containerBranco} onPress={() => navigation.navigate('Treino')}>
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
                  <Text style={styles.listRanking}>Posição:<br/>Dias:<br/>Pontos:<br/></Text>
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
  },

  containerBranco: {
    backgroundColor: '#ffffff',
    width: 300,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },

  textUpContainer: {
    color:'#ffff',
    marginLeft:10,
    marginBottom:5,
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
    margin:'auto', 
    
  }

});