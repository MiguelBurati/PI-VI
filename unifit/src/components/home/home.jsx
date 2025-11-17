import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <View>
        <View style={styles.containerGeral}>
            <View>
              <Text style={{color:'#ffff'}}>Treino do Dia</Text>
              <View style={styles.containerTreinoDia}></View>
            </View>
            <View>
              <Text style={{color:'#ffff'}}>Ranking</Text>
              <View style={styles.containerTreinoDia}></View>
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({

  containerGeral: {
    flex: 1,
    margin: 'auto',
  },

  containerTreinoDia: {
    backgroundColor: '#ffffff',
    width: 300,
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
  }
});