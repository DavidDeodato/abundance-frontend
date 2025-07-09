
import React from 'react';
import { CheckCircleIcon, SparklesIcon, MapIcon, StoreIcon, UsersIcon } from '../constants';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColorClass: string;
  textColorClass: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, bgColorClass, textColorClass }) => (
  <div className={`p-6 rounded-lg shadow-lg flex items-center space-x-4 ${bgColorClass}`}>
    <div className={`p-3 rounded-full ${textColorClass} bg-opacity-20`}>
      {icon}
    </div>
    <div>
      <p className={`text-sm font-medium ${textColorClass} opacity-80`}>{title}</p>
      <p className={`text-3xl font-bold ${textColorClass}`}>{value}</p>
    </div>
  </div>
);

interface JourneyStepProps {
  step: number;
  title: string;
  status: 'completed' | 'current' | 'pending';
}

const JourneyStep: React.FC<JourneyStepProps> = ({ step, title, status }) => {
  let bgColor = 'bg-gray-400';
  let textColor = 'text-white';
  if (status === 'completed') {
    bgColor = 'bg-abundanceGreenDark';
  } else if (status === 'current') {
    bgColor = 'bg-primaryBlue';
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgColor} ${textColor} font-bold text-xl mb-2`}>
        {status === 'completed' ? <CheckCircleIcon className="w-8 h-8"/> : step}
      </div>
      <p className="text-sm text-center font-medium text-mediumGray">{title}</p>
    </div>
  );
};

const DashboardPrincipalPage: React.FC = () => {
  const projects = [
    { name: "Floresta Aurora Verde", area: "1250.5 ha - Potencial de Carbono: Alto", progress: 85, status: "ARR" },
    { name: "Fazenda Boa Vista", area: "850.2 ha - Potencial de Carbono: Médio", progress: 45, status: "SAF" },
  ];

  return (
    <div className="space-y-8">
      {/* Journey Overview */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-darkGray mb-1">Sua Jornada de Sustentabilidade</h2>
        <p className="text-sm text-mediumGray mb-6">Transforme seus ativos ambientais em valor econômico</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start relative">
          <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-300 transform -translate-y-1/2 -z-10 md:block hidden">
             <div className="h-1 bg-abundanceGreenDark w-1/4"></div> {/* Example progress */}
          </div>
          <JourneyStep step={1} title="Diagnóstico MapeieSuaTerra™" status="completed" />
          <JourneyStep step={2} title="Validação AvalieSuaTerra™" status="current" />
          <JourneyStep step={3} title="Monetização Marketplace" status="pending" />
          <JourneyStep step={4} title="Impacto e MRV" status="pending" />
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Área Total Mapeada" value="2,100.7 ha" icon={<MapIcon className="w-8 h-8"/>} bgColorClass="bg-blue-100" textColorClass="text-blue-700" />
        <KpiCard title="Carbono Sequestrado (est.)" value="1,250 tCO₂e" icon={<SparklesIcon className="w-8 h-8"/>} bgColorClass="bg-green-100" textColorClass="text-green-700" />
        <KpiCard title="Receita Projetada" value="R$ 2.1M" icon={<StoreIcon className="w-8 h-8"/>} bgColorClass="bg-purple-100" textColorClass="text-purple-700" />
        <KpiCard title="Projetos Ativos" value="2" icon={<UsersIcon className="w-8 h-8"/>} bgColorClass="bg-yellow-100" textColorClass="text-yellow-700" />
      </section>

      {/* AI Blueprint Action */}
      <section className="bg-gradient-to-r from-aiPurple to-primaryBlue text-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold mb-2">Revise seu AI Blueprint ✨</h3>
          <p className="opacity-90 mb-4 md:mb-0">Análise técnica completa, cenários de investimento e recomendações da IA para seu ativo Floresta Aurora Verde - ARR (Progresso 45%).</p>
        </div>
        <button className="bg-white text-primaryBlue px-6 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors whitespace-nowrap">
          Ver Blueprint
        </button>
      </section>

      {/* Meus Projetos */}
      <section className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-darkGray">Meus Projetos</h2>
          <button className="text-sm text-abundanceGreenDark font-medium hover:underline">Ver Todos &rarr;</button>
        </div>
        <div className="space-y-4">
          {projects.map(project => (
            <div key={project.name} className="border border-gray-200 p-4 rounded-md hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-darkGray">{project.name} <span className="text-xs bg-abundanceGreenDark text-white px-2 py-0.5 rounded-full ml-2">{project.status}</span></h4>
                  <p className="text-xs text-mediumGray">{project.area}</p>
                </div>
                <button className="text-xs text-abundanceGreenDark border border-abundanceGreenDark px-3 py-1 rounded-full hover:bg-abundanceGreenDark hover:text-white transition-colors">
                  Ver Detalhes
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-abundanceGreen h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
              </div>
              <p className="text-xs text-right mt-1 text-mediumGray">{project.progress}% Completo</p>
            </div>
          ))}
        </div>
      </section>

       {/* Quick Actions */}
       <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <MapIcon className="w-10 h-10 text-abundanceGreenDark mb-3"/>
            <h4 className="font-semibold text-darkGray mb-1">Novo Diagnóstico MapeieSuaTerra™</h4>
            <p className="text-sm text-mediumGray">Inicie um diagnóstico gratuito de sua propriedade.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <StoreIcon className="w-10 h-10 text-primaryBlue mb-3"/>
            <h4 className="font-semibold text-darkGray mb-1">Marketplace MonetizeSuaTerra™</h4>
            <p className="text-sm text-mediumGray">Explore oportunidades de monetização.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <UsersIcon className="w-10 h-10 text-aiPurple mb-3"/>
            <h4 className="font-semibold text-darkGray mb-1">Parceiros Ecossistema Syntropy™</h4>
            <p className="text-sm text-mediumGray">Conecte-se com especialistas verificados.</p>
        </div>
      </section>
    </div>
  );
};

export default DashboardPrincipalPage;