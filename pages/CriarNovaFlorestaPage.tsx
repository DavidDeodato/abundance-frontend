
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { CheckCircleIcon, UploadCloudIcon } from '../constants'; // Assuming UploadCloudIcon exists

interface ForestFormData {
  informacoesBasicas: {
    nomeProjeto: string;
    descricaoProjeto: string;
    tipoProjeto: string;
    objetivoPrincipal: string;
  };
  localizacaoCAR: {
    estado: string;
    cidade: string;
    enderecoCompleto: string;
    codigoCAR: string;
    latitude: string;
    longitude: string;
    areaTotalHa: string;
  };
  caracteristicasFloresta: {
    bioma: string;
    especiesNativasPrincipais: { [key: string]: boolean };
    dataPlantio: string;
    numeroArvores: string;
    densidadeArvoresHa: string;
  };
  monitoramentoCertificacao: {
    metodologiaCarbono: string;
    certificacoes: { [key: string]: boolean };
    responsavelTecnico: string;
    cronogramaMonitoramento: string;
    frequenciaMonitoramento: string;
  };
  impactoSocial: {
    comunidadeLocalEnvolvida: string;
    beneficiosSociais: { [key: string]: boolean };
    empregosGeradosEstimativa: string;
  };
  documentosFotos: {
    documentosProjeto: File[];
    fotosArea: File[];
  };
  aceitaTermos: boolean;
}

const initialFormData: ForestFormData = {
  informacoesBasicas: { nomeProjeto: '', descricaoProjeto: '', tipoProjeto: '', objetivoPrincipal: '' },
  localizacaoCAR: { estado: '', cidade: '', enderecoCompleto: '', codigoCAR: '', latitude: '', longitude: '', areaTotalHa: '' },
  caracteristicasFloresta: { bioma: '', especiesNativasPrincipais: {}, dataPlantio: '', numeroArvores: '', densidadeArvoresHa: '' },
  monitoramentoCertificacao: { metodologiaCarbono: '', certificacoes: {}, responsavelTecnico: '', cronogramaMonitoramento: '', frequenciaMonitoramento: '' },
  impactoSocial: { comunidadeLocalEnvolvida: '', beneficiosSociais: {}, empregosGeradosEstimativa: '' },
  documentosFotos: { documentosProjeto: [], fotosArea: [] },
  aceitaTermos: false,
};

const steps = [
  { id: 'informacoesBasicas', name: 'Informações Básicas', icon: <span className="w-4 h-4 text-xs">1</span> },
  { id: 'localizacaoCAR', name: 'Localização e CAR', icon: <span className="w-4 h-4 text-xs">2</span> },
  { id: 'caracteristicasFloresta', name: 'Características da Floresta', icon: <span className="w-4 h-4 text-xs">3</span> },
  { id: 'monitoramentoCertificacao', name: 'Monitoramento e Certificação', icon: <span className="w-4 h-4 text-xs">4</span> },
  { id: 'impactoSocial', name: 'Impacto Social', icon: <span className="w-4 h-4 text-xs">5</span> },
  { id: 'documentosFotos', name: 'Documentos e Fotos', icon: <span className="w-4 h-4 text-xs">6</span> },
  { id: 'revisaoFinal', name: 'Revisão Final', icon: <span className="w-4 h-4 text-xs">7</span> },
];

const especiesOptions = ["Ipê Amarelo", "Jatobá", "Cedro", "Pau Brasil", "Jacarandá", "Aroeira", "Peroba", "Mogno", "Jequitibá", "Braúna", "Cabriúva", "Guarantã"];
const certificacoesOptions = ["FSC", "PEFC", "IBAMA", "UFLA", "INPE", "SFB"];
const beneficiosSociaisOptions = ["Geração de empregos", "Melhoria da renda local", "Educação ambiental", "Acesso à água potável", "Capacitação técnica", "Preservação cultural", "Melhoria da qualidade de vida", "Segurança alimentar"];


const CriarNovaFlorestaPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ForestFormData>(initialFormData);
  // Placeholder for completion percentage
  const [completionPercentage, setCompletionPercentage] = useState(0);


  const handleInputChange = (stepKey: keyof ForestFormData, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [stepKey]: {
        ...(prev[stepKey] as any), // Type assertion to avoid excessive type checking for nested objects
        [field]: value,
      },
    }));
  };
  
  const handleCheckboxChange = (stepKey: keyof ForestFormData, groupField: string, option: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [stepKey]: {
        ...(prev[stepKey] as any),
        [groupField]: {
          ...((prev[stepKey] as any)[groupField] as { [key: string]: boolean }),
          [option]: checked,
        }
      }
    }));
  };

  const handleFileChange = (stepKey: keyof ForestFormData, field: 'documentosProjeto' | 'fotosArea', files: FileList | null) => {
    if (files) {
      setFormData(prev => ({
        ...prev,
        [stepKey]: {
          ...(prev[stepKey] as any),
          [field]: Array.from(files),
        }
      }));
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const goToStep = (stepIndex: number) => setCurrentStep(stepIndex);

  const handleSaveDraft = () => {
    console.log("Rascunho salvo:", formData);
    alert('Rascunho salvo com sucesso! (Simulado)');
  };

  const handleSubmitProject = () => {
    if (!formData.aceitaTermos && currentStep === steps.length -1) {
        alert("Você precisa concordar com os termos de uso e política de privacidade.");
        return;
    }
    console.log("Projeto submetido:", formData);
    alert('Projeto submetido com sucesso! (Pode conter informações incompletas - Simulado)');
    // Potentially reset form or navigate away
  };
  
  const renderStepContent = () => {
    const currentStepId = steps[currentStep].id;
    switch (currentStepId) {
      case 'informacoesBasicas':
        const basicInfo = formData.informacoesBasicas;
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-darkGray">Informações Básicas do Projeto</h3>
            <div>
              <label htmlFor="nomeProjeto" className="block text-sm font-medium text-gray-700">Nome do Projeto *</label>
              <input type="text" id="nomeProjeto" value={basicInfo.nomeProjeto} onChange={e => handleInputChange('informacoesBasicas', 'nomeProjeto', e.target.value)} placeholder="Ex: Floresta Aurora Verde" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
            </div>
            <div>
              <label htmlFor="descricaoProjeto" className="block text-sm font-medium text-gray-700">Descrição do Projeto</label>
              <textarea id="descricaoProjeto" value={basicInfo.descricaoProjeto} onChange={e => handleInputChange('informacoesBasicas', 'descricaoProjeto', e.target.value)} rows={3} placeholder="Descreva os objetivos e características principais do seu projeto de reflorestamento..." className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen"></textarea>
            </div>
            <div>
              <label htmlFor="tipoProjeto" className="block text-sm font-medium text-gray-700">Tipo de Projeto</label>
              <select id="tipoProjeto" value={basicInfo.tipoProjeto} onChange={e => handleInputChange('informacoesBasicas', 'tipoProjeto', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen bg-white">
                <option value="">Selecione o tipo</option>
                <option value="ARR">ARR (Aforestation, Reforestation, and Revegetation)</option>
                <option value="REDD+">REDD+ (Reducing Emissions from Deforestation and Forest Degradation)</option>
                <option value="SAF">SAF (Sistemas Agroflorestais)</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div>
              <label htmlFor="objetivoPrincipal" className="block text-sm font-medium text-gray-700">Objetivo Principal</label>
              <select id="objetivoPrincipal" value={basicInfo.objetivoPrincipal} onChange={e => handleInputChange('informacoesBasicas', 'objetivoPrincipal', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen bg-white">
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
        const locInfo = formData.localizacaoCAR;
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-darkGray">Localização e Registro CAR</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado *</label>
                        <select id="estado" value={locInfo.estado} onChange={e => handleInputChange('localizacaoCAR', 'estado', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen bg-white">
                           <option value="">Selecione o estado</option>
                           {/* Populate with Brazilian states */}
                           <option value="AC">Acre</option><option value="AL">Alagoas</option><option value="AP">Amapá</option><option value="AM">Amazonas</option><option value="BA">Bahia</option><option value="CE">Ceará</option><option value="DF">Distrito Federal</option><option value="ES">Espírito Santo</option><option value="GO">Goiás</option><option value="MA">Maranhão</option><option value="MT">Mato Grosso</option><option value="MS">Mato Grosso do Sul</option><option value="MG">Minas Gerais</option><option value="PA">Pará</option><option value="PB">Paraíba</option><option value="PR">Paraná</option><option value="PE">Pernambuco</option><option value="PI">Piauí</option><option value="RJ">Rio de Janeiro</option><option value="RN">Rio Grande do Norte</option><option value="RS">Rio Grande do Sul</option><option value="RO">Rondônia</option><option value="RR">Roraima</option><option value="SC">Santa Catarina</option><option value="SP">São Paulo</option><option value="SE">Sergipe</option><option value="TO">Tocantins</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade *</label>
                        <input type="text" id="cidade" value={locInfo.cidade} onChange={e => handleInputChange('localizacaoCAR', 'cidade', e.target.value)} placeholder="Nome da cidade" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                    </div>
                </div>
                <div>
                    <label htmlFor="enderecoCompleto" className="block text-sm font-medium text-gray-700">Endereço Completo</label>
                    <input type="text" id="enderecoCompleto" value={locInfo.enderecoCompleto} onChange={e => handleInputChange('localizacaoCAR', 'enderecoCompleto', e.target.value)} placeholder="Endereço da propriedade" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                </div>
                <div>
                    <label htmlFor="codigoCAR" className="block text-sm font-medium text-gray-700">Código CAR *</label>
                    <input type="text" id="codigoCAR" value={locInfo.codigoCAR} onChange={e => handleInputChange('localizacaoCAR', 'codigoCAR', e.target.value)} placeholder="Ex: MG-311903-BC12..." className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                    <p className="text-xs text-gray-500 mt-1">Cadastro Ambiental Rural obrigatório</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
                        <input type="text" id="latitude" value={locInfo.latitude} onChange={e => handleInputChange('localizacaoCAR', 'latitude', e.target.value)} placeholder="-20.123456" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                    </div>
                    <div>
                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
                        <input type="text" id="longitude" value={locInfo.longitude} onChange={e => handleInputChange('localizacaoCAR', 'longitude', e.target.value)} placeholder="-44.123456" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                    </div>
                    <div>
                        <label htmlFor="areaTotalHa" className="block text-sm font-medium text-gray-700">Área Total (ha) *</label>
                        <input type="number" id="areaTotalHa" value={locInfo.areaTotalHa} onChange={e => handleInputChange('localizacaoCAR', 'areaTotalHa', e.target.value)} placeholder="1250.5" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                    </div>
                </div>
            </div>
        );
      case 'caracteristicasFloresta':
        const charInfo = formData.caracteristicasFloresta;
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-darkGray">Características da Floresta</h3>
                <div>
                    <label htmlFor="bioma" className="block text-sm font-medium text-gray-700">Bioma *</label>
                    <select id="bioma" value={charInfo.bioma} onChange={e => handleInputChange('caracteristicasFloresta', 'bioma', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen bg-white">
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
                                <input id={`especie-${especie}`} type="checkbox" checked={!!charInfo.especiesNativasPrincipais[especie]} onChange={e => handleCheckboxChange('caracteristicasFloresta', 'especiesNativasPrincipais', especie, e.target.checked)} className="h-4 w-4 text-abundanceGreen border-gray-300 rounded focus:ring-abundanceGreen" />
                                <label htmlFor={`especie-${especie}`} className="ml-2 text-sm text-gray-700">{especie}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="dataPlantio" className="block text-sm font-medium text-gray-700">Data de Plantio</label>
                        <input type="date" id="dataPlantio" value={charInfo.dataPlantio} onChange={e => handleInputChange('caracteristicasFloresta', 'dataPlantio', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                    </div>
                    <div>
                        <label htmlFor="numeroArvores" className="block text-sm font-medium text-gray-700">Número de Árvores</label>
                        <input type="number" id="numeroArvores" value={charInfo.numeroArvores} onChange={e => handleInputChange('caracteristicasFloresta', 'numeroArvores', e.target.value)} placeholder="400000" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                    </div>
                    <div>
                        <label htmlFor="densidadeArvoresHa" className="block text-sm font-medium text-gray-700">Densidade (árvores/ha)</label>
                        <input type="number" id="densidadeArvoresHa" value={charInfo.densidadeArvoresHa} onChange={e => handleInputChange('caracteristicasFloresta', 'densidadeArvoresHa', e.target.value)} placeholder="320" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                    </div>
                </div>
            </div>
        );
      case 'monitoramentoCertificacao':
        const monCertInfo = formData.monitoramentoCertificacao;
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-darkGray">Monitoramento e Certificação</h3>
                <div>
                    <label htmlFor="metodologiaCarbono" className="block text-sm font-medium text-gray-700">Metodologia de Carbono</label>
                    <select id="metodologiaCarbono" value={monCertInfo.metodologiaCarbono} onChange={e => handleInputChange('monitoramentoCertificacao', 'metodologiaCarbono', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen bg-white">
                        <option value="">Selecione a metodologia</option>
                        <option value="VCS">VCS (Verified Carbon Standard)</option>
                        <option value="GoldStandard">Gold Standard</option>
                        <option value="CAR">Climate Action Reserve</option>
                        <option value="Outra">Outra</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Certificações</label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                         {certificacoesOptions.map(cert => (
                            <div key={cert} className="flex items-center">
                                <input id={`cert-${cert}`} type="checkbox" checked={!!monCertInfo.certificacoes[cert]} onChange={e => handleCheckboxChange('monitoramentoCertificacao', 'certificacoes', cert, e.target.checked)} className="h-4 w-4 text-abundanceGreen border-gray-300 rounded focus:ring-abundanceGreen" />
                                <label htmlFor={`cert-${cert}`} className="ml-2 text-sm text-gray-700">{cert}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="responsavelTecnico" className="block text-sm font-medium text-gray-700">Responsável Técnico</label>
                    <input type="text" id="responsavelTecnico" value={monCertInfo.responsavelTecnico} onChange={e => handleInputChange('monitoramentoCertificacao', 'responsavelTecnico', e.target.value)} placeholder="Nome do engenheiro florestal responsável" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                </div>
                 <div>
                    <label htmlFor="cronogramaMonitoramento" className="block text-sm font-medium text-gray-700">Cronograma de Monitoramento</label>
                    <select id="cronogramaMonitoramento" value={monCertInfo.cronogramaMonitoramento} onChange={e => handleInputChange('monitoramentoCertificacao', 'cronogramaMonitoramento', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen bg-white">
                        <option value="">Selecione</option>
                        <option value="anual">Anual</option>
                        <option value="semestral">Semestral</option>
                        <option value="trimestral">Trimestral</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="frequenciaMonitoramento" className="block text-sm font-medium text-gray-700">Selecione a Frequência</label> {/* Kept from screenshot, seems redundant with above */}
                    <select id="frequenciaMonitoramento" value={monCertInfo.frequenciaMonitoramento} onChange={e => handleInputChange('monitoramentoCertificacao', 'frequenciaMonitoramento', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen bg-white">
                        <option value="">Selecione</option>
                        <option value="mensal">Mensal</option>
                        <option value="trimestral_satelite">Trimestral (Satélite)</option>
                        <option value="anual_campo">Anual (Campo)</option>
                    </select>
                </div>
            </div>
        );
      case 'impactoSocial':
        const impSocInfo = formData.impactoSocial;
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-darkGray">Impacto Social</h3>
                 <div>
                    <label htmlFor="comunidadeLocalEnvolvida" className="block text-sm font-medium text-gray-700">Comunidade Local Envolvida</label>
                    <textarea id="comunidadeLocalEnvolvida" value={impSocInfo.comunidadeLocalEnvolvida} onChange={e => handleInputChange('impactoSocial', 'comunidadeLocalEnvolvida', e.target.value)} rows={3} placeholder="Descreva como a comunidade local está envolvida no projeto..." className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Benefícios Sociais</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        {beneficiosSociaisOptions.map(beneficio => (
                            <div key={beneficio} className="flex items-center">
                                <input id={`beneficio-${beneficio}`} type="checkbox" checked={!!impSocInfo.beneficiosSociais[beneficio]} onChange={e => handleCheckboxChange('impactoSocial', 'beneficiosSociais', beneficio, e.target.checked)} className="h-4 w-4 text-abundanceGreen border-gray-300 rounded focus:ring-abundanceGreen" />
                                <label htmlFor={`beneficio-${beneficio}`} className="ml-2 text-sm text-gray-700">{beneficio}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="empregosGeradosEstimativa" className="block text-sm font-medium text-gray-700">Empregos Gerados (estimativa)</label>
                    <input type="number" id="empregosGeradosEstimativa" value={impSocInfo.empregosGeradosEstimativa} onChange={e => handleInputChange('impactoSocial', 'empregosGeradosEstimativa', e.target.value)} placeholder="50" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-abundanceGreen focus:border-abundanceGreen" />
                </div>
            </div>
        );
        case 'documentosFotos':
        const docInfo = formData.documentosFotos;
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
                                    <input id="documentosProjeto" name="documentosProjeto" type="file" multiple className="sr-only" onChange={(e) => handleFileChange('documentosFotos', 'documentosProjeto', e.target.files)} />
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
                                    <input id="fotosArea" name="fotosArea" type="file" multiple accept="image/*" className="sr-only" onChange={(e) => handleFileChange('documentosFotos', 'fotosArea', e.target.files)} />
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
                        <p><strong>Nome:</strong> {formData.informacoesBasicas.nomeProjeto || 'Não informado'}</p>
                        <p><strong>Bioma:</strong> {formData.caracteristicasFloresta.bioma || 'Não informado'}</p>
                        <p><strong>Tipo:</strong> {formData.informacoesBasicas.tipoProjeto || 'Não informado'}</p>
                        <p><strong>Árvores:</strong> {formData.caracteristicasFloresta.numeroArvores || 'Não informado'}</p>
                        <p><strong>Localização:</strong> {formData.localizacaoCAR.cidade || 'Não informado'}, {formData.localizacaoCAR.estado || 'Não informado'}</p>
                        <p><strong>CAR:</strong> {formData.localizacaoCAR.codigoCAR || 'Não informado'}</p>
                        <p><strong>Área (ha):</strong> {formData.localizacaoCAR.areaTotalHa || 'Não informado'}</p>
                         <p><strong>Metodologia:</strong> {formData.monitoramentoCertificacao.metodologiaCarbono || 'Não informado'}</p>
                    </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Completude do Projeto: {completionPercentage}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div className="bg-abundanceGreen h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
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
                    <input id="aceitaTermos" type="checkbox" checked={formData.aceitaTermos} onChange={e => handleInputChange('aceitaTermos', '', e.target.checked)} className="h-4 w-4 text-abundanceGreen border-gray-300 rounded focus:ring-abundanceGreen" />
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


  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
      <div className="mb-6 text-center md:text-left">
        <h2 className="text-2xl font-bold text-darkGray">Cadastre seu projeto florestal na plataforma Abundance Brasil</h2>
        <p className="text-mediumGray">E comece a monetizar seus ativos ambientais.</p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            Salvar Agora
        </button>
        <div className="text-right">
            <span className="text-sm font-semibold text-abundanceGreenDark">Completo: {completionPercentage}%</span>
            <div className="w-32 bg-gray-200 rounded-full h-1.5 mt-1 inline-block ml-2 align-middle">
                <div className="bg-abundanceGreen h-1.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
            </div>
        </div>
      </div>
      
      {/* Stepper */}
      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex items-center justify-between min-w-max">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => goToStep(index)}
                className={`flex flex-col items-center text-center px-2 py-1 group focus:outline-none ${currentStep >= index ? 'text-abundanceGreenDark' : 'text-lightGray hover:text-mediumGray'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep === index ? 'bg-abundanceGreenDark border-abundanceGreenDark text-white scale-110' : (currentStep > index ? 'bg-abundanceGreen border-abundanceGreen text-white' : 'border-lightGray group-hover:border-mediumGray bg-white')}`}>
                  {currentStep > index ? <CheckCircleIcon className="w-5 h-5" /> : step.icon}
                </div>
                <span className={`text-xs mt-1.5 font-medium transition-all duration-300 ${currentStep === index ? 'text-abundanceGreenDark' : (currentStep > index ? 'text-abundanceGreen' : 'text-lightGray group-hover:text-mediumGray')}`}>{step.name}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 transition-all duration-300 ${currentStep > index ? 'bg-abundanceGreen' : 'bg-lightGray'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner min-h-[300px]">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          &larr; Anterior
        </button>
        <div className="space-x-3">
            <button
                onClick={handleSaveDraft}
                className="px-6 py-2 border border-primaryBlue text-sm font-medium rounded-md text-primaryBlue bg-white hover:bg-blue-50"
            >
                Salvar Rascunho
            </button>
            {currentStep < steps.length - 1 ? (
                <button
                    onClick={nextStep}
                    className="px-8 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-abundanceGreenDark hover:bg-abundanceGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-abundanceGreenDark"
                >
                    Próximo &rarr;
                </button>
            ) : (
                <button
                    onClick={handleSubmitProject}
                    disabled={!formData.aceitaTermos}
                    className="px-8 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-aiPurple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aiPurple disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submeter Projeto
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default CriarNovaFlorestaPage;

