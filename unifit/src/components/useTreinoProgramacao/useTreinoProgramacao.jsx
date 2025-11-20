import dbExercicios from "../../../assets/data/dbExercicios.json";
import { useState, useEffect } from 'react';


/**
 * Custom Hook para buscar e processar os dados de treino do usuário logado.
 * * RECEBE A LISTA DE USUÁRIOS COMO UMA PROP.
 * * @param {object} allUsers - O objeto completo de usuários do useAdminUsuarios.
 * @param {string} idUsuarioLogado
 * @param {boolean} usarDiaReal 
 * @returns {{
 * listaExerciciosDoDia: Array, 
 * nomeTreino: string, 
 * diaDaSemana: string, 
 * programacaoSemanalCompleta: Array 
 * }}
 */
export const useTreinoProgramacao = (allUsers, idUsuarioLogado, usarDiaReal = true) => {
    
    const [dadosTreino, setDadosTreino] = useState({
        listaExerciciosDoDia: [{ id: 'carregando', nome: 'Carregando treino...' }],
        nomeTreino: 'Carregando...',
        diaDaSemana: '...',
        programacaoSemanalCompleta: [] 
    });

    useEffect(() => {
        
        let listaExercicios = [];
        let nomeTreinoAtual = "Descanso";
        let diaDaSemanaAtual = "";
        let programacaoCompleta = [];

        if (!allUsers || Object.keys(allUsers).length === 0) {
             setDadosTreino(prev => ({ ...prev, nomeTreino: "Aguardando dados...", programacaoSemanalCompleta: [] }));
             return;
        }

        try {

            const dadosUsuario = allUsers[idUsuarioLogado];
            
            if (!dadosUsuario) {
                 throw new Error(`Usuário ${idUsuarioLogado} não encontrado.`);
            }

            programacaoCompleta = dadosUsuario.programacaoSemanal; 

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
            console.error("Erro ao carregar treinos:", error);
            listaExercicios = [{ id: 'erro', nome: 'Erro ao carregar dados.' }];
            nomeTreinoAtual = "Erro";
            diaDaSemanaAtual = "Erro";
            programacaoCompleta = [];
        }

        setDadosTreino({
            listaExerciciosDoDia: listaExercicios,
            nomeTreino: nomeTreinoAtual,
            diaDaSemana: diaDaSemanaAtual,
            programacaoSemanalCompleta: programacaoCompleta 
        });

    }, [allUsers, idUsuarioLogado, usarDiaReal]); 
    
    return dadosTreino;
};