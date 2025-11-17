import { StyleSheet, Text, View, FlatList } from 'react-native';

// --- CORREÇÃO 1 e 2: Caminho e sintaxe da importação ---
import dbExercicios from "../../../assets/data/dbExercicios.json";
import dbUsuarios from '../../../assets/data/dbUsuarios.json';

export default function Home() {

  let listaExerciciosDoDia = [];
  let nomeDoTreino = "Descanso"; // Começa com um padrão

  try {
    const idUsuarioLogado = "user_1234"; // Simulação do ID do usuário logado

    // --- CORREÇÃO 3: getDate() mudado de volta para getDay() ---
    // const diaIndex = new Date().getDay(); // Pega o dia de hoje
    const diaIndex = 1 // Deixei seu teste para "Segunda-feira"

    const idDiaHoje = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'][diaIndex]; 

    const dadosUsuario = dbUsuarios[idUsuarioLogado];
    const treinoDoDia = dadosUsuario.programacaoSemanal.find(dia => dia.idDia === idDiaHoje);

    if (treinoDoDia && treinoDoDia.exercicios.length > 0) {
      
      nomeDoTreino = treinoDoDia.nomeTreino; // Pega o nome do treino (ex: "Perna")

      listaExerciciosDoDia = treinoDoDia.exercicios.map(prescrito => {
        const infoExercicio = dbExercicios[prescrito.idEx];

        // --- CÓDIGO DE SEGURANÇA (RE-ADICIONADO) ---
        // Se o ID do exercício não for encontrado no dbExercicios.json,
        // o app não vai quebrar.
        if (!infoExercicio) {
          console.warn(`Exercício com ID "${prescrito.idEx}" não encontrado no dbExercicios.json!`);
          return {
            id: prescrito.idEx,
            nome: `Erro: Exercício ${prescrito.idEx} não encontrado`
          };
        }

        return{
          id: prescrito.idEx,
          nome: infoExercicio.nome,
        };
      });
    } else {
      listaExerciciosDoDia = [{id: 'descanso', nome: 'Descanso'}];
    }
  } catch (error) {
    // Se qualquer coisa acima falhar, a tela não vai ficar branca
    console.error("Erro CRÍTICO ao carregar treinos:", error);
    listaExerciciosDoDia = [{ id: 'erro', nome: 'Erro ao carregar o treino.' }];
    nomeDoTreino = "Erro";
  }

  return (
    <View style={styles.containerPrincipal}>
        <View style={styles.containerGeral}>
            <View>
                <Text style={styles.textUpContainer}>Treino do Dia</Text>
                <View style={styles.containerBranco}>
                  <FlatList
                    data={listaExerciciosDoDia}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                      <Text style={styles.listItemText}>{item.nome}</Text>
                    )}
                    contentContainerStyle={styles.listContainer}
                  />
                </View>
            </View>
            <View>
                <Text style={styles.textUpContainer}>Ranking</Text>
                <View style={styles.containerBranco}></View>
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
    borderColor: '#000000ff',
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
    fontSize: 16,
    color: '#333333ff',
    marginBottom: 10, 
  }

});