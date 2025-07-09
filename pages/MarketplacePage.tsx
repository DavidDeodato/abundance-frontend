
import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { SearchIcon, FilterIcon, StarIcon, MapIcon, SparklesIcon, CheckCircleIcon, ChevronDownIcon } from '../constants';

const initialProjects: Project[] = [
  { id: '1', name: 'Floresta Aurora Verde', type: 'Reflorestamento', status: 'Validado', progress: 100, estimatedRevenue: 'R$ 1.2M', nextAction: 'Disponível', location: 'Cana Verde, MG', rating: 4.9, reviews: 23, description: 'Projeto de reflorestamento com espécies nativas da Mata Atlântica, focado em conectividade de fragmentos florestais.', tags: ['Selo TerraPronta™', 'MRV Vivo', 'Disponível'], imageUrl: 'https://picsum.photos/seed/aurora/600/400', area: '1250.5 ha', pricePerCredit: 28.67, totalCredits: 123500 },
  { id: '2', name: 'Cerrado Vivo', type: 'Manejo Florestal', status: 'Analisando', progress: 75, estimatedRevenue: 'R$ 680K', nextAction: 'Aguardar Análise', location: 'Goiás, GO', rating: 4.5, reviews: 15, description: 'Manejo florestal realizado em área de Cerrado nativo, preservando a vegetação nativa e aumentando o estoque de carbono.', tags: ['Selo TerraPronta™', 'MRV Vivo', 'Disponível'], imageUrl: 'https://picsum.photos/seed/cerrado/600/400', area: '850.2 ha', pricePerCredit: 25.50, totalCredits: 80000 },
  { id: '3', name: 'Sítio Esperança', type: 'Agrofloresta', status: 'Pendente', progress: 30, estimatedRevenue: 'A definir', nextAction: 'Completar CAR', location: 'Bahia, BA', rating: 4.2, reviews: 8, description: 'Implementação de sistema agroflorestal com foco em cacau cabruca e espécies nativas para recuperação de área degradada.', tags: ['Potencial Alto', 'Em Desenvolvimento', 'MRV Vivo'], imageUrl: 'https://picsum.photos/seed/esperanca/600/400', area: '320.8 ha', pricePerCredit: 30.00, totalCredits: 50000 },
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <img src={project.imageUrl || `https://picsum.photos/seed/${project.id}/600/400`} alt={project.name} className="w-full h-48 object-cover"/>
      <div className="p-6">
        <div className="flex items-center mb-2 flex-wrap">
          {project.tags?.map(tag => (
            <span key={tag} className={`text-xs px-2 py-0.5 rounded-full mr-2 mb-1 ${tag.includes('Disponível') ? 'bg-green-200 text-green-800' : tag.includes('Selo TerraPronta™') ? 'bg-blue-200 text-blue-800' : tag.includes('MRV Vivo') ? 'bg-purple-200 text-purple-800' : 'bg-yellow-200 text-yellow-800'}`}>{tag}</span>
          ))}
        </div>
        <h3 className="text-xl font-semibold text-darkGray mb-1">{project.name}</h3>
        <div className="flex items-center text-sm text-mediumGray mb-2">
            <MapIcon className="w-4 h-4 mr-1 text-lightGray"/> {project.location}
        </div>
        <div className="flex items-center text-sm text-yellow-500 mb-2">
            <StarIcon className="w-4 h-4 mr-1"/> {project.rating} ({project.reviews} avaliações)
        </div>
        <p className="text-sm text-mediumGray mb-3 h-20 overflow-hidden">{project.description}</p>
        <div className="grid grid-cols-3 gap-2 text-center mb-4 border-t border-b border-gray-200 py-3">
            <div>
                <p className="text-xs text-mediumGray">Área</p>
                <p className="font-semibold text-darkGray">{project.area}</p>
            </div>
            <div>
                <p className="text-xs text-mediumGray">Créditos</p>
                <p className="font-semibold text-darkGray">{project.totalCredits?.toLocaleString()}</p>
            </div>
            <div>
                <p className="text-xs text-mediumGray">Preço/Crédito</p>
                <p className="font-semibold text-darkGray">R$ {project.pricePerCredit?.toFixed(2)}</p>
            </div>
        </div>
        <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-abundanceGreenDark">R$ {(project.totalCredits && project.pricePerCredit ? project.totalCredits * project.pricePerCredit : 0).toLocaleString('pt-BR', {minimumFractionDigits:0, maximumFractionDigits:0})}</span>
            <button className="bg-abundanceGreenDark text-white px-4 py-2 rounded-md hover:bg-abundanceGreen transition-colors text-sm font-medium">
                Ver Detalhes
            </button>
        </div>
      </div>
    </div>
  );
};

interface CustomDropdownProps {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, options, selectedValue, onSelect, isOpen, setIsOpen, dropdownRef }) => {
  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-abundanceGreenDark focus:border-transparent bg-white text-left flex justify-between items-center"
      >
        <span>{selectedValue === 'Todos' || selectedValue === 'Todas' ? label : selectedValue}</span>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.map(option => (
            <div
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const MarketplacePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos os Status');
  const [categoryFilter, setCategoryFilter] = useState('Todas as Categorias');
  
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const statusOptions = ["Todos os Status", "Selo TerraPronta™", "Disponível", "MRV Vivo"];
  const categoryOptions = ["Todas as Categorias", "Reflorestamento", "Manejo Florestal", "Agrofloresta"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProjects = initialProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'Todos os Status' || project.tags?.includes(statusFilter)) &&
    (categoryFilter === 'Todas as Categorias' || project.type === categoryFilter)
  );

  const StatCard: React.FC<{title:string, value:string|number, icon: React.ReactNode}> = ({title, value, icon}) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-center">
        <div className="p-3 bg-abundanceGreen bg-opacity-10 rounded-full mr-3 text-abundanceGreenDark">{icon}</div>
        <div>
            <p className="text-xs text-mediumGray">{title}</p>
            <p className="text-xl font-bold text-darkGray">{value}</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-darkGray mb-1">MonetizeSuaTerra™ / EscolhaSuaCompensação™</h2>
        <p className="text-sm text-mediumGray mb-6">Encontre projetos ambientais verificados para investir ou compensar suas emissões.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar projetos..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-abundanceGreenDark focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <CustomDropdown
            label="Todos os Status"
            options={statusOptions}
            selectedValue={statusFilter}
            onSelect={setStatusFilter}
            isOpen={isStatusDropdownOpen}
            setIsOpen={setIsStatusDropdownOpen}
            dropdownRef={statusDropdownRef}
          />
          <CustomDropdown
            label="Todas as Categorias"
            options={categoryOptions}
            selectedValue={categoryFilter}
            onSelect={setCategoryFilter}
            isOpen={isCategoryDropdownOpen}
            setIsOpen={setIsCategoryDropdownOpen}
            dropdownRef={categoryDropdownRef}
          />

        </div>
        <button className="text-sm text-abundanceGreenDark font-medium flex items-center hover:underline">
            <FilterIcon className="w-4 h-4 mr-1"/> Filtros Avançados
        </button>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Projetos Ativos" value={initialProjects.length} icon={<MapIcon className="w-6 h-6"/>} />
        <StatCard title="Selo TerraPronta™" value={initialProjects.filter(p => p.tags?.includes("Selo TerraPronta™")).length} icon={<StarIcon className="w-6 h-6"/>} />
        <StatCard title="Créditos Disponíveis" value={initialProjects.reduce((sum, p) => sum + (p.totalCredits || 0) ,0).toLocaleString()} icon={<SparklesIcon className="w-6 h-6"/>} />
        <StatCard title="MRV Vivo" value={initialProjects.filter(p => p.tags?.includes("MRV Vivo")).length} icon={<CheckCircleIcon className="w-6 h-6"/>} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => <ProjectCard key={project.id} project={project} />)
        ) : (
          <p className="text-mediumGray col-span-full text-center py-10">Nenhum projeto encontrado com os filtros atuais.</p>
        )}
      </section>
    </div>
  );
};

export default MarketplacePage;
