import React, { useEffect, useState } from 'react';
import { useAvalieFlow, useMapeieFlow, useAbundanceNavigation } from '../contexts/AbundanceFlowContext';
import { projecaoApi, handleApiError, userSession } from '../services/apiService';

const AvalieSuaTerraIntegrated: React.FC = () => {
  const avalie = useAvalieFlow();
  const mapeie = useMapeieFlow();
  const navigation = useAbundanceNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjecao = async () => {
      if (!mapeie.results?.relatorio_id) {
        avalie.setError('Dados do relatório não encontrados. Volte para a Aba 1.');
        setIsLoading(false);
        return;
      }

      try {
        const projecao = await projecaoApi.gerarProjecaoAvalieTerra(mapeie.results.relatorio_id);
        avalie.setResults(projecao);
        avalie.markCompleted();
      } catch (error) {
        avalie.setError(handleApiError(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjecao();
  }, [mapeie.results?.relatorio_id]);
  
  if (isLoading) {
    return <div>Gerando seu AI Blueprint...</div>;
  }

  if (avalie.error) {
    return <div>Erro ao gerar o relatório: {avalie.error}</div>;
  }

  if (!avalie.results) {
    return <div>Relatório não encontrado.</div>;
  }

  const { sumario_executivo, fatos_car, capex_estimado, receitas_medias, roadmap, riscos_mitigacoes } = avalie.results;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Seu AI Blueprint</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Sumário Executivo</h2>
        <pre>{JSON.stringify(sumario_executivo, null, 2)}</pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Fatos do CAR/SICAR</h2>
        <pre>{JSON.stringify(fatos_car, null, 2)}</pre>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">Custos e Retornos (CAPEX)</h2>
        <pre>{JSON.stringify(capex_estimado, null, 2)}</pre>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">Receitas Médias</h2>
        <pre>{JSON.stringify(receitas_medias, null, 2)}</pre>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">Roadmap e Prazos</h2>
        <pre>{JSON.stringify(roadmap, null, 2)}</pre>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">Riscos e Mitigações</h2>
        <pre>{JSON.stringify(riscos_mitigacoes, null, 2)}</pre>
      </div>

      <button
        onClick={() => navigation.navigateTo('valorize')}
        className="bg-abundanceGreenDark text-white px-8 py-3 rounded-md hover:bg-abundanceGreen transition-colors font-semibold text-lg"
      >
        Próximo: Valorizar Ativo
      </button>
    </div>
  );
};

export default AvalieSuaTerraIntegrated; 