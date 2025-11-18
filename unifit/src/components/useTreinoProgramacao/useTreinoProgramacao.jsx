import dbExercicios from "../../../assets/data/dbExercicios.json"
import dbUsuarios from '../../../assets/data/dbUsuarios.json';
import { useState, useEffect } from 'react';

/**
 * Custom Hook para buscar e processar os dados de treino do usuário logado.
 * * @param {string} idUsuarioLogado
 * @param {boolean} usarDiaReal 
 * @returns {{
 * listaExerciciosDoDia: Array, 
 * nomeTreino: string, 
 * diaDaSemana: string, 
 * programacaoSemanalCompleta: Array // <-- Adicionado para a tela de Programação
 * }}
 */
export const useTreinoProgramacao = (idUsuarioLogado, usarDiaReal = true) => {
    
    const [dadosTreino, setDadosTreino] = useState({
        listaExerciciosDoDia: [{ id: 'carregando', nome: 'Carregando treino...' }],
        nomeTreino: 'Carregando...',
        diaDaSemana: '...',
        programacaoSemanalCompleta: []
    });

    // Variável temporária para armazenar a lista completa fora do estado
    let programacaoCompleta = []; 

    useEffect(() => {
        
        let listaExercicios = [];
        let nomeTreinoAtual = "Descanso";
        let diaDaSemanaAtual = "";

        try {
            // LÓGICA DE BUSCA DE DADOS
            const dadosUsuario = dbUsuarios[idUsuarioLogado];
            
            programacaoCompleta = dadosUsuario.programacaoSemanal; 
            
            // LÓGICA DE BUSCA DO DIA
            let diaIndex;
            if (usarDiaReal) {
                diaIndex = new Date().getDay();
            } else {
                diaIndex = 1; 
            }
            
            const idDiaHoje = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'][diaIndex];
            
            const treinoDoDia = dadosUsuario.programacaoSemanal.find(dia => dia.idDia === idDiaHoje);

            if (treinoDoDia && treinoDoDia.exercicios.length > 0) {
                
                nomeTreinoAtual = treinoDoDia.nomeTreino; 
                diaDaSemanaAtual = treinoDoDia.diaDaSemana;

                listaExercicios = treinoDoDia.exercicios.map(prescrito => {
                    const infoExercicio = dbExercicios[prescrito.idEx];

                    if (!infoExercicio) {
                        console.warn(`Exercício com ID "${prescrito.idEx}" não encontrado!`);
                        return { id: prescrito.idEx, nome: `Erro: Ex ${prescrito.idEx} não encontrado` };
                    }
                    
                    return {
                        id: prescrito.idEx,
                        nome: infoExercicio.nome,
                        series: prescrito.series,
                        repeticoes: prescrito.repeticoes,
                        carga: prescrito.carga,
                    };
                });
            } else {
                nomeTreinoAtual = treinoDoDia ? treinoDoDia.nomeTreino : "Descanso"; 
                diaDaSemanaAtual = treinoDoDia ? treinoDoDia.diaDaSemana : "";
                listaExercicios = [{ id: 'descanso', nome: nomeTreinoAtual }];
            }

        } catch (error) {
            console.error("Erro CRÍTICO ao carregar treinos:", error);
            listaExercicios = [{ id: 'erro', nome: 'Erro ao carregar dados.' }];
            nomeTreinoAtual = "Erro";
            diaDaSemanaAtual = "Erro";
            programacaoCompleta = [];
        }
        
        // Atualiza o estado com os dados finais
        setDadosTreino({
            listaExerciciosDoDia: listaExercicios,
            nomeTreino: nomeTreinoAtual,
            diaDaSemana: diaDaSemanaAtual,
            programacaoSemanalCompleta: programacaoCompleta 
        });

    }, [idUsuarioLogado, usarDiaReal]);
    
    return dadosTreino;
};