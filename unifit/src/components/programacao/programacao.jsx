import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';

const ItemData = ({dia, nomeTreino, isSelected, onPress}) => {
  const itemStyle = [ 
      styles.containerDiaSemana, 
      { backgroundColor: isSelected ? '#D96600' : '#ffffff', borderColor: isSelected ? '#D96600' : '#e0e0e0' } 
  ];
  const textStyle = { 
      color: isSelected ? '#ffffff' : '#333333', fontWeight: isSelected ? 'bold' : 'normal' 
  };
  
  return (
    <TouchableOpacity style={itemStyle} onPress={onPress}>
      <Text style={[styles.textDiaSemana, textStyle]}>{dia}</Text>
      <Text style={[styles.textExercicioDia, textStyle]}>{nomeTreino}</Text>
    </TouchableOpacity>
  )
}

export default function Programacao() {
  const navigation = useNavigation();
  const { currentUser } = useUser();
  const [diaSelecionado, setDiaSelecionado] = useState('seg'); 

  if (!currentUser) return null;

  const programacao = currentUser.programacaoSemanal;

  const cliqueDia = (dia) => {
    setDiaSelecionado(dia.idDia);
    navigation.navigate('Treino', { diaId: dia.idDia });
  }

  return (
    <View style={styles.containerPrincipal}> 
        <View style={styles.containerBranco}>
           <Text style={styles.titleText}>Programação</Text> 
           <FlatList
             data={programacao}
             keyExtractor={(item) => item.idDia}
             renderItem={({item}) => (
               <ItemData
                 dia={item.diaDaSemana}
                 nomeTreino={item.nomeTreino}
                 isSelected={item.idDia === diaSelecionado}
                 onPress={() => cliqueDia(item)}
               />
             )}
             contentContainerStyle={styles.listContainer}
             showsVerticalScrollIndicator={false}
           />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: { flex: 1, backgroundColor: '#595959', justifyContent: 'center', alignItems: 'center' },
  containerBranco: { backgroundColor: '#ffffff', width: '90%', height: '85%', borderRadius: 10, borderWidth: 2, borderColor: '#e0e0e0', paddingTop: 15, paddingBottom: 15 },
  titleText: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#333', textAlign: 'center' },
  listContainer: { flexGrow: 1, alignSelf: 'stretch', paddingHorizontal: 15 },
  containerDiaSemana: { padding: 10, borderWidth: 1, width: '100%', height: 70, borderRadius: 8, justifyContent: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 3 },
  textDiaSemana: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  textExercicioDia: { fontSize: 14, marginLeft: 10 },
});