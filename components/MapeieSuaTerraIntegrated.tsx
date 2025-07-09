import React, { useState, useEffect } from 'react';
import { 
    UploadCloudIcon, MapIcon, SearchIcon, SparklesIcon, CheckCircleIcon 
} from '../constants';
import { useMapeieFlow, useAbundanceNavigation } from '../contexts/AbundanceFlowContext';
import { relatorioApi, userApi, handleApiError, userSession } from '../services/apiService';
import InteractiveMap from './InteractiveMap'; // Importar o mapa interativo
import { FeatureCollection } from 'geojson'; // Importar o tipo

type FlowStep = 'initial' | 'area_defined' | 'user_info_form' | 'analysis_results';

interface UserInfoData {
  fullName: string;
  email: string;
  phone: string;
  profile: string;
}

const MapeieSuaTerraIntegrated: React.FC = () => {
  const mapeie = useMapeieFlow();
  const navigation = useAbundanceNavigation();
  
  const [address, setAddress] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-14.235, -51.925]);
  const [mapZoom, setMapZoom] = useState<number>(4);
  const [userInfo, setUserInfo] = useState<UserInfoData>({ 
    fullName: '', 
    email: '', 
    phone: '', 
    profile: 'Proprietário(a) Rural' 
  });
  const [selectedAreaName, setSelectedAreaName] = useState<string | null>(null);
  const [drawnGeoJSON, setDrawnGeoJSON] = useState<FeatureCollection | null>(null);

  // URLs de mapas estáticos removidos - não são mais necessários
  
  // Inicializar dados do usuário se já logado
  useEffect(() => {
    const currentUser = userSession.getCurrentUser();
    if (currentUser) {
      setUserInfo({
        fullName: currentUser.full_name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        profile: currentUser.profile || 'Proprietário(a) Rural'
      });
    }

    // Restaurar dados se já existem resultados na aba
    if (mapeie.results) {
      setAddress(mapeie.results.address || '');
      setSelectedAreaName(mapeie.results.selected_area_name || '');
      setUserInfo(mapeie.results.user_info || userInfo);
      
      // Definir step baseado nos dados existentes
      if (mapeie.results.relatorio_id) {
        mapeie.setStep('analysis_results');
      } else if (mapeie.results.selected_area_name) {
        mapeie.setStep('area_defined');
      }
    }
  }, []);

  // Novo useEffect para sincronizar com o estado do login
  useEffect(() => {
    const checkUserSession = () => {
      const currentUser = userSession.getCurrentUser();
      if (currentUser) {
        setUserInfo({
          fullName: currentUser.full_name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          profile: currentUser.profile || 'Proprietário(a) Rural'
        });
        // Se o usuário está logado E a área foi definida, podemos pular o formulário?
        // Por agora, vamos apenas pré-preencher.
      }
    };
    checkUserSession(); // Executar na montagem
    window.addEventListener('userChanged', checkUserSession); // E ouvir por mudanças
    return () => window.removeEventListener('userChanged', checkUserSession);
  }, []);

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSearch = async () => {
    if (!address) return;
    mapeie.setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setMapZoom(12); // Zoom mais próximo para o endereço encontrado
        handleDefineArea(`Área em: ${address}`);
      } else {
        mapeie.setError('Endereço não encontrado.');
      }
    } catch (error) {
      mapeie.setError('Erro ao buscar endereço.');
    } finally {
      mapeie.setLoading(false);
    }
  };

  const handleDefineArea = (areaName: string) => {
    setSelectedAreaName(areaName);
  };

  const handleAreaDrawn = (geojson: FeatureCollection) => {
    setDrawnGeoJSON(geojson);
    if (geojson.features.length > 0) {
      // Automaticamente define a área quando algo é desenhado
      handleDefineArea('Área Desenhada no Mapa');
    } else {
      // Se a área for apagada, volta ao estado inicial
      resetMapeieFlow();
    }
  };

  const handleAnalyseAreaMapeie = async () => {
    if (!selectedAreaName || !userInfo.fullName || !userInfo.email) {
      mapeie.setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    mapeie.setLoading(true);
    mapeie.setError(null);

    try {
      console.log("Submetendo dados para processamento:", { 
        address, 
        selectedAreaName, 
        userInfo,
        geojson: drawnGeoJSON // Incluir os dados do mapa
      });

      // Submeter dados para o backend
      const result = await relatorioApi.processMapeieSubmission({
        address: address || '',
        selectedAreaName: selectedAreaName,
        userInfo: userInfo
      });

      console.log("Resultado do processamento:", result);

      // Salvar resultados no estado compartilhado
      const mapeieResults = {
        relatorio_id: result.relatorio_id,
        area_observada: result.kpis['ÁREA OBSERVADA'] || '82,55 ha',
        arvores_existentes: result.kpis['ÁRVORES EXISTENTES (POT.)'] || '32.574',
        carbono_sequestrado: result.kpis['CARBONO SEQUESTRADO (POT.)'] || '9.344,97 tCO₂',
        elegivel_plantio: result.kpis['ELEGÍVEL PARA PLANTIO (POT.)'] || '37,7%',
        potencial_carbono: result.kpis['POTENCIAL DE CARBONO'] || 'Alto',
        creditos_gerados: result.kpis['CRÉDITOS GERADOS (POT. ANUAL)'] || '24.951,07 tCO₂',
        selected_area_name: selectedAreaName,
        address: address,
        user_info: userInfo
      };

      mapeie.setResults(mapeieResults);
      
      // Atualizar usuário na sessão se foi criado/atualizado
      if (result.user_id) {
        try {
          const updatedUser = await userApi.getUserById(result.user_id);
          userSession.setCurrentUser(updatedUser);
        } catch (userError) {
          console.warn('Erro ao atualizar dados do usuário:', userError);
        }
      }

      // Transição para resultado
      mapeie.setStep('analysis_results');
      mapeie.markCompleted();

      console.log("Aba 1 concluída com sucesso");

    } catch (error) {
      console.error("Erro ao processar dados:", error);
      mapeie.setError(handleApiError(error));
    } finally {
      mapeie.setLoading(false);
    }
  };

  const resetMapeieFlow = () => {
    setSelectedAreaName(null);
    setAddress('');
    mapeie.setStep('initial');
    mapeie.reset();
  };

  const handleNavigateToAvalie = () => {
    if (mapeie.results?.relatorio_id) {
      navigation.navigateTo('avalie');
    } else {
      mapeie.setError('Complete a análise primeiro para prosseguir para a próxima etapa');
    }
  };

  const renderInitialStep = () => (
    <div className="space-y-8 mt-6">
      <section className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <label htmlFor="address-search" className="block text-sm font-medium text-gray-700 mb-1">
            Busque por endereço ou localidade:
          </label>
          <div className="flex">
            <input 
              type="text" 
              id="address-search" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="Ex: Fazenda Rio Verde, Araxá, MG" 
              className="flex-grow p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-abundanceGreenDark focus:border-transparent"
              disabled={mapeie.loading}
              onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch()}
            />
            <button 
              onClick={handleAddressSearch} 
              className="bg-abundanceGreenDark text-white px-6 py-3 rounded-r-md hover:bg-abundanceGreen transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={!address || mapeie.loading}
            >
              {mapeie.loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <SearchIcon className="w-5 h-5 mr-2" />}
              Analisar Endereço
            </button>
          </div>
        </div>
        
        <div className="relative h-96 bg-gray-200 rounded-lg flex items-center justify-center text-white shadow-inner mb-6">
          <InteractiveMap 
            onAreaDefined={handleAreaDrawn}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>

        {/* SEÇÃO DE CONFIRMAÇÃO CONDICIONAL */}
        {selectedAreaName && (
          <div className="bg-green-50 p-6 rounded-lg border-2 border-dashed border-green-300 text-center mb-6 transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-semibold text-darkGray mb-2">Área Selecionada: <span className="text-abundanceGreenDark">{selectedAreaName}</span></h3>
            <p className="text-mediumGray mb-4">Deseja prosseguir com a análise desta área ou escolher outro método de upload abaixo?</p>
            <div className="flex justify-center items-center space-x-4">
              <button 
                onClick={() => mapeie.setStep('user_info_form')} 
                className="bg-abundanceGreenDark text-white px-8 py-3 rounded-md hover:bg-abundanceGreen transition-colors font-semibold disabled:opacity-50"
                disabled={mapeie.loading}
              >
                Analisar esta Área
              </button>
              <button 
                onClick={resetMapeieFlow} 
                className="bg-transparent text-red-600 px-6 py-3 rounded-md hover:bg-red-50 transition-colors font-medium"
              >
                Limpar Seleção
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <button 
            onClick={() => handleDefineArea('Área Desenhada no Mapa')} 
            className="bg-white border border-abundanceGreenDark text-abundanceGreenDark px-6 py-4 rounded-md font-semibold hover:bg-abundanceGreenDark hover:text-white transition-colors text-center shadow-sm hover:shadow-md disabled:opacity-50"
            disabled={mapeie.loading || !!selectedAreaName}
            title={selectedAreaName ? "Limpe a seleção atual para desenhar novamente" : "Desenhar Área no Mapa"}
          >
            <MapIcon className="w-6 h-6 mx-auto mb-2" />
            Desenhar Área no Mapa
          </button>
          
          <button 
            onClick={() => handleDefineArea('Área de KML Uploaded')} 
            className="bg-white border border-gray-300 text-darkGray px-6 py-4 rounded-md font-semibold hover:border-abundanceGreenDark hover:text-abundanceGreenDark transition-colors text-center shadow-sm hover:shadow-md disabled:opacity-50"
            disabled={mapeie.loading}
          >
            <UploadCloudIcon className="w-6 h-6 mx-auto mb-2" />
            Upload KML 
            <span className="block text-xs text-lightGray">.kml, .kmz</span>
          </button>
          
          <button 
            onClick={() => handleDefineArea('Área de CAR Uploaded')} 
            className="bg-white border border-gray-300 text-darkGray px-6 py-4 rounded-md font-semibold hover:border-abundanceGreenDark hover:text-abundanceGreenDark transition-colors text-center shadow-sm hover:shadow-md disabled:opacity-50"
            disabled={mapeie.loading}
          >
            <UploadCloudIcon className="w-6 h-6 mx-auto mb-2" />
            Upload CAR (Shapefile .zip) 
            <span className="block text-xs text-lightGray">.zip</span>
          </button>
        </div>
        
        <p className="text-xs text-center text-mediumGray">
          Ao desenhar ou fazer upload, você aceita nossa análise instantânea de sua terra. Ao buscar por endereço, uma área padrão para simulação será utilizada.
        </p>
      </section>
    </div>
  );

  // Removida a função renderAreaDefinedStep()

  const renderUserInfoFormStep = () => {
    const isUserLoggedIn = userSession.isLoggedIn();

    return (
      <div className="bg-green-50/30 -m-6 p-6 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-darkGray mb-2">
              {isUserLoggedIn ? "Confirme seus Dados" : "Quase lá! Conte-nos um pouco sobre você:"}
            </h2>
            <p className="text-mediumGray">
              Analisando: <span className="font-semibold text-abundanceGreenDark">{selectedAreaName || 'Área Selecionada'} (82,55 ha)</span>
            </p>
            {isUserLoggedIn ? (
              <p className="text-sm text-mediumGray mt-1">Seus dados foram pré-preenchidos. Clique em "Enviar" para continuar.</p>
            ) : (
              <p className="text-sm text-mediumGray mt-1">Seu pré-diagnóstico gratuito será gerado após o envio.</p>
            )}
          </div>

          {mapeie.error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{mapeie.error}</p>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleAnalyseAreaMapeie(); }}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nome Completo*</label>
              <input 
                type="text" 
                name="fullName" 
                id="fullName" 
                value={userInfo.fullName} 
                onChange={handleUserInfoChange} 
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen disabled:bg-gray-100 disabled:opacity-70" 
                required 
                disabled={mapeie.loading || isUserLoggedIn}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Seu Melhor Email*</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                value={userInfo.email} 
                onChange={handleUserInfoChange} 
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen disabled:bg-gray-100 disabled:opacity-70" 
                required 
                disabled={mapeie.loading || isUserLoggedIn}
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Celular (WhatsApp)*</label>
              <input 
                type="tel" 
                name="phone" 
                id="phone" 
                value={userInfo.phone} 
                onChange={handleUserInfoChange} 
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen disabled:bg-gray-100 disabled:opacity-70" 
                required 
                disabled={mapeie.loading || isUserLoggedIn}
              />
            </div>
            
            <div>
              <label htmlFor="profile" className="block text-sm font-medium text-gray-700">Seu Perfil Principal*</label>
              <select 
                name="profile" 
                id="profile" 
                value={userInfo.profile} 
                onChange={handleUserInfoChange} 
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen bg-white disabled:bg-gray-100 disabled:opacity-70"
                disabled={mapeie.loading || isUserLoggedIn}
              >
                <option>Proprietário(a) Rural</option>
                <option>Investidor(a)</option>
                <option>Consultor(a)</option>
                <option>Empresa</option>
                <option>Outro</option>
              </select>
            </div>
            
            <div>
              <button 
                type="submit" 
                className="w-full bg-abundanceGreenDark text-white py-3 px-4 rounded-md font-semibold hover:bg-abundanceGreen transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={mapeie.loading}
              >
                {mapeie.loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processando...
                  </span>
                ) : (
                  isUserLoggedIn ? 'Enviar e Ver Pré-Diagnóstico' : 'Enviar e Ver Pré-Diagnóstico Gratuito'
                )}
              </button>
            </div>
            
            <div className="text-center">
              <button 
                type="button" 
                onClick={resetMapeieFlow} 
                className="text-sm text-mediumGray hover:text-darkGray disabled:opacity-50"
                disabled={mapeie.loading}
              >
                Voltar e Alterar Seleção
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderAnalysisResultsStep = () => {
    if (!mapeie.results) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Resultados não disponíveis</p>
        </div>
      );
    }

    const kpiResults = {
      'ÁREA OBSERVADA': mapeie.results.area_observada,
      'ÁRVORES EXISTENTES (POT.)': mapeie.results.arvores_existentes,
      'CARBONO SEQUESTRADO (POT.)': mapeie.results.carbono_sequestrado,
      'ELEGÍVEL PARA PLANTIO (POT.)': mapeie.results.elegivel_plantio,
      'POTENCIAL DE CARBONO': mapeie.results.potencial_carbono,
      'CRÉDITOS GERADOS (POT. ANUAL)': mapeie.results.creditos_gerados,
    };

    return (
      <div className="space-y-8 mt-6">
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-darkGray mb-1">
            Potencial Inicial para: <span className="text-abundanceGreenDark">{mapeie.results.selected_area_name}</span>
          </h2>
          <p className="text-sm text-mediumGray mb-6">
            Estimativas baseadas em IA e dados de satélites. Resultados preliminares.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Object.entries(kpiResults).map(([key, value]) => (
              <div key={key} className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg shadow-md border border-green-200">
                <p className="text-xs text-abundanceGreenDark font-semibold uppercase tracking-wider">{key}</p>
                <p className="text-3xl font-bold text-darkGray mt-1">{value}</p>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="lg:w-2/3">
              <h3 className="text-lg font-semibold text-darkGray mb-2">Visualização da Área Analisada</h3>
              <div className="relative h-96 bg-gray-200 rounded-lg shadow-inner">
                {drawnGeoJSON ? (
                  <InteractiveMap 
                    onAreaDefined={() => {}} 
                    initialGeoJSON={drawnGeoJSON}
                    readOnly={true}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">Visualização do mapa indisponível.</div>
                )}
                <div className="absolute bottom-2 left-2 bg-white bg-opacity-80 p-2 rounded text-xs text-darkGray">
                  <p><strong>Legenda:</strong></p>
                  <p><span className="inline-block w-3 h-3 bg-green-500 mr-1 rounded-sm"></span> Área Observada</p>
                  <p><span className="inline-block w-3 h-3 bg-blue-500 mr-1 rounded-sm"></span> Árvores Detectadas (IA)</p>
                  <p><span className="inline-block w-3 h-3 bg-yellow-500 mr-1 rounded-sm"></span> Áreas com CAR/APP Estimada</p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-darkGray mb-3">Próximos Passos Sugeridos</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-abundanceGreenDark mr-2 mt-0.5 shrink-0" />
                  <span>
                    <strong>Diagnóstico Completo:</strong> Solicite o <span className="font-semibold text-aiPurple">AvalieSuaTerra™</span> para um relatório detalhado e estudo de viabilidade econômica e técnica.
                  </span>
                </li>
                <li className="flex items-start">
                  <SparklesIcon className="w-5 h-5 text-aiPurple mr-2 mt-0.5 shrink-0" />
                  <span>
                    <strong>Consultoria Personalizada:</strong> Fale com nossos especialistas para explorar modelos de monetização (carbono, madeira, SAF, etc).
                  </span>
                </li>
              </ul>
              <hr className="my-4"/>
              <h3 className="text-md font-semibold text-darkGray mb-2">O que este pré-diagnóstico NÃO é:</h3>
              <ul className="list-disc list-inside text-xs text-mediumGray space-y-1">
                <li>Uma garantia de retornos ou legalização final.</li>
                <li>Um laudo técnico para fins de certificação ou crédito.</li>
                <li>Uma análise de conformidade legal (CAR, APPs, Reserva Legal).</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center space-x-4">
            <button 
              onClick={handleNavigateToAvalie} 
              className="bg-abundanceGreenDark text-white px-8 py-3 rounded-md hover:bg-abundanceGreen transition-colors font-semibold text-lg disabled:opacity-50"
              disabled={!mapeie.results?.relatorio_id}
            >
              Confirmar Interesse e Ver AI Blueprint
            </button>
            <button 
              onClick={resetMapeieFlow} 
              className="bg-gray-200 text-darkGray px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Analisar outra área
            </button>
          </div>
        </section>
      </div>
    );
  };

  // Render principal baseado no step atual
  const renderCurrentStep = () => {
    switch (mapeie.step) {
      case 'initial':
        return renderInitialStep();
      // case 'area_defined': // REMOVIDO
      //   return renderAreaDefinedStep();
      case 'user_info_form':
        return renderUserInfoFormStep();
      case 'analysis_results':
        return renderAnalysisResultsStep();
      default:
        return renderInitialStep();
    }
  };

  // Não renderizar formulário dentro do container principal se estivermos no step de user info
  if (mapeie.step === 'user_info_form') {
    return renderUserInfoFormStep();
  }

  return (
    <div className="bg-aiPurple/5 min-h-screen -mx-6 -my-6 px-6 py-6">
      <header className="bg-abundanceGreenDark text-white py-10 text-center shadow-lg rounded-t-lg">
        <h1 className="text-4xl font-bold mb-2">MapeieSuaTerra™</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Desenhe sua área no mapa ou insira um endereço para um pré-diagnóstico de sua terra instantâneo e gratuito. 
          Descubra o potencial de carbono e reflorestamento da sua terra.
        </p>
      </header>
      
      <div className="container mx-auto">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default MapeieSuaTerraIntegrated; 