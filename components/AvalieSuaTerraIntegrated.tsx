import React, { useEffect, useState } from 'react';
import { CheckCircleIcon } from '../constants';
import { useAvalieFlow, useMapeieFlow, useAbundanceNavigation } from '../contexts/AbundanceFlowContext';
import { projecaoApi, handleApiError, userSession } from '../services/apiService';

const AvalieSuaTerraIntegrated: React.FC = () => {
  const avalie = useAvalieFlow();
  const mapeie = useMapeieFlow();
  const navigation = useAbundanceNavigation();
  
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportProgress, setReportProgress] = useState(0);

  // Verificar se temos dados da aba 1 e gerar relatório se necessário
  useEffect(() => {
    const initializeAvalie = async () => {
      // Verificar se já temos resultados
      if (avalie.results?.projecao_id) {
        console.log('Relatório já existe, exibindo dados salvos');
        return;
      }

      // Verificar se temos dados da aba 1
      if (!mapeie.results?.relatorio_id) {
        avalie.setError('É necessário completar a análise da Aba 1 (MapeieSuaTerra) primeiro');
        return;
      }

      // Gerar relatório automaticamente
      await generateReport();
    };

    initializeAvalie();
  }, [mapeie.results?.relatorio_id]);

  const generateReport = async () => {
    if (!mapeie.results?.relatorio_id) {
      avalie.setError('ID do relatório não encontrado. Complete a Aba 1 primeiro.');
      return;
    }

    const currentUser = userSession.getCurrentUser();
    if (!currentUser) {
      avalie.setError('Usuário não encontrado. Faça login novamente.');
      return;
    }

    setIsGeneratingReport(true);
    avalie.setLoading(true);
    avalie.setError(null);
    setReportProgress(0);

    try {
      console.log(`Gerando relatório AvalieSuaTerra para relatório ${mapeie.results.relatorio_id}...`);

      // Simular progresso durante geração
      const progressInterval = setInterval(() => {
        setReportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 500);

      // Gerar projeção via Gemini
      const projecaoResult = await projecaoApi.gerarProjecaoAvalieTerra(
        mapeie.results.relatorio_id,
        currentUser.id
      );

      clearInterval(progressInterval);
      setReportProgress(100);

      console.log('Relatório AvalieSuaTerra gerado com sucesso:', projecaoResult);

      // Salvar resultados no estado compartilhado
      const avalieResults = {
        projecao_id: projecaoResult.id,
        sumario_executivo: projecaoResult.sumario_executivo || {},
        fatos_car: projecaoResult.fatos_car || {},
        capex_estimado: projecaoResult.capex_estimado || {},
        receitas_medias: projecaoResult.receitas_medias || {},
        roadmap: projecaoResult.roadmap || {},
        riscos_mitigacoes: projecaoResult.riscos_mitigacoes || {}
      };

      avalie.setResults(avalieResults);
      avalie.markCompleted();

      console.log('Aba 2 concluída com sucesso');

    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      avalie.setError(handleApiError(error));
      setReportProgress(0);
    } finally {
      setIsGeneratingReport(false);
      avalie.setLoading(false);
    }
  };

  const handleRegenerateReport = async () => {
    // Limpar resultados anteriores e gerar novamente
    avalie.setResults(null);
    await generateReport();
  };

  const handleNavigateToValorize = () => {
    if (avalie.results?.projecao_id && mapeie.results?.relatorio_id) {
      navigation.navigateTo('valorize');
    } else {
      avalie.setError('Complete a geração do relatório primeiro para prosseguir');
    }
  };

  // Componentes auxiliares para renderizar as seções do relatório
  const ReportHeader: React.FC<{ date: string; title: string; subtitle: string; clientInfo: string }> = ({ 
    date, title, subtitle, clientInfo 
  }) => (
    <div className="bg-primaryBlue text-white p-8 rounded-t-lg relative">
      <div className="absolute top-4 right-4 bg-white text-primaryBlue w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-md">
        AB
      </div>
      <p className="text-sm opacity-80">{date}</p>
      <h1 className="text-3xl font-bold mt-2">{title}</h1>
      <h2 className="text-lg opacity-90">{subtitle}</h2>
      <p className="text-xs mt-3 bg-black bg-opacity-20 px-2 py-1 rounded inline-block">{clientInfo}</p>
    </div>
  );

  const SectionTitle: React.FC<{ number: string; title: string }> = ({ number, title }) => (
    <div className="flex items-center space-x-3 mb-4 mt-8">
      <div className="bg-abundanceGreenDark text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-darkGray">{title.toUpperCase()}</h3>
    </div>
  );

  const SimpleTable: React.FC<{ 
    data: Array<Record<string, any>>; 
    columns: Array<{ key: string; label: string; className?: string }>; 
    highlightLast?: boolean; 
  }> = ({ data, columns, highlightLast = false }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={
              highlightLast && rowIndex === data.length - 1 
                ? "bg-green-50" 
                : (rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50")
            }>
              {columns.map((col, colIndex) => (
                <td key={col.key} className={`px-4 py-3 text-sm ${
                  colIndex === 0 ? 'font-medium text-darkGray' : 'text-mediumGray'
                } ${col.className || ''}`}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Renderizar loading state durante geração
  if (isGeneratingReport || avalie.loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg my-6 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-abundanceGreenDark mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-darkGray mb-4">
            Gerando Relatório AvalieSuaTerra™ via IA
          </h2>
          <p className="text-mediumGray mb-6">
            Nossa IA está analisando os dados da sua propriedade e gerando um relatório técnico completo...
          </p>
          
          {/* Barra de progresso */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-abundanceGreen h-3 rounded-full transition-all duration-500"
              style={{ width: `${reportProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{Math.round(reportProgress)}% concluído</p>
          
          <div className="mt-8 text-left bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">O que está sendo gerado:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Sumário executivo com projeções financeiras</li>
              <li>• Análise detalhada do CAR/SICAR</li>
              <li>• Estimativa de CAPEX e receitas</li>
              <li>• Roadmap completo do projeto</li>
              <li>• Análise de riscos e mitigações</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar erro se houver
  if (avalie.error) {
    return (
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg my-6 p-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">Erro na Geração do Relatório</h2>
            <p className="text-red-700 mb-4">{avalie.error}</p>
            <div className="space-x-4">
              <button
                onClick={handleRegenerateReport}
                className="bg-abundanceGreenDark text-white px-6 py-2 rounded-md hover:bg-abundanceGreen transition-colors"
              >
                Tentar Novamente
              </button>
              <button
                onClick={() => navigation.navigateTo('mapeie')}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Voltar para Aba 1
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar relatório se já temos dados
  if (!avalie.results) {
    return (
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg my-6 p-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Aguardando dados da Aba 1</h2>
          <p className="text-gray-600 mb-4">Complete a análise MapeieSuaTerra primeiro</p>
          <button
            onClick={() => navigation.navigateTo('mapeie')}
            className="bg-abundanceGreenDark text-white px-6 py-3 rounded-md hover:bg-abundanceGreen transition-colors"
          >
            Ir para MapeieSuaTerra
          </button>
        </div>
      </div>
    );
  }

  // Preparar dados para exibição
  const sumario = avalie.results.sumario_executivo || {};
  const fatosCAR = avalie.results.fatos_car || {};
  const capex = avalie.results.capex_estimado || {};
  const receitas = avalie.results.receitas_medias || {};
  const roadmap = avalie.results.roadmap || {};
  const riscos = avalie.results.riscos_mitigacoes || {};

  // Converter objetos para arrays para as tabelas
  const sumarioExecutivoData = Object.entries(sumario).map(([key, value]) => ({
    item: key.replace(/_/g, ' ').toUpperCase(),
    valor: String(value)
  }));

  const fatosCarData = Object.entries(fatosCAR).map(([key, value]) => ({
    item: key.replace(/_/g, ' ').toUpperCase(),
    valor: typeof value === 'object' ? (value as any)?.valor || String(value) : String(value),
    observacao: typeof value === 'object' ? (value as any)?.observacao || '' : ''
  }));

  const capexEstimadoData = Object.entries(capex).map(([key, value]) => ({
    item: key.replace(/_/g, ' ').toUpperCase(),
    faixaCusto: typeof value === 'object' ? (value as any)?.faixa_custo || '-' : '-',
    total: typeof value === 'object' ? (value as any)?.total || String(value) : String(value)
  }));

  const receitasMediasData = Object.entries(receitas).map(([key, value]) => ({
    atividade: key.replace(/_/g, ' ').toUpperCase(),
    receitaBruta: typeof value === 'object' ? (value as any)?.receita_bruta || '-' : String(value),
    receitaLiquida: typeof value === 'object' ? (value as any)?.receita_liquida || '-' : '-',
    fontes: ''
  }));

  const roadmapData = Object.entries(roadmap).map(([key, value]) => ({
    fase: key.replace(/_/g, ' ').toUpperCase(),
    objetivo: typeof value === 'object' ? (value as any)?.objetivo || String(value) : String(value),
    prazoTipico: typeof value === 'object' ? (value as any)?.prazo || '-' : '-',
    fonteRecursos: typeof value === 'object' ? (value as any)?.fonte_recursos || '-' : '-'
  }));

  const riscosData = Object.entries(riscos).map(([key, value]) => ({
    risco: key.replace(/_/g, ' ').toUpperCase(),
    grau: typeof value === 'object' ? (value as any)?.grau || 'Médio' : 'Médio',
    mitigacao: typeof value === 'object' ? (value as any)?.mitigacao || String(value) : String(value)
  }));

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg my-6">
      <ReportHeader 
        date="Maio / 2025"
        title="Diagnóstico Técnico & Potencial de Monetização Ambiental"
        subtitle={`${mapeie.results?.selected_area_name || 'Propriedade Rural'} - Relatório via IA`}
        clientInfo="Documento confidencial - uso exclusivo do cliente"
      />
      
      <div className="p-6 md:p-8">
        <SectionTitle number="1" title="Sumário Executivo" />
        {sumarioExecutivoData.length > 0 ? (
          <SimpleTable 
            data={sumarioExecutivoData} 
            columns={[
              {key: 'item', label: 'Item'},
              {key: 'valor', label: 'Valor', className: 'text-right font-semibold'}
            ]} 
          />
        ) : (
          <p className="text-gray-500 text-sm">Dados do sumário executivo não disponíveis</p>
        )}

        <SectionTitle number="2" title="Fatos do CAR / SICAR" />
        {fatosCarData.length > 0 ? (
          <SimpleTable 
            data={fatosCarData} 
            columns={[
              {key: 'item', label: 'Item'},
              {key: 'valor', label: 'Valor', className: 'font-semibold'},
              {key: 'observacao', label: 'Observação'}
            ]} 
          />
        ) : (
          <p className="text-gray-500 text-sm">Dados do CAR/SICAR não disponíveis</p>
        )}

        <SectionTitle number="3" title="Custos & Retornos" />
        {capexEstimadoData.length > 0 ? (
          <SimpleTable 
            data={capexEstimadoData} 
            columns={[
              {key: 'item', label: 'Item'},
              {key: 'faixaCusto', label: 'Faixa de custo', className: 'text-center'},
              {key: 'total', label: 'Total', className: 'text-right'}
            ]} 
          />
        ) : (
          <p className="text-gray-500 text-sm">Dados de CAPEX não disponíveis</p>
        )}

        <h4 className="font-semibold text-mediumGray mt-6 mb-2 text-md">Receitas Médias (R$/ha/ano)</h4>
        {receitasMediasData.length > 0 ? (
          <SimpleTable 
            data={receitasMediasData} 
            columns={[
              {key: 'atividade', label: 'Atividade'},
              {key: 'receitaBruta', label: 'Receita BRUTA', className: 'text-center'},
              {key: 'receitaLiquida', label: 'Receita LÍQUIDA', className: 'text-center'}
            ]} 
            highlightLast={true}
          />
        ) : (
          <p className="text-gray-500 text-sm">Dados de receitas não disponíveis</p>
        )}

        <SectionTitle number="4" title="Roadmap & Prazos" />
        {roadmapData.length > 0 ? (
          <SimpleTable 
            data={roadmapData} 
            columns={[
              {key: 'fase', label: 'Fase', className: 'w-2/5'},
              {key: 'objetivo', label: 'Objetivo'},
              {key: 'prazoTipico', label: 'Prazo típico', className: 'text-center'},
              {key: 'fonteRecursos', label: 'Fonte de recursos'}
            ]} 
          />
        ) : (
          <p className="text-gray-500 text-sm">Dados do roadmap não disponíveis</p>
        )}

        <SectionTitle number="5" title="Riscos & Mitigações" />
        {riscosData.length > 0 ? (
          <SimpleTable 
            data={riscosData} 
            columns={[
              {key: 'risco', label: 'Risco', className: 'w-2/5'},
              {key: 'grau', label: 'Grau', className: 'text-center'},
              {key: 'mitigacao', label: 'Mitigação'}
            ]} 
          />
        ) : (
          <p className="text-gray-500 text-sm">Dados de riscos não disponíveis</p>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-md border">
          <h3 className="text-lg font-semibold text-darkGray mb-3">CONSIDERAÇÕES FINAIS</h3>
          <p className="text-sm text-mediumGray mb-3">
            Este diagnóstico foi gerado automaticamente por nossa IA baseado nos dados da sua propriedade. 
            Os valores e projeções são estimativas que podem variar conforme condições específicas do projeto.
          </p>
          <p className="text-sm text-mediumGray">
            <strong>Próximo passo:</strong> Prossiga para a aba "ValorizeSuaTerra™" para criar seu ativo florestal completo.
          </p>
        </div>

        <div className="mt-8 text-xs text-mediumGray space-y-2">
          <h3 className="text-sm font-semibold text-darkGray mb-1">DISCLAIMERS</h3>
          <p>Este documento é informativo; não constitui oferta ou recomendação de investimento.</p>
          <p>Projeções baseiam-se em premissas de mercado sujeitas a variações.</p>
          <p>Resultados financeiros podem ser inferiores ou superiores ao previsto.</p>
        </div>
      </div>

      <div className="p-6 md:p-8 flex justify-center space-x-4">
        <button
          onClick={handleNavigateToValorize}
          className="bg-abundanceGreenDark text-white px-8 py-3 rounded-md hover:bg-abundanceGreen transition-colors font-semibold text-lg"
          disabled={!avalie.results?.projecao_id}
        >
          Próximo: Valorizar Ativo
        </button>
        <button
          onClick={handleRegenerateReport}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
        >
          Regenerar Relatório
        </button>
      </div>

      <footer className="text-center text-xs text-mediumGray py-6 border-t mt-8">
        © {new Date().getFullYear()} Abundance Brasil • Confidencial
      </footer>
    </div>
  );
};

export default AvalieSuaTerraIntegrated; 