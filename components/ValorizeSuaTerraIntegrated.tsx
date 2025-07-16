import React, { useState, useEffect } from 'react';
import { useValorizeFlow, useAbundanceNavigation, useMapeieFlow, useAvalieFlow, useAbundanceFlow } from '../contexts/AbundanceFlowContext';
import { florestaApi, handleApiError, userSession } from '../services/apiService';
import { STEPS, renderStepContent } from './ValorizeStepRenderer';

const ValorizeSuaTerraIntegrated: React.FC = () => {
    const { state, dispatch } = useAbundanceFlow();
    const navigation = useAbundanceNavigation();
    const mapeie = useMapeieFlow();
    const avalie = useAvalieFlow();
    const [currentStep, setCurrentStep] = useState(0);
    const [userId, setUserId] = useState<number | null>(null);
    const [relatorioId, setRelatorioId] = useState<number | null>(null);
    const [projecaoId, setProjecaoId] = useState<number | null>(null);

    useEffect(() => {
        const currentUser = userSession.getCurrentUser();
        setUserId(currentUser?.id || null);
        setRelatorioId(mapeie.results?.relatorio_id || null);
        setProjecaoId(avalie.results?.projecao_id || null);

        if (mapeie.results?.address && !state.valorize.formData.localizacaoCAR.enderecoCompleto) {
            dispatch({
                type: 'SET_VALORIZE_FORM_DATA',
                payload: {
                    ...state.valorize.formData,
                    localizacaoCAR: {
                        ...state.valorize.formData.localizacaoCAR,
                        enderecoCompleto: mapeie.results.address,
                    },
                },
            });
        }
    }, [mapeie.results, avalie.results]);

    const handleChange = (section: keyof typeof state.valorize.formData, field: string, value: any) => {
        const currentSection = state.valorize.formData[section];
        if (typeof currentSection === 'object' && currentSection !== null) {
            const updatedSection = { ...currentSection, [field]: value };
            dispatch({
                type: 'SET_VALORIZE_FORM_DATA',
                payload: { ...state.valorize.formData, [section]: updatedSection },
            });
        }
    };

    const handleCheckboxChange = (field: keyof typeof state.valorize.formData, value: boolean) => {
        dispatch({
            type: 'SET_VALORIZE_FORM_DATA',
            payload: { ...state.valorize.formData, [field]: value },
        });
    };

    const handleNext = () => currentStep < STEPS.length - 1 && setCurrentStep(currentStep + 1);
    const handleBack = () => currentStep > 0 && setCurrentStep(currentStep - 1);

    const handleSubmit = async () => {
        dispatch({ type: 'SET_VALORIZE_LOADING', payload: true });
        dispatch({ type: 'SET_VALORIZE_ERROR', payload: null });

        const { informacoesBasicas, localizacaoCAR, caracteristicasFloresta, monitoramentoCertificacao, impactoSocial, documentosFotos, aceitaTermos } = state.valorize.formData;
        
        const submissionData = {
            user_id: userId,
            relatorio_id: relatorioId,
            projecao_id: projecaoId,
            nome_projeto: informacoesBasicas.nomeProjeto,
            descricao_projeto: informacoesBasicas.descricaoProjeto,
            tipo_projeto: informacoesBasicas.tipoProjeto,
            objetivo_principal: informacoesBasicas.objetivoPrincipal,
            estado: localizacaoCAR.estado,
            cidade: localizacaoCAR.cidade,
            endereco_completo: localizacaoCAR.enderecoCompleto,
            codigo_car: localizacaoCAR.codigoCAR,
            latitude: parseFloat(localizacaoCAR.latitude) || 0,
            longitude: parseFloat(localizacaoCAR.longitude) || 0,
            area_total_ha: parseFloat(localizacaoCAR.areaTotalHa) || 0,
            bioma: caracteristicasFloresta.bioma,
            especies_nativas: caracteristicasFloresta.especiesNativasPrincipais,
            data_plantio: caracteristicasFloresta.dataPlantio || null,
            numero_arvores: parseInt(caracteristicasFloresta.numeroArvores) || 0,
            densidade_arvores_ha: parseInt(caracteristicasFloresta.densidadeArvoresHa) || 0,
            metodologia_carbono: monitoramentoCertificacao.metodologiaCarbono,
            certificacoes: monitoramentoCertificacao.certificacoes,
            responsavel_tecnico: monitoramentoCertificacao.responsavelTecnico,
            cronograma_monitoramento: monitoramentoCertificacao.cronogramaMonitoramento,
            frequencia_monitoramento: monitoramentoCertificacao.frequenciaMonitoramento,
            comunidade_local_envolvida: impactoSocial.comunidadeLocalEnvolvida,
            beneficios_sociais: impactoSocial.beneficiosSociais,
            empregos_gerados_estimativa: parseInt(impactoSocial.empregosGeradosEstimativa) || 0,
            documentos_projeto: documentosFotos.documentosProjeto,
            fotos_area: documentosFotos.fotosArea,
            aceita_termos: aceitaTermos,
        };

        try {
            await florestaApi.createFloresta(submissionData);
            dispatch({ type: 'MARK_TAB_COMPLETED', payload: 'valorize' });
            navigation.navigateTo('monetize');
        } catch (e: any) {
            const error = e.response?.data?.detail ? JSON.stringify(e.response.data.detail) : e.message;
            dispatch({ type: 'SET_VALORIZE_ERROR', payload: error });
        } finally {
            dispatch({ type: 'SET_VALORIZE_LOADING', payload: false });
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-center">ValorizeSuaTerra™</h1>
            <p className="text-center text-gray-600 mb-8">Crie seu Ativo Florestal</p>
            <div className="mb-8">
                {/* Stepper... */}
            </div>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md min-h-[400px]">
                {renderStepContent(currentStep, state.valorize.formData, handleChange, handleCheckboxChange)}
            </div>
            <div className="mt-8 flex justify-between">
                <button onClick={handleBack} disabled={currentStep === 0 || state.valorize.loading} className="px-6 py-2 bg-gray-300 rounded disabled:opacity-50">
                    Voltar
                </button>
                <button 
                    onClick={currentStep === STEPS.length - 1 ? handleSubmit : handleNext} 
                    className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    disabled={state.valorize.loading}
                >
                    {state.valorize.loading ? 'Enviando...' : (currentStep === STEPS.length - 1 ? 'Submeter Projeto' : 'Próximo')}
                </button>
            </div>
            {state.valorize.error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    <p className="font-bold mb-2">Erro na Submissão:</p>
                    <p>{state.valorize.error}</p>
                </div>
            )}
        </div>
    );
};

export default ValorizeSuaTerraIntegrated; 