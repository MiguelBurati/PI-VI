import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {useTreinoProgramacao} from '../useTreinoProgramacao/useTreinoProgramacao';

const ItemData = ({dia, nomeTreino, isSelected, onPress}) => {
  // Estilos dinâmicos baseados na seleção
  const itemStyle = [
    styles.containerDiaSemana,
    {
      backgroundColor: isSelected ? '#d96600' : '#ffffff',
      borderColor: isSelected ? '#d96600' : '#e0e0e0',
    }
  ];

  const textStyle = {
    color: isSelected ? '#ffffff' : '#333333',
    fontWeight: isSelected ? 'bold' : 'normal',
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

  const [diaSelecionado, setDiaSelecionado] = useState('seg');

  const {programacaoSemanalCompleta} = useTreinoProgramacao('user_1234', true);

  const cliqueDia = (dia) => {
    setDiaSelecionado(dia.idDia);

    navigation.navigate('Treino', {diaId: dia.idDia});
  }

  return (
    <View style={styles.containerPrincipal}>
        <View style={styles.containerBranco}>
          <FlatList
            data = {programacaoSemanalCompleta}
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
  
  containerPrincipal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  containerBranco: {
    backgroundColor: '#ffffff',
    width: '90%',
    height: 'auto',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    paddingTop: 15,
    paddingBottom: 15,
  },

  containerDiaSemana: {
    padding: 10,
    borderWidth: 1,
    width: '100%',
    height: 70,
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 12,
  },

  textDiaSemana: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  textExercicioDia: {
    fontSize: 14,
    marginLeft: 10,
  },

  listContainer: {
    flexGrow: 1,
    alignSelf: 'stretch',
    paddingHorizontal: 15,
  }

});