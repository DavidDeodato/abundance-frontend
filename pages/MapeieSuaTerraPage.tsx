
import React, { useState, useCallback, ChangeEvent } from 'react';
import { 
    UploadCloudIcon, MapIcon, SearchIcon, SparklesIcon, CheckCircleIcon, UsersIcon, StoreIcon, BriefcaseIcon,
    especiesOptions, certificacoesOptions, beneficiosSociaisOptions, VALORIZE_STEPS 
} from '../constants';
import { Page, ValorizeForestFormData } from '../types';

interface MapeieSuaTerraPageProps {
  onNavigate: (page: Page) => void;
}

type FlowStep = 'initial' | 'area_defined' | 'user_info_form' | 'analysis_results';
type ProductTab = 'mapeie' | 'avalie' | 'valorize' | 'monetize';

interface UserInfoData {
  fullName: string;
  email: string;
  phone: string;
  profile: string;
}

const initialValorizeFormData: ValorizeForestFormData = {
  informacoesBasicas: { nomeProjeto: '', descricaoProjeto: '', tipoProjeto: '', objetivoPrincipal: '' },
  localizacaoCAR: { estado: '', cidade: '', enderecoCompleto: '', codigoCAR: '', latitude: '', longitude: '', areaTotalHa: '' },
  caracteristicasFloresta: { bioma: '', especiesNativasPrincipais: {}, dataPlantio: '', numeroArvores: '', densidadeArvoresHa: '' },
  monitoramentoCertificacao: { metodologiaCarbono: '', certificacoes: {}, responsavelTecnico: '', cronogramaMonitoramento: '', frequenciaMonitoramento: '' },
  impactoSocial: { comunidadeLocalEnvolvida: '', beneficiosSociais: {}, empregosGeradosEstimativa: '' },
  documentosFotos: { documentosProjeto: [], fotosArea: [] },
  aceitaTermos: false,
};

const productTabsConfig = [
    { id: 'mapeie', label: 'MapeieSuaTerra™', icon: MapIcon },
    { id: 'avalie', label: 'AvalieSuaTerra™ (AI Blueprint)', icon: SparklesIcon },
    { id: 'valorize', label: 'ValorizeSuaTerra™ (Criar Ativo)', icon: BriefcaseIcon },
    { id: 'monetize', label: 'Monetize (Marketplace)', icon: StoreIcon },
];

const MapeieSuaTerraPage: React.FC<MapeieSuaTerraPageProps> = ({ onNavigate }) => {
  const [activeProductTab, setActiveProductTab] = useState<ProductTab>('mapeie');
  
  const [mapeieFlowStep, setMapeieFlowStep] = useState<FlowStep>('initial');
  const [selectedAreaName, setSelectedAreaName] = useState<string | null>(null);
  const [kpiResults, setKpiResults] = useState<Record<string, string | number> | null>(null);
  const initialMapSrc = "https://maps.googleapis.com/maps/api/staticmap?center=-14.235004,-51.92528&zoom=4&size=600x400&maptype=roadmap&key=NO_API_KEY_NEEDED_FOR_STATIC_PLACEHOLDER";
  const areaDefinedMapSrc = "https://maps.googleapis.com/maps/api/staticmap?center=-19.916667,-44.583333&zoom=12&size=600x400&maptype=satellite&markers=color:blue%7Clabel:S%7C-19.916667,-44.583333&path=fillcolor:0xAA000033%7Ccolor:0xFF0000%7Cweight:1%7C-19.93,-44.60%7C-19.90,-44.60%7C-19.90,-44.56%7C-19.93,-44.56%7C-19.93,-44.60&key=NO_API_KEY_NEEDED_FOR_STATIC_PLACEHOLDER";
  const analysisResultMapSrc = "https://maps.googleapis.com/maps/api/staticmap?center=-19.916667,-44.583333&zoom=13&size=600x400&maptype=satellite&markers=color:green%7Clabel:A%7C-19.916667,-44.583333&path=fillcolor:0x00AA0033%7Ccolor:0x00FF00%7Cweight:1%7C-19.93,-44.60%7C-19.90,-44.60%7C-19.90,-44.56%7C-19.93,-44.56%7C-19.93,-44.60&key=NO_API_KEY_NEEDED_FOR_STATIC_PLACEHOLDER";
  const [mapImageSrc, setMapImageSrc] = useState(initialMapSrc);
  const [address, setAddress] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfoData>({ fullName: '', email: '', phone: '', profile: 'Proprietário(a) Rural' });

  const [valorizeCurrentStep, setValorizeCurrentStep] = useState(0);
  const [valorizeFormData, setValorizeFormData] = useState<ValorizeForestFormData>(initialValorizeFormData);
  const [valorizeCompletionPercentage, setValorizeCompletionPercentage] = useState(0); // Needs actual calculation logic

  const handleUserInfoChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleDefineArea = (areaName: string) => {
    setSelectedAreaName(areaName);
    setMapImageSrc(areaDefinedMapSrc);
    setMapeieFlowStep('area_defined');
  };

  const handleAnalyseAreaMapeie = () => {
    // Here you would likely save the user info `userInfo`
    console.log("User Info Submitted:", userInfo);
    setKpiResults({
      'ÁREA OBSERVADA': '82,55 ha', 'ÁRVORES EXISTENTES (POT.)': '32.574', 'CARBONO SEQUESTRADO (POT.)': '9.344,97 tCO₂',
      'ELEGÍVEL PARA PLANTIO (POT.)': '37,7%', 'POTENCIAL DE CARBONO': 'Alto', 'CRÉDITOS GERADOS (POT. ANUAL)': '24.951,07 tCO₂',
    });
    setMapImageSrc(analysisResultMapSrc);
    setMapeieFlowStep('analysis_results');
  };

  const resetMapeieFlow = () => {
    setMapeieFlowStep('initial'); setSelectedAreaName(null); setKpiResults(null); setMapImageSrc(initialMapSrc); setAddress('');
    setUserInfo({ fullName: '', email: '', phone: '', profile: 'Proprietário(a) Rural' });
  };

  const renderInitialMapeieStep = () => (
    <div className="space-y-8 mt-6">
      <section className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
            <label htmlFor="address-search" className="block text-sm font-medium text-gray-700 mb-1">Busque por endereço ou localidade:</label>
            <div className="flex">
                <input type="text" id="address-search" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ex: Fazenda Rio Verde, Araxá, MG" className="flex-grow p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-abundanceGreenDark focus:border-transparent"/>
                <button onClick={() => handleDefineArea(`Área em: ${address || 'Localização Buscada'}`)} className="bg-abundanceGreenDark text-white px-6 py-3 rounded-r-md hover:bg-abundanceGreen transition-colors flex items-center" disabled={!address}>
                    <SearchIcon className="w-5 h-5 mr-2"/> Analisar Endereço
                </button>
            </div>
        </div>
        <div className="relative h-96 bg-gray-200 rounded-lg flex items-center justify-center text-white shadow-inner mb-6">
          <img src={mapImageSrc} alt="Mapa da América do Sul" className="object-cover w-full h-full rounded-lg" />
          <div className="absolute top-4 right-4 space-x-2">
            <button className="px-3 py-1 rounded-md text-sm bg-white text-abundanceGreenDark font-semibold">Mapa</button>
            <button className="px-3 py-1 rounded-md text-sm bg-black bg-opacity-20 text-white hover:bg-opacity-30">Satélite</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <button onClick={() => handleDefineArea('Área Desenhada')} className="bg-white border border-abundanceGreenDark text-abundanceGreenDark px-6 py-4 rounded-md font-semibold hover:bg-abundanceGreenDark hover:text-white transition-colors text-center shadow-sm hover:shadow-md">
                <MapIcon className="w-6 h-6 mx-auto mb-2"/> Desenhar Área no Mapa
            </button>
            <button onClick={() => handleDefineArea('Área de KML Uploaded')} className="bg-white border border-gray-300 text-darkGray px-6 py-4 rounded-md font-semibold hover:border-abundanceGreenDark hover:text-abundanceGreenDark transition-colors text-center shadow-sm hover:shadow-md">
                <UploadCloudIcon className="w-6 h-6 mx-auto mb-2"/> Upload KML <span className="block text-xs text-lightGray">.kml, .kmz</span>
            </button>
            <button onClick={() => handleDefineArea('Área de CAR Uploaded')} className="bg-white border border-gray-300 text-darkGray px-6 py-4 rounded-md font-semibold hover:border-abundanceGreenDark hover:text-abundanceGreenDark transition-colors text-center shadow-sm hover:shadow-md">
                <UploadCloudIcon className="w-6 h-6 mx-auto mb-2"/> Upload CAR (Shapefile .zip) <span className="block text-xs text-lightGray">.zip</span>
            </button>
        </div>
        <p className="text-xs text-center text-mediumGray">Ao desenhar ou fazer upload, você aceita nossa análise instantânea de sua terra. Ao buscar por endereço, uma área padrão para simulação será utilizada.</p>
      </section>
    </div>
  );
  const renderAreaDefinedMapeieStep = () => (
    <div className="space-y-8 mt-6">
      <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-darkGray mb-4">Confirme a Área para Análise</h2>
          <div className="relative h-[500px] bg-gray-200 rounded-lg flex items-center justify-center text-white shadow-inner mb-6">
            <img src={mapImageSrc} alt="Mapa com área definida" className="object-cover w-full h-full rounded-lg" />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-lg shadow-2xl text-darkGray text-center max-w-sm">
                  <h3 className="text-lg font-semibold mb-2">Área Observada</h3>
                  <p className="text-2xl font-bold text-abundanceGreenDark mb-4">{selectedAreaName || '82,55 ha (SHAPE)'}</p>
                  <div className="space-y-3">
                      <button onClick={() => setMapeieFlowStep('user_info_form')} className="w-full bg-abundanceGreenDark text-white px-6 py-3 rounded-md hover:bg-abundanceGreen transition-colors font-semibold">Analisar esta Área</button>
                      <button onClick={resetMapeieFlow} className="w-full bg-transparent border border-red-500 text-red-500 px-6 py-3 rounded-md hover:bg-red-50 transition-colors font-semibold">Remover Desenho</button>
                  </div>
              </div>
            </div>
          </div>
      </section>
    </div>
  );

  const renderUserInfoFormStep = () => (
    <div className="bg-green-50/30 -m-6 p-6 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-darkGray mb-2">Quase lá! Conte-nos um pouco sobre você:</h2>
            <p className="text-mediumGray">Analisando: <span className="font-semibold text-abundanceGreenDark">{selectedAreaName || 'Área Selecionada'} (82,55 ha)</span></p>
            <p className="text-sm text-mediumGray mt-1">Seu pré-diagnóstico gratuito será gerado após o envio.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleAnalyseAreaMapeie(); }}>
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nome Completo*</label>
                <input type="text" name="fullName" id="fullName" value={userInfo.fullName} onChange={handleUserInfoChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" required />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Seu Melhor Email*</label>
                <input type="email" name="email" id="email" value={userInfo.email} onChange={handleUserInfoChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" required />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Celular (WhatsApp)*</label>
                <input type="tel" name="phone" id="phone" value={userInfo.phone} onChange={handleUserInfoChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" required />
            </div>
            <div>
                <label htmlFor="profile" className="block text-sm font-medium text-gray-700">Seu Perfil Principal*</label>
                <select name="profile" id="profile" value={userInfo.profile} onChange={handleUserInfoChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen bg-white">
                    <option>Proprietário(a) Rural</option>
                    <option>Investidor(a)</option>
                    <option>Consultor(a)</option>
                    <option>Empresa</option>
                    <option>Outro</option>
                </select>
            </div>
            <div>
                <button type="submit" className="w-full bg-abundanceGreenDark text-white py-3 px-4 rounded-md font-semibold hover:bg-abundanceGreen transition-colors text-lg">
                    Enviar e Ver Pré-Diagnóstico Gratuito
                </button>
            </div>
            <div className="text-center">
                <button type="button" onClick={resetMapeieFlow} className="text-sm text-mediumGray hover:text-darkGray">
                    Voltar e Alterar Seleção
                </button>
            </div>
        </form>
      </div>
    </div>
  );

  const renderAnalysisResultsMapeieStep = () => (
    <div className="space-y-8 mt-6">
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-darkGray mb-1">Potencial Inicial para: <span className="text-abundanceGreenDark">{selectedAreaName}</span></h2>
        <p className="text-sm text-mediumGray mb-6">Estimativas baseadas em IA e dados de satélites. Resultados preliminares.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {kpiResults && Object.entries(kpiResults).map(([key, value]) => ( <div key={key} className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg shadow-md border border-green-200"> <p className="text-xs text-abundanceGreenDark font-semibold uppercase tracking-wider">{key}</p> <p className="text-3xl font-bold text-darkGray mt-1">{value}{key.includes('tCO₂') || key.includes('%') ? '' : ''}</p> </div> ))}
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="lg:w-2/3"> <h3 className="text-lg font-semibold text-darkGray mb-2">Visualização da Área Analisada</h3> <div className="relative h-96 bg-gray-200 rounded-lg shadow-inner"> <img src={mapImageSrc} alt="Mapa com análise" className="object-cover w-full h-full rounded-lg" /> <div className="absolute bottom-2 left-2 bg-white bg-opacity-80 p-2 rounded text-xs text-darkGray"> <p><strong>Legenda:</strong></p> <p><span className="inline-block w-3 h-3 bg-green-500 mr-1 rounded-sm"></span> Área Observada</p> <p><span className="inline-block w-3 h-3 bg-blue-500 mr-1 rounded-sm"></span> Árvores Detectadas (IA)</p> <p><span className="inline-block w-3 h-3 bg-yellow-500 mr-1 rounded-sm"></span> Áreas com CAR/APP Estimada</p> </div> </div> </div>
          <div className="lg:w-1/3 bg-gray-50 p-6 rounded-lg"> <h3 className="text-lg font-semibold text-darkGray mb-3">Próximos Passos Sugeridos</h3> <ul className="space-y-3 text-sm"> <li className="flex items-start"> <CheckCircleIcon className="w-5 h-5 text-abundanceGreenDark mr-2 mt-0.5 shrink-0" /> <span><strong>Diagnóstico Completo:</strong> Solicite o <span className="font-semibold text-aiPurple">AvalieSuaTerra™</span> para um relatório detalhado e estudo de viabilidade econômica e técnica.</span> </li> <li className="flex items-start"> <SparklesIcon className="w-5 h-5 text-aiPurple mr-2 mt-0.5 shrink-0" /> <span><strong>Consultoria Personalizada:</strong> Fale com nossos especialistas para explorar modelos de monetização (carbono, madeira, SAF, etc).</span> </li> <li className="flex items-start"> <UsersIcon className="w-5 h-5 text-primaryBlue mr-2 mt-0.5 shrink-0" /> <span><strong>Conecte-se:</strong> Entre para o Ecossistema Syntropy™ e encontre parceiros, investidores e tecnologias.</span> </li> </ul> <hr className="my-4"/> <h3 className="text-md font-semibold text-darkGray mb-2">O que este pré-diagnóstico NÃO é:</h3> <ul className="list-disc list-inside text-xs text-mediumGray space-y-1"> <li>Uma garantia de retornos ou legalização final.</li> <li>Um laudo técnico para fins de certificação ou crédito.</li> <li>Uma análise de conformidade legal (CAR, APPs, Reserva Legal).</li> </ul> </div>
        </div>
        <div className="text-center space-x-4"> <button onClick={() => setActiveProductTab('avalie')} className="bg-abundanceGreenDark text-white px-8 py-3 rounded-md hover:bg-abundanceGreen transition-colors font-semibold text-lg"> Confirmar Interesse e Ver AI Blueprint </button> <button onClick={resetMapeieFlow} className="bg-gray-200 text-darkGray px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"> Analisar outra área </button> </div>
      </section>
    </div>
  );
  const renderMapeieSection = () => {
    if (mapeieFlowStep === 'user_info_form') {
        return renderUserInfoFormStep();
    }
    
    return (
      <div className="bg-aiPurple/5 min-h-screen -mx-6 -my-6 px-6 py-6"> 
        <header className="bg-abundanceGreenDark text-white py-10 text-center shadow-lg rounded-t-lg">
            <h1 className="text-4xl font-bold mb-2">MapeieSuaTerra™</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">Desenhe sua área no mapa ou insira um endereço para um pré-diagnóstico de sua terra instantâneo e gratuito. Descubra o potencial de carbono e reflorestamento da sua terra.</p>
        </header>
        <div className="container mx-auto"> 
          {mapeieFlowStep === 'initial' && renderInitialMapeieStep()}
          {mapeieFlowStep === 'area_defined' && renderAreaDefinedMapeieStep()}
          {mapeieFlowStep === 'analysis_results' && renderAnalysisResultsMapeieStep()}
        </div>
      </div>
    );
  };

  const ReportHeader: React.FC<{ date: string; title: string; subtitle: string; clientInfo: string }> = ({ date, title, subtitle, clientInfo }) => ( <div className="bg-primaryBlue text-white p-8 rounded-t-lg relative"> <div className="absolute top-4 right-4 bg-white text-primaryBlue w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-md"> AB </div> <p className="text-sm opacity-80">{date}</p> <h1 className="text-3xl font-bold mt-2">{title}</h1> <h2 className="text-lg opacity-90">{subtitle}</h2> <p className="text-xs mt-3 bg-black bg-opacity-20 px-2 py-1 rounded inline-block">{clientInfo}</p> </div> );
  interface SectionTitleProps { number: string; title: string; }
  const SectionTitle: React.FC<SectionTitleProps> = ({ number, title }) => ( <div className="flex items-center space-x-3 mb-4 mt-8"> <div className="bg-abundanceGreenDark text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"> {number} </div> <h3 className="text-xl font-semibold text-darkGray">{title.toUpperCase()}</h3> </div> );
  interface TableRow { [key: string]: string | number | JSX.Element; }
  interface SimpleTableProps { data: TableRow[]; columns: { key: string; label: string; className?: string }[]; highlightLast?: boolean; }
  const SimpleTable: React.FC<SimpleTableProps> = ({ data, columns, highlightLast = false }) => ( <div className="overflow-x-auto"> <table className="min-w-full divide-y divide-gray-200"> <tbody className="bg-white divide-y divide-gray-200"> {data.map((row, rowIndex) => ( <tr key={rowIndex} className={highlightLast && rowIndex === data.length -1 ? "bg-green-50" : (rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50")}> {columns.map((col, colIndex) => ( <td key={col.key} className={`px-4 py-3 text-sm ${colIndex === 0 ? 'font-medium text-darkGray' : 'text-mediumGray'} ${col.className || ''}`}> {row[col.key]} </td> ))} </tr> ))} </tbody> </table> </div> );
  const renderAvalieSection = () => {
    const sumarioExecutivoData = [ { item: 'Área total (CAR)', valor: '459,72 ha' }, { item: 'Área elegível (validação satelital 05/2025)', valor: '306 ha • 66,5%' }, { item: 'CRUs potenciais (258 t CO₂ / ha)', valor: '78 948 t CO₂' }, { item: 'Receita potencial (USD 55 / t)', valor: '≈ R$ 25,2 mi' }, { item: 'Payback projetado*', valor: '≈ 9-12 anos' }, { item: 'Situação CAR', valor: 'Ativo – sem passivos relevantes' }, ];
    const fatosCarData = [ { item: 'Vegetação nativa', valor: '456,57 ha', observacao: '99,3% preservada' }, { item: 'APP declarada', valor: '62,35 ha', observacao: '100% preservada' }, { item: 'Reserva Legal', valor: '123,27 ha', observacao: <span className="text-red-600">Excedente + 31,42 ha</span> }, { item: 'Área rural consolidada', valor: '3,14 ha', observacao: 'Passivo insignificante' }, { item: 'Sobreposições protegidas', valor: 'Nenhuma', observacao: 'Sem UC/TI' }, { item: 'Status cadastro', valor: <span className="text-orange-600">Aguardando análise (retificação 08/05/2025)</span>, observacao: '' }, ];
    const capexEstimadoData = [ { item: "Compra da terra", faixaCusto: "R$ [Preencher] / ha", total: "R$ [–]" }, { item: "Plantio ARR*", faixaCusto: "R$ 20 000 - 40 000 / ha", total: "R$ 6,1 M - 12,2 M" }, { item: "Estruturação (PDD ERS + auditorias)", faixaCusto: "–", total: "R$ 0,45 M" }, { item: "CAPEX total", faixaCusto: "–", total: <strong className="text-darkGray">R$ [calcular]</strong> }, ];
    const receitasMediasData = [ { atividade: "Pecuária extensiva", receitaBruta: "R$ 4 500", receitaLiquida: "R$ 1100 - 1500", fontes: ""}, { atividade: "Soja (arr.)", receitaBruta: "R$ 6 500", receitaLiquida: "R$ 1300 - 1600", fontes: ""}, { atividade: "Eucalipto (ciclo 7 a)**", receitaBruta: "R$ 7 000 - 10 000 (bruta ciclo)", receitaLiquida: "R$ 2 000 - 3 500 (equiv./ano)", fontes: ""}, { atividade: <strong className="text-abundanceGreenDark">Carbono ARR</strong>, receitaBruta: <strong className="text-abundanceGreenDark">R$ 3 500 - 5 500</strong>, receitaLiquida: <strong className="text-abundanceGreenDark">R$ 2 500 - 4 000</strong>, fontes: ""}, { atividade: <strong className="text-abundanceGreenDark">Carbono + SAF (20 ha)</strong>, receitaBruta: <strong className="text-abundanceGreenDark">R$ 4 500 +</strong>, receitaLiquida: <strong className="text-abundanceGreenDark">R$ 3 000 +</strong>, fontes: ""}, ];
    const roadmapData = [ { fase: "1. Relatório de Elegibilidade (este)", objetivo: "Confirmar potencial", prazoTipico: "Hoje", fonteRecursos: "Capital próprio (R$ 5 k)"}, { fase: "2. Decisão de Compra", objetivo: "Due diligence & assinatura", prazoTipico: "0 - 2 m", fonteRecursos: "Próprio / parceiro"}, { fase: "3. Business Plan & Data Room", objetivo: "Estruturar captação", prazoTipico: "1 - 3 m", fonteRecursos: "Serviço Abundance"}, { fase: "4. Plantio ARR 306 ha", objetivo: "Início do projeto", prazoTipico: "6 - 18 m", fonteRecursos: "Equity + pré-venda CRUs"}, { fase: "5. Pré-certificação Abundance (em desenv.)", objetivo: "Dossiê técnico", prazoTipico: "18 - 24 m", fonteRecursos: "Capital captado"}, { fase: "6. Certificação ARR (ERS / VERRA / GS)", objetivo: "Emitir CRUs", prazoTipico: "24 - 36 m", fonteRecursos: "Caixa do projeto"}, { fase: "7. Venda de Créditos", objetivo: "Receita operacional", prazoTipico: "30 - 40 m", fonteRecursos: "Spot / contratos"}, ];
    const riscosMitigacoesData = [ { risco: "Volatilidade do preço de carbono", grau: "Médio", mitigacao: "Offtake ≥ USD 40 / t (30%)" }, { risco: "Falha de restauração", grau: <span className="text-green-600">Baixo</span>, mitigacao: "Buffer 20 % + espécies nativas" }, { risco: "Pendência cartorial", grau: <span className="text-green-600">Baixo</span>, mitigacao: "Geo SIGEF antes da compra" }, { risco: "Mudança regulatória", grau: "Médio", mitigacao: "Conformidade SBCE + ERS" }, ];

    return ( <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg my-6"> <ReportHeader date="Maio / 2025" title="Diagnóstico Técnico & Potencial de Monetização Ambiental" subtitle="Fazenda Leonardo – São Gonçalo do Abaeté I MG" clientInfo="Documento confidencial - uso exclusivo do cliente" /> <div className="p-6 md:p-8"> <SectionTitle number="1" title="Sumário Executivo" /> <SimpleTable data={sumarioExecutivoData} columns={[{key: 'item', label: 'Item'}, {key: 'valor', label: 'Valor', className: 'text-right font-semibold'}]} /> <p className="text-xs text-mediumGray mt-2">* Com base em receita líquida de carbono de R$ 2500 – 4000 / ha / ano.</p> <div className="mt-4 p-4 bg-green-50 border-l-4 border-abundanceGreenDark text-mediumGray text-sm rounded-r-md"> <strong>Resumo:</strong> A terra apresenta potencial para receitas superiores às culturas convencionais se o projeto ARR for bem executado e o mercado de carbono mantiver valores próximos aos atuais. </div> <SectionTitle number="2" title="Fatos do CAR / SICAR" /> <SimpleTable data={fatosCarData} columns={[ {key: 'item', label: 'Item'}, {key: 'valor', label: 'Valor', className: 'font-semibold'}, {key: 'observacao', label: 'Observação'} ]} /> <SectionTitle number="3" title="Metodologia" /> <ol className="list-decimal list-inside text-mediumGray space-y-1 text-sm pl-2"> <li>CAR, matrícula, SICAR on-line.</li> <li>Google Earth 07/2013 × 11/2023 (prints).</li> <li>Validação satelital de terceiros (306 ha suitable).</li> <li>Fator de sequestro 258 t CO₂ / ha.</li> <li>Benchmarks CNA, Embrapa, CEPEA para atividades convencionais.</li> <li>Pipeline MRV Abundance (IA + revisão humana).</li> </ol> <SectionTitle number="4" title="Resultado de Elegibilidade" /> <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"> <div> <h4 className="font-semibold text-darkGray mb-2">Análise de Elegibilidade</h4> <div className="flex flex-col items-center p-4 border rounded-md"> <div className="relative w-32 h-32 mb-3"> <svg viewBox="0 0 36 36" className="circular-chart"> <path className="circle-bg" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e6e6e6" strokeWidth="3.8"></path> <path className="circle" strokeDasharray="66.5, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2E7D32" strokeWidth="3.8" strokeLinecap="round"></path> <text x="18" y="20.35" className="percentage" textAnchor="middle" dy=".3em" fontSize="0.5em" fill="#2E7D32" fontWeight="bold">66,5%</text> </svg> </div> <p className="text-xs text-mediumGray -mt-2 mb-3">Suitable</p> </div> <SimpleTable data={[ {classe: 'Suitable ARR', ha: 306, '%': 66.5}, {classe: 'Unsuitable', ha: 154, '%': 33.5}, {classe: 'Burn area', ha: 0, '%': 0}, ]} columns={[ {key: 'classe', label: 'Classe'}, {key: 'ha', label: 'ha', className: 'text-right'}, {key: '%', label: '%', className: 'text-right' } ]} /> </div> <div> <h4 className="font-semibold text-darkGray mb-2">Análise Satelital</h4> <img src="https://via.placeholder.com/400x250.png?text=Land+Suitability+Map" alt="Análise Satelital Principal" className="w-full rounded-md shadow mb-2"/> <div className="grid grid-cols-2 gap-2"> <img src="https://via.placeholder.com/195x120.png?text=07/2013" alt="Satélite 07/2013" className="w-full rounded-md shadow"/> <img src="https://via.placeholder.com/195x120.png?text=11/2023" alt="Satélite 11/2023" className="w-full rounded-md shadow"/> </div> </div> </div> <SectionTitle number="5" title="Custos & Retornos (horizonte de 10 anos)" /> <h4 className="font-semibold text-mediumGray mt-2 mb-2 text-md">5.1 CAPEX ESTIMADO <span className="text-xs text-lightGray">(Total 306 ha)</span></h4> <SimpleTable data={capexEstimadoData} columns={[ {key: 'item', label: 'Item'}, {key: 'faixaCusto', label: 'Faixa de custo', className: 'text-center'}, {key: 'total', label: 'Total (306 ha)', className: 'text-right'} ]} /> <p className="text-xs text-mediumGray mt-1">* Inclui mudas, preparo, insumos e manutenção inicial.</p> <h4 className="font-semibold text-mediumGray mt-6 mb-2 text-md">5.2 RECEITAS MÉDIAS (R$/ha/ano)</h4> <SimpleTable data={receitasMediasData} columns={[ {key: 'atividade', label: 'Atividade'}, {key: 'receitaBruta', label: 'Receita BRUTA', className: 'text-center'}, {key: 'receitaLiquida', label: 'Receita LÍQUIDA', className: 'text-center'}, {key: 'fontes', label: 'Fontes', className: 'text-right'} ]} highlightLast={true} /> <p className="text-xs text-mediumGray mt-1">** Receita anual equivalente ao corte de 7 anos.</p> <h4 className="font-semibold text-mediumGray mt-6 mb-2 text-md">5.3 PAYBACK</h4> <p className="text-sm text-mediumGray">Com receita líquida de carbono de R$ 2 500 – 4 000 / ha / ano, o fluxo de caixa acumulado atinge o ponto de equilíbrio <strong>entre anos 9 e 12</strong>, dependendo do CAPEX final e da eficácia de pré-venda de créditos.</p> <SectionTitle number="6" title="Roadmap I Etapas & Prazos" /> <SimpleTable data={roadmapData} columns={[ {key: 'fase', label: 'Fase', className: 'w-2/5'}, {key: 'objetivo', label: 'Objetivo'}, {key: 'prazoTipico', label: 'Prazo típico', className: 'text-center'}, {key: 'fonteRecursos', label: 'Fonte de recursos'} ]} /> <p className="text-xs text-mediumGray mt-2">Abundance pode apoiar nas fases 3-6, reduzindo necessidade de capital próprio via pré-venda.</p> <SectionTitle number="7" title="Riscos & Mitigações" /> <SimpleTable data={riscosMitigacoesData} columns={[ {key: 'risco', label: 'Risco', className: 'w-2/5'}, {key: 'grau', label: 'Grau', className: 'text-center'}, {key: 'mitigacao', label: 'Mitigação'} ]} /> <div className="mt-8 p-4 bg-gray-50 rounded-md border"> <h3 className="text-lg font-semibold text-darkGray mb-3">CONSIDERAÇÕES FINAIS</h3> <p className="text-sm text-mediumGray mb-3">Este diagnóstico indica que, <strong>se todas as etapas forem executadas de forma rigorosa e o mercado de carbono se mantiver dentro das faixas históricas</strong>, o projeto ARR pode gerar receitas líquidas <strong>comparáveis ou superiores</strong> às atividades convencionais analisadas.</p> <p className="text-sm text-mediumGray mb-2"><strong>A decisão de compra deve considerar:</strong></p> <ul className="list-disc list-inside text-sm text-mediumGray space-y-1 pl-4 mb-3"> <li>Capacidade de financiar o CAPEX inicial ou captar via pré-venda/financiadores;</li> <li>Tolerância a um período de retorno mais longo (≈ 10 anos);</li> <li>Riscos de mercado (preço do carbono) e execução (plantio/MRV).</li> </ul> <p className="text-sm text-mediumGray">Abundance pode apoiar no <strong>Business Plan</strong>, estruturação PDD ERS e captação, reduzindo riscos de execução.</p> </div> <div className="mt-8 text-xs text-mediumGray space-y-2"> <h3 className="text-sm font-semibold text-darkGray mb-1">DISCLAIMERS</h3> <p>Este documento é informativo; não constitui oferta ou recomendação de investimento.</p> <p>Projeções baseiam-se em premissas de mercado sujeitas a variações, incluindo preço de carbono, câmbio, custos de plantio, certificação e manutenção.</p> <p>A emissão de créditos depende de aprovação de auditorias externas (ERS, VERRA, Gold Standard) e de condições climáticas que podem afetar o crescimento florestal.</p> <p>Os custos de plantio apresentados (R$ 20 000 – 40 000 / ha) são estimativas; valores reais podem divergir.</p> <p>Resultados financeiros podem ser inferiores ou superiores ao previsto; Abundance Brasil não garante retorno nem se responsabiliza por decisões de compra baseadas neste relatório.</p> <p>Recomenda-se due diligence jurídica, fiscal e ambiental independente antes de qualquer aquisição.</p> <p>Documento confidencial; reprodução ou distribuição proibida sem autorização.</p> </div> <div className="mt-8"> <h3 className="text-sm font-semibold text-darkGray mb-1">APPENDIX B – Referências</h3> <ul className="list-disc list-inside text-xs text-mediumGray space-y-0.5 pl-4"> <li>CAR / SICAR MG-3161700-...</li> <li>Relatório de elegibilidade (plataforma satelital de terceiros, 05/2025)</li> <li>Relatório Manus.AI "relatorio_fazenda_leonardo_formatado.pdf"</li> <li>Benchmarks CNA, Embrapa, CEPEA 2024-25</li> </ul> </div> </div> <footer className="text-center text-xs text-mediumGray py-6 border-t mt-8"> © {new Date().getFullYear()} Abundance Brasil • Confidencial </footer>
          <div className="p-6 md:p-8 flex justify-center">
            <button
                onClick={() => setActiveProductTab('valorize')}
                className="bg-abundanceGreenDark text-white px-8 py-3 rounded-md hover:bg-abundanceGreen transition-colors font-semibold text-lg"
            >
                Próximo: Valorizar Ativo
            </button>
          </div>
        </div>
    );
  };

  const handleValorizeInputChange = (stepKey: keyof ValorizeForestFormData, field: string, value: string | boolean) => {
    setValorizeFormData(prev => ({ ...prev, [stepKey]: { ...(prev[stepKey] as any), [field]: value } }));
  };
  const handleValorizeCheckboxChange = (stepKey: keyof ValorizeForestFormData, groupField: string, option: string, checked: boolean) => {
    setValorizeFormData(prev => ({ ...prev, [stepKey]: { ...(prev[stepKey] as any), [groupField]: { ...((prev[stepKey] as any)[groupField] as { [key: string]: boolean }), [option]: checked } } }));
  };
  const handleValorizeFileChange = (stepKey: keyof ValorizeForestFormData, field: 'documentosProjeto' | 'fotosArea', files: FileList | null) => {
    if (files) setValorizeFormData(prev => ({ ...prev, [stepKey]: { ...(prev[stepKey] as any), [field]: Array.from(files) } }));
  };
  const nextValorizeStep = () => setValorizeCurrentStep(prev => Math.min(prev + 1, VALORIZE_STEPS.length - 1));
  const prevValorizeStep = () => setValorizeCurrentStep(prev => Math.max(prev - 1, 0));
  const goToValorizeStep = (stepIndex: number) => setValorizeCurrentStep(stepIndex);
  const handleSaveValorizeDraft = () => { console.log("Rascunho Valorize salvo:", valorizeFormData); alert('Rascunho salvo! (Simulado)'); };
  const handleSubmitValorizeProject = () => {
    if (!valorizeFormData.aceitaTermos && valorizeCurrentStep === VALORIZE_STEPS.length -1) { alert("Concorde com os termos."); return; }
    console.log("Projeto Valorize submetido:", valorizeFormData); alert('Projeto submetido! (Simulado)'); setActiveProductTab('monetize');
  };

  const renderValorizeStepContent = () => {
    const currentStepId = VALORIZE_STEPS[valorizeCurrentStep].id;
    switch (currentStepId) {
      case 'informacoesBasicas':
        const basicInfo = valorizeFormData.informacoesBasicas;
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-darkGray">Informações Básicas do Projeto</h3>
            <div>
              <label htmlFor="nomeProjeto" className="block text-sm font-medium text-gray-700">Nome do Projeto *</label>
              <input type="text" id="nomeProjeto" value={basicInfo.nomeProjeto} onChange={e => handleValorizeInputChange('informacoesBasicas', 'nomeProjeto', e.target.value)} placeholder="Ex: Floresta Aurora Verde" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
            </div>
            <div>
              <label htmlFor="descricaoProjeto" className="block text-sm font-medium text-gray-700">Descrição do Projeto</label>
              <textarea id="descricaoProjeto" value={basicInfo.descricaoProjeto} onChange={e => handleValorizeInputChange('informacoesBasicas', 'descricaoProjeto', e.target.value)} rows={3} placeholder="Descreva os objetivos e características principais do seu projeto de reflorestamento..." className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen"></textarea>
            </div>
            <div>
              <label htmlFor="tipoProjeto" className="block text-sm font-medium text-gray-700">Tipo de Projeto</label>
              <select id="tipoProjeto" value={basicInfo.tipoProjeto} onChange={e => handleValorizeInputChange('informacoesBasicas', 'tipoProjeto', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen bg-white">
                <option value="">Selecione o tipo</option>
                <option value="ARR">ARR (Aforestation, Reforestation, and Revegetation)</option>
                <option value="REDD+">REDD+ (Reducing Emissions from Deforestation and Forest Degradation)</option>
                <option value="SAF">SAF (Sistemas Agroflorestais)</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div>
              <label htmlFor="objetivoPrincipal" className="block text-sm font-medium text-gray-700">Objetivo Principal</label>
              <select id="objetivoPrincipal" value={basicInfo.objetivoPrincipal} onChange={e => handleValorizeInputChange('informacoesBasicas', 'objetivoPrincipal', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen bg-white">
                <option value="">Selecione o objetivo</option>
                <option value="geracao_creditos_carbono">Geração de Créditos de Carbono</option>
                <option value="restauracao_ecologica">Restauração Ecológica</option>
                <option value="conservacao_biodiversidade">Conservação da Biodiversidade</option>
                <option value="beneficios_comunitarios">Benefícios Comunitários</option>
              </select>
            </div>
          </div>
        );
      case 'localizacaoCAR':
        const locInfo = valorizeFormData.localizacaoCAR;
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-darkGray">Localização e Registro CAR</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado *</label>
                        <select id="estado" value={locInfo.estado} onChange={e => handleValorizeInputChange('localizacaoCAR', 'estado', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen bg-white">
                           <option value="">Selecione o estado</option>
                           <option value="AC">Acre</option><option value="AL">Alagoas</option><option value="AP">Amapá</option><option value="AM">Amazonas</option><option value="BA">Bahia</option><option value="CE">Ceará</option><option value="DF">Distrito Federal</option><option value="ES">Espírito Santo</option><option value="GO">Goiás</option><option value="MA">Maranhão</option><option value="MT">Mato Grosso</option><option value="MS">Mato Grosso do Sul</option><option value="MG">Minas Gerais</option><option value="PA">Pará</option><option value="PB">Paraíba</option><option value="PR">Paraná</option><option value="PE">Pernambuco</option><option value="PI">Piauí</option><option value="RJ">Rio de Janeiro</option><option value="RN">Rio Grande do Norte</option><option value="RS">Rio Grande do Sul</option><option value="RO">Rondônia</option><option value="RR">Roraima</option><option value="SC">Santa Catarina</option><option value="SP">São Paulo</option><option value="SE">Sergipe</option><option value="TO">Tocantins</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade *</label>
                        <input type="text" id="cidade" value={locInfo.cidade} onChange={e => handleValorizeInputChange('localizacaoCAR', 'cidade', e.target.value)} placeholder="Nome da cidade" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                    </div>
                </div>
                <div>
                    <label htmlFor="enderecoCompleto" className="block text-sm font-medium text-gray-700">Endereço Completo</label>
                    <input type="text" id="enderecoCompleto" value={locInfo.enderecoCompleto} onChange={e => handleValorizeInputChange('localizacaoCAR', 'enderecoCompleto', e.target.value)} placeholder="Endereço da propriedade" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                </div>
                <div>
                    <label htmlFor="codigoCAR" className="block text-sm font-medium text-gray-700">Código CAR *</label>
                    <input type="text" id="codigoCAR" value={locInfo.codigoCAR} onChange={e => handleValorizeInputChange('localizacaoCAR', 'codigoCAR', e.target.value)} placeholder="Ex: MG-311903-BC12..." className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                    <p className="text-xs text-gray-500 mt-1">Cadastro Ambiental Rural obrigatório</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
                        <input type="text" id="latitude" value={locInfo.latitude} onChange={e => handleValorizeInputChange('localizacaoCAR', 'latitude', e.target.value)} placeholder="-20.123456" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                    </div>
                    <div>
                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
                        <input type="text" id="longitude" value={locInfo.longitude} onChange={e => handleValorizeInputChange('localizacaoCAR', 'longitude', e.target.value)} placeholder="-44.123456" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                    </div>
                    <div>
                        <label htmlFor="areaTotalHa" className="block text-sm font-medium text-gray-700">Área Total (ha) *</label>
                        <input type="number" id="areaTotalHa" value={locInfo.areaTotalHa} onChange={e => handleValorizeInputChange('localizacaoCAR', 'areaTotalHa', e.target.value)} placeholder="1250.5" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                    </div>
                </div>
            </div>
        );
      case 'caracteristicasFloresta':
        const charInfo = valorizeFormData.caracteristicasFloresta;
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-darkGray">Características da Floresta</h3>
                <div>
                    <label htmlFor="bioma" className="block text-sm font-medium text-gray-700">Bioma *</label>
                    <select id="bioma" value={charInfo.bioma} onChange={e => handleValorizeInputChange('caracteristicasFloresta', 'bioma', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen bg-white">
                        <option value="">Selecione o bioma</option>
                        <option value="Amazonia">Amazônia</option>
                        <option value="Caatinga">Caatinga</option>
                        <option value="Cerrado">Cerrado</option>
                        <option value="Mata Atlantica">Mata Atlântica</option>
                        <option value="Pampa">Pampa</option>
                        <option value="Pantanal">Pantanal</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Espécies Nativas Principais</label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {especiesOptions.map(especie => (
                            <div key={especie} className="flex items-center">
                                <input id={`especie-${especie}`} type="checkbox" checked={!!charInfo.especiesNativasPrincipais[especie]} onChange={e => handleValorizeCheckboxChange('caracteristicasFloresta', 'especiesNativasPrincipais', especie, e.target.checked)} className="h-4 w-4 text-abundanceGreen border-gray-300 rounded focus:ring-abundanceGreen" />
                                <label htmlFor={`especie-${especie}`} className="ml-2 text-sm text-gray-700">{especie}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="dataPlantio" className="block text-sm font-medium text-gray-700">Data de Plantio</label>
                        <input type="date" id="dataPlantio" value={charInfo.dataPlantio} onChange={e => handleValorizeInputChange('caracteristicasFloresta', 'dataPlantio', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                    </div>
                    <div>
                        <label htmlFor="numeroArvores" className="block text-sm font-medium text-gray-700">Número de Árvores</label>
                        <input type="number" id="numeroArvores" value={charInfo.numeroArvores} onChange={e => handleValorizeInputChange('caracteristicasFloresta', 'numeroArvores', e.target.value)} placeholder="400000" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                    </div>
                    <div>
                        <label htmlFor="densidadeArvoresHa" className="block text-sm font-medium text-gray-700">Densidade (árvores/ha)</label>
                        <input type="number" id="densidadeArvoresHa" value={charInfo.densidadeArvoresHa} onChange={e => handleValorizeInputChange('caracteristicasFloresta', 'densidadeArvoresHa', e.target.value)} placeholder="320" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                    </div>
                </div>
            </div>
        );
      case 'monitoramentoCertificacao':
        const monCertInfo = valorizeFormData.monitoramentoCertificacao;
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-darkGray">Monitoramento e Certificação</h3>
                <div>
                    <label htmlFor="metodologiaCarbono" className="block text-sm font-medium text-gray-700">Metodologia de Carbono</label>
                    <select id="metodologiaCarbono" value={monCertInfo.metodologiaCarbono} onChange={e => handleValorizeInputChange('monitoramentoCertificacao', 'metodologiaCarbono', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen bg-white">
                        <option value="">Selecione a metodologia</option>
                        <option value="VCS">VCS (Verified Carbon Standard)</option>
                        <option value="GoldStandard">Gold Standard</option>
                        <option value="CAR_Standard">Climate Action Reserve</option> {/* Corrected value */}
                        <option value="Outra">Outra</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Certificações</label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                         {certificacoesOptions.map(cert => (
                            <div key={cert} className="flex items-center">
                                <input id={`cert-${cert}`} type="checkbox" checked={!!monCertInfo.certificacoes[cert]} onChange={e => handleValorizeCheckboxChange('monitoramentoCertificacao', 'certificacoes', cert, e.target.checked)} className="h-4 w-4 text-abundanceGreen border-gray-300 rounded focus:ring-abundanceGreen" />
                                <label htmlFor={`cert-${cert}`} className="ml-2 text-sm text-gray-700">{cert}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="responsavelTecnico" className="block text-sm font-medium text-gray-700">Responsável Técnico</label>
                    <input type="text" id="responsavelTecnico" value={monCertInfo.responsavelTecnico} onChange={e => handleValorizeInputChange('monitoramentoCertificacao', 'responsavelTecnico', e.target.value)} placeholder="Nome do engenheiro florestal responsável" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                </div>
                 <div>
                    <label htmlFor="cronogramaMonitoramento" className="block text-sm font-medium text-gray-700">Cronograma de Monitoramento</label>
                    <select id="cronogramaMonitoramento" value={monCertInfo.cronogramaMonitoramento} onChange={e => handleValorizeInputChange('monitoramentoCertificacao', 'cronogramaMonitoramento', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen bg-white">
                        <option value="">Selecione</option>
                        <option value="anual">Anual</option>
                        <option value="semestral">Semestral</option>
                        <option value="trimestral">Trimestral</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="frequenciaMonitoramento" className="block text-sm font-medium text-gray-700">Frequência de Monitoramento Detalhada</label>
                    <select id="frequenciaMonitoramento" value={monCertInfo.frequenciaMonitoramento} onChange={e => handleValorizeInputChange('monitoramentoCertificacao', 'frequenciaMonitoramento', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen bg-white">
                        <option value="">Selecione</option>
                        <option value="mensal">Mensal</option>
                        <option value="trimestral_satelite">Trimestral (Satélite)</option>
                        <option value="anual_campo">Anual (Campo)</option>
                    </select>
                </div>
            </div>
        );
      case 'impactoSocial':
        const impSocInfo = valorizeFormData.impactoSocial;
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-darkGray">Impacto Social</h3>
                 <div>
                    <label htmlFor="comunidadeLocalEnvolvida" className="block text-sm font-medium text-gray-700">Comunidade Local Envolvida</label>
                    <textarea id="comunidadeLocalEnvolvida" value={impSocInfo.comunidadeLocalEnvolvida} onChange={e => handleValorizeInputChange('impactoSocial', 'comunidadeLocalEnvolvida', e.target.value)} rows={3} placeholder="Descreva como a comunidade local está envolvida no projeto..." className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Benefícios Sociais</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        {beneficiosSociaisOptions.map(beneficio => (
                            <div key={beneficio} className="flex items-center">
                                <input id={`beneficio-${beneficio}`} type="checkbox" checked={!!impSocInfo.beneficiosSociais[beneficio]} onChange={e => handleValorizeCheckboxChange('impactoSocial', 'beneficiosSociais', beneficio, e.target.checked)} className="h-4 w-4 text-abundanceGreen border-gray-300 rounded focus:ring-abundanceGreen" />
                                <label htmlFor={`beneficio-${beneficio}`} className="ml-2 text-sm text-gray-700">{beneficio}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="empregosGeradosEstimativa" className="block text-sm font-medium text-gray-700">Empregos Gerados (estimativa)</label>
                    <input type="number" id="empregosGeradosEstimativa" value={impSocInfo.empregosGeradosEstimativa} onChange={e => handleValorizeInputChange('impactoSocial', 'empregosGeradosEstimativa', e.target.value)} placeholder="50" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                </div>
            </div>
        );
        case 'documentosFotos':
        const docInfo = valorizeFormData.documentosFotos;
        return (
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-darkGray">Documentos e Fotos</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Documentos do Projeto</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="documentosProjeto" className="relative cursor-pointer bg-white rounded-md font-medium text-abundanceGreenDark hover:text-abundanceGreen focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-abundanceGreen">
                                    <span>Clique para fazer upload ou arraste arquivos aqui</span>
                                    <input id="documentosProjeto" name="documentosProjeto" type="file" multiple className="sr-only" onChange={(e) => handleValorizeFileChange('documentosFotos', 'documentosProjeto', e.target.files)} />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX até 10MB cada</p>
                        </div>
                    </div>
                    {docInfo.documentosProjeto.length > 0 && (
                        <div className="mt-2 text-sm text-gray-500">
                            Arquivos selecionados: {docInfo.documentosProjeto.map(f => f.name).join(', ')}
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Documentos recomendados: Plano de Manejo, Licenças Ambientais, Estudos de Impacto, Relatórios Técnicos</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fotos da Área</label>
                     <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="fotosArea" className="relative cursor-pointer bg-white rounded-md font-medium text-abundanceGreenDark hover:text-abundanceGreen focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-abundanceGreen">
                                    <span>Clique para fazer upload ou arraste fotos aqui</span>
                                    <input id="fotosArea" name="fotosArea" type="file" multiple accept="image/*" className="sr-only" onChange={(e) => handleValorizeFileChange('documentosFotos', 'fotosArea', e.target.files)} />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">JPG, PNG até 5MB cada</p>
                        </div>
                    </div>
                    {docInfo.fotosArea.length > 0 && (
                        <div className="mt-2 text-sm text-gray-500">
                           Fotos selecionadas: {docInfo.fotosArea.map(f => f.name).join(', ')}
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Fotos recomendadas: Vista aérea, plantio, crescimento das árvores, comunidade local</p>
                </div>
            </div>
        );
      case 'revisaoFinal':
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-darkGray">Revisão Final do Projeto</h3>
                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <p><strong>Nome:</strong> {valorizeFormData.informacoesBasicas.nomeProjeto || 'Não informado'}</p>
                        <p><strong>Bioma:</strong> {valorizeFormData.caracteristicasFloresta.bioma || 'Não informado'}</p>
                        <p><strong>Tipo:</strong> {valorizeFormData.informacoesBasicas.tipoProjeto || 'Não informado'}</p>
                        <p><strong>Árvores:</strong> {valorizeFormData.caracteristicasFloresta.numeroArvores || 'Não informado'}</p>
                        <p><strong>Localização:</strong> {valorizeFormData.localizacaoCAR.cidade || 'Não informado'}, {valorizeFormData.localizacaoCAR.estado || 'Não informado'}</p>
                        <p><strong>CAR:</strong> {valorizeFormData.localizacaoCAR.codigoCAR || 'Não informado'}</p>
                        <p><strong>Área (ha):</strong> {valorizeFormData.localizacaoCAR.areaTotalHa || 'Não informado'}</p>
                         <p><strong>Metodologia:</strong> {valorizeFormData.monitoramentoCertificacao.metodologiaCarbono || 'Não informado'}</p>
                    </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Completude do Projeto: {valorizeCompletionPercentage}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div className="bg-abundanceGreen h-2.5 rounded-full" style={{ width: `${valorizeCompletionPercentage}%` }}></div>
                  </div>
                </div>
                <div className="mt-4">
                    <h4 className="font-semibold text-darkGray mb-2">Próximos Passos</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Análise técnica pela equipe da Abundance Brasil</li>
                        <li>Validação dos documentos e informações</li>
                        <li>Visita técnica (se necessário)</li>
                        <li>Aprovação e listagem no marketplace</li>
                        <li>Início do monitoramento MRV</li>
                    </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mt-4">
                    <h4 className="font-semibold text-yellow-700 mb-1">Informações Incompletas</h4>
                    <p className="text-sm text-yellow-600">Você pode submeter o projeto mesmo com informações incompletas. Nossa equipe entrará em contato para solicitar os dados faltantes.</p>
                </div>
                 <div className="mt-6 flex items-center">
                    <input id="aceitaTermos" type="checkbox" checked={valorizeFormData.aceitaTermos} onChange={e => handleValorizeInputChange('aceitaTermos', '', e.target.checked)} className="h-4 w-4 text-abundanceGreen border-gray-300 rounded focus:ring-abundanceGreen" />
                    <label htmlFor="aceitaTermos" className="ml-2 block text-sm text-gray-900">
                        Concordo com os <a href="#" className="font-medium text-abundanceGreenDark hover:text-abundanceGreen">termos de uso</a> e <a href="#" className="font-medium text-abundanceGreenDark hover:text-abundanceGreen">política de privacidade</a>.
                    </label>
                </div>
            </div>
        );
      default:
        return <div>Passo não encontrado.</div>;
    }
  };

  const renderValorizeSection = () => (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto my-6">
      <div className="mb-6 text-center md:text-left">
        <h2 className="text-2xl font-bold text-darkGray">Cadastre seu projeto/ativo florestal na plataforma Abundance Brasil</h2>
        <p className="text-mediumGray">E comece a monetizar seus ativos ambientais.</p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={handleSaveValorizeDraft}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
        >
            Salvar Rascunho
        </button>
        <div className="text-right">
            <span className="text-sm font-semibold text-abundanceGreenDark">Completo: {valorizeCompletionPercentage}%</span>
            <div className="w-32 bg-gray-200 rounded-full h-1.5 mt-1 inline-block ml-2 align-middle">
                <div className="bg-abundanceGreen h-1.5 rounded-full" style={{ width: `${valorizeCompletionPercentage}%` }}></div>
            </div>
        </div>
      </div>
      
      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex items-center justify-between min-w-max">
          {VALORIZE_STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => goToValorizeStep(index)}
                className={`flex flex-col items-center text-center px-2 py-1 group focus:outline-none ${valorizeCurrentStep >= index ? 'text-abundanceGreenDark' : 'text-lightGray hover:text-mediumGray'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${valorizeCurrentStep === index ? 'bg-abundanceGreenDark border-abundanceGreenDark text-white scale-110' : (valorizeCurrentStep > index ? 'bg-abundanceGreen border-abundanceGreen text-white' : 'border-lightGray group-hover:border-mediumGray bg-white')}`}>
                  {valorizeCurrentStep > index ? <CheckCircleIcon className="w-5 h-5" /> : step.icon}
                </div>
                <span className={`text-xs mt-1.5 font-medium transition-all duration-300 ${valorizeCurrentStep === index ? 'text-abundanceGreenDark' : (valorizeCurrentStep > index ? 'text-abundanceGreen' : 'text-lightGray group-hover:text-mediumGray')}`}>{step.name}</span>
              </button>
              {index < VALORIZE_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 transition-all duration-300 ${valorizeCurrentStep > index ? 'bg-abundanceGreen' : 'bg-lightGray'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-inner min-h-[300px]">
        {renderValorizeStepContent()}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
        <button
          onClick={prevValorizeStep}
          disabled={valorizeCurrentStep === 0}
          className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          &larr; Anterior
        </button>
        <div className="space-x-3">
            <button
                onClick={handleSaveValorizeDraft}
                className="px-6 py-2 border border-primaryBlue text-sm font-medium rounded-md text-primaryBlue bg-white hover:bg-blue-50"
            >
                Salvar Rascunho
            </button>
            {valorizeCurrentStep < VALORIZE_STEPS.length - 1 ? (
                <button
                    onClick={nextValorizeStep}
                    className="px-8 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-abundanceGreenDark hover:bg-abundanceGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-abundanceGreenDark"
                >
                    Próximo &rarr;
                </button>
            ) : (
                <button
                    onClick={handleSubmitValorizeProject}
                    disabled={!valorizeFormData.aceitaTermos}
                    className="px-8 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-aiPurple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aiPurple disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submeter Projeto
                </button>
            )}
        </div>
      </div>
    </div>
  );

  const renderMonetizeSection = () => (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-2xl font-bold text-darkGray mb-4">Monetize seus Ativos</h2>
        <p className="text-mediumGray mb-4">Conecte seus projetos validados ao Marketplace da Abundance Brasil para encontrar investidores e compradores de créditos de carbono.</p>
        <button 
            onClick={() => onNavigate(Page.Marketplace)}
            className="bg-primaryBlue text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
        >
            Ir para o Marketplace
        </button>
    </div>
  );


  return (
    <div className="container mx-auto">
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex flex-wrap -mb-px">
          {productTabsConfig.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveProductTab(tab.id as ProductTab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center mr-4
                ${activeProductTab === tab.id
                  ? 'border-abundanceGreenDark text-abundanceGreenDark'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <tab.icon className={`w-5 h-5 mr-2 ${activeProductTab === tab.id ? 'text-abundanceGreenDark' : 'text-gray-400'}`} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeProductTab === 'mapeie' && renderMapeieSection()}
      {activeProductTab === 'avalie' && renderAvalieSection()}
      {activeProductTab === 'valorize' && renderValorizeSection()}
      {activeProductTab === 'monetize' && renderMonetizeSection()}
    </div>
  );
};

export default MapeieSuaTerraPage;
