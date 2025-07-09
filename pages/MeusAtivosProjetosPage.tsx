
import React from 'react';
import { Page, Project } from '../types';
import { FolderOpenIcon, MapPinIcon, TrendingUpIcon, ClockIcon, EyeIcon, PlusIcon, PlusCircleIcon, MapIcon, SparklesIcon, StoreIcon } from '../constants'; // Added PlusCircleIcon

interface MeusAtivosProjetosPageProps {
  onNavigate: (page: Page) => void;
}

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, iconBgColor = 'bg-gray-100', iconColor = 'text-gray-600' }) => (
  <div className="bg-white p-5 rounded-lg shadow-md flex items-center space-x-4">
    <div className={`p-3 rounded-full ${iconBgColor} ${iconColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-mediumGray">{title}</p>
      <p className="text-2xl font-bold text-darkGray">{value}</p>
    </div>
  </div>
);

const dummyProjects: Project[] = [
  { id: '1', name: 'Floresta Aurora Verde', area: '1250.5 ha', location: 'Cana Verde, MG', type: 'ARR', status: 'Validado', progress: 100, estimatedRevenue: 'R$ 1.2M', nextAction: 'Listar no Marketplace' },
  { id: '2', name: 'Fazenda Boa Vista', area: '850.2 ha', location: 'Goiás, GO', type: 'SAF', status: 'Analisando', progress: 75, estimatedRevenue: 'R$ 680K', nextAction: 'Aguardar Análise' },
  { id: '3', name: 'Sítio Esperança', area: '320.8 ha', location: 'Bahia, BA', type: 'Diagnóstico', status: 'Pendente', progress: 30, estimatedRevenue: 'A definir', nextAction: 'Completar Upload CAR' },
];

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'Validado': return 'bg-green-100 text-green-700';
    case 'Analisando': return 'bg-yellow-100 text-yellow-700';
    case 'Pendente': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getTypeColor = (type: string) => {
    // Simplified, expand as needed
    if (type === 'ARR') return 'bg-blue-100 text-blue-700';
    if (type === 'SAF') return 'bg-indigo-100 text-indigo-700';
    if (type === 'Diagnóstico') return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
};


const MeusAtivosProjetosPage: React.FC<MeusAtivosProjetosPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-darkGray">Meus Ativos e Projetos</h2>
          <p className="text-sm text-mediumGray">Gerencie todos os seus projetos ambientais.</p>
        </div>
        <button 
          onClick={() => onNavigate(Page.MapeieSuaTerra)} // Changed to MapeieSuaTerra
          className="bg-abundanceGreenDark text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-abundanceGreen transition-colors flex items-center"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Criar Novo Ativo Florestal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <SummaryCard title="Total de Projetos" value={3} icon={<FolderOpenIcon className="w-6 h-6" />} iconBgColor="bg-blue-100" iconColor="text-blue-600" />
        <SummaryCard title="Área Total" value="2,421.5 ha" icon={<MapPinIcon className="w-6 h-6" />} iconBgColor="bg-green-100" iconColor="text-green-600" />
        <SummaryCard title="Projetos Validados" value={1} icon={<TrendingUpIcon className="w-6 h-6" />} iconBgColor="bg-purple-100" iconColor="text-purple-600" />
        <SummaryCard title="Em Rascunho" value={0} icon={<ClockIcon className="w-6 h-6" />} iconBgColor="bg-orange-100" iconColor="text-orange-600" />
      </div>

      {/* Lista de Projetos */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-darkGray mb-4">Lista de Projetos</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3">Projeto</th>
                <th scope="col" className="px-4 py-3">Tipo</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Progresso</th>
                <th scope="col" className="px-4 py-3">Receita Estimada</th>
                <th scope="col" className="px-4 py-3">Próxima Ação</th>
                <th scope="col" className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {dummyProjects.map((project) => (
                <tr key={project.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-darkGray">{project.name}</div>
                    <div className="text-xs text-mediumGray">{project.area} &bull; {project.location}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(project.type)}`}>
                      {project.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                           className={`h-2 rounded-full ${project.progress === 100 ? 'bg-abundanceGreen' : project.progress >= 70 ? 'bg-yellow-400' : 'bg-red-500'}`}
                           style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-mediumGray">{project.progress}%</span>
                    </div>
                     <span className="text-xs text-mediumGray mt-0.5 block">{project.progress === 100 ? 'Completo' : project.status === 'Analisando' ? 'Analisando' : 'Pendente'}</span>

                  </td>
                  <td className="px-4 py-3 text-darkGray font-medium">{project.estimatedRevenue}</td>
                  <td className="px-4 py-3 text-mediumGray">{project.nextAction}</td>
                  <td className="px-4 py-3">
                    <button className="text-abundanceGreenDark hover:underline flex items-center text-xs">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-darkGray mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => { setActiveProductTab('mapeie'); onNavigate(Page.MapeieSuaTerra); }} // Example of setting tab then navigating
            className="w-full bg-abundanceGreen text-white p-4 rounded-lg shadow hover:bg-abundanceGreenDark transition-colors flex items-center justify-center text-sm font-medium"
          >
            <MapIcon className="w-5 h-5 mr-2" /> Novo Diagnóstico MapeieSuaTerra™
          </button>
          <button 
            onClick={() => { setActiveProductTab('avalie'); onNavigate(Page.MapeieSuaTerra); }}
            className="w-full bg-primaryBlue text-white p-4 rounded-lg shadow hover:bg-blue-700 transition-colors flex items-center justify-center text-sm font-medium"
          >
            <SparklesIcon className="w-5 h-5 mr-2" /> Solicitar AI Blueprint
          </button>
          <button 
            onClick={() => onNavigate(Page.Marketplace)}
            className="w-full bg-aiPurple text-white p-4 rounded-lg shadow hover:bg-purple-700 transition-colors flex items-center justify-center text-sm font-medium"
          >
            <StoreIcon className="w-5 h-5 mr-2" /> Acessar Marketplace
          </button>
        </div>
      </div>
    </div>
  );

  // Helper function to simulate setting active tab before navigation (won't directly work across components without context/state management)
  // This is a placeholder for a more robust solution if direct tab activation is needed from another page.
  function setActiveProductTab(tab: string) {
    console.warn(`Attempting to set active tab to ${tab} for MapeieSuaTerraPage. This requires inter-component state management or query params for a full solution.`);
  }
};

export default MeusAtivosProjetosPage;
