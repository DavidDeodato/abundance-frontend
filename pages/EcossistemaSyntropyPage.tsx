import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Partner } from '../types';
import { 
  SearchIcon, FilterIcon, StarIcon, MapPinIcon, ChevronDownIcon,
  Squares2X2Icon, LeafIcon, WrenchScrewdriverIcon, ChatBubbleLeftEllipsisIcon,
  ComputerDesktopIcon, TruckIcon, CheckBadgeIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon,
  SimpleLeafIcon, WrenchIcon, ChipIcon, PresentationChartLineIcon
} from '../constants';

const mockPartnersData: Partner[] = [
  {
    id: '1',
    name: 'Viveiro Mata Atlântica',
    cardIcon: SimpleLeafIcon,
    isVerified: true,
    location: 'Cana Verde, MG',
    distance: '15km',
    compatibility: 95,
    partnerType: 'Viveiros',
    description: 'Especialista em produção de mudas nativas da Mata Atlântica com certificação FSC.',
    specialtyTags: ['Espécies Nativas', 'Mudas Certificadas', 'Mata Atlântica'],
    rating: 4.9,
    reviews: 127,
    priceRange: 'R$ 2,50 - R$ 8,00 por muda',
    capacity: '500.000 mudas/ano',
    certificationTags: ['FSC', 'IBAMA', 'MAPA'],
    contactActions: { phone: true, email: true, site: true },
  },
  {
    id: '2',
    name: 'Café Sustentável Consultoria',
    cardIcon: WrenchIcon,
    isVerified: true,
    location: 'Espírito Santo, ES',
    distance: '180km',
    compatibility: 88,
    partnerType: 'Consultoria',
    description: 'Implementação de sistemas agroflorestais com café, especialista em certificações sustentáveis.',
    specialtyTags: ['Sistema Agroflorestal', 'Café Sombreado', 'Certificação Orgânica'],
    rating: 4.8,
    reviews: 89,
    priceRange: 'R$ 15.000 - R$ 25.000 por hectare',
    capacity: '100 hectares/ano',
    certificationTags: ['Rainforest Alliance', 'Orgânico Brasil', 'UTZ'],
    contactActions: { phone: true, email: true, site: true },
  },
  {
    id: '3',
    name: 'EcoTech Monitoramento',
    cardIcon: ChipIcon,
    isVerified: true,
    location: 'São Paulo, SP',
    distance: '250km',
    compatibility: 82,
    partnerType: 'Tecnologia',
    description: 'Soluções tecnológicas para monitoramento florestal com IA e análise satelital.',
    specialtyTags: ['Monitoramento Satelital', 'IA Florestal', 'MRV'],
    rating: 4.7,
    reviews: 156,
    priceRange: 'R$ 5.000 - R$ 15.000 por projeto',
    capacity: 'Ilimitado',
    certificationTags: ['ISO 27001', 'SOC 2', 'Gold Standard'],
    contactActions: { email: true, site: true },
  },
  {
    id: '4',
    name: 'Verde Implementações',
    cardIcon: PresentationChartLineIcon, // Using this as a generic 'implementer' icon
    isVerified: false,
    location: 'Goiás, GO',
    distance: '120km',
    compatibility: 90,
    partnerType: 'Implementadores',
    description: 'Empresa especializada em implementação de projetos de reflorestamento e restauração.',
    specialtyTags: ['Reflorestamento', 'Restauração Ecológica', 'Manejo Florestal'],
    rating: 4.6,
    reviews: 203,
    priceRange: 'R$ 8.000 - R$ 18.000 por hectare',
    capacity: '200 hectares/ano',
    certificationTags: ['CERFLOR'],
    contactActions: { phone: true, site: true },
  },
   {
    id: '5',
    name: 'Logística Florestal Express',
    cardIcon: TruckIcon,
    isVerified: true,
    location: 'Paraná, PR',
    distance: '300km',
    compatibility: 92,
    partnerType: 'Logística',
    description: 'Transporte especializado para mudas e insumos florestais em todo o Brasil.',
    specialtyTags: ['Transporte Refrigerado', 'Logística Reversa', 'Grandes Volumes'],
    rating: 4.9,
    reviews: 75,
    priceRange: 'Sob Consulta',
    capacity: 'Frota Nacional',
    certificationTags: ['ISO 9001', 'SASSMAQ'],
    contactActions: { phone: true, email: true },
  },
];

const partnerTypeFilters = [
  { label: 'Todos', icon: Squares2X2Icon, type: 'Todos' },
  { label: 'Viveiros', icon: SimpleLeafIcon, type: 'Viveiros' },
  { label: 'Implementadores', icon: WrenchScrewdriverIcon, type: 'Implementadores' },
  { label: 'Consultoria', icon: ChatBubbleLeftEllipsisIcon, type: 'Consultoria' },
  { label: 'Tecnologia', icon: ComputerDesktopIcon, type: 'Tecnologia' },
  { label: 'Logística', icon: TruckIcon, type: 'Logística' },
];

const regionOptions = ["Todas as Regiões", "Sudeste", "Nordeste", "Norte", "Sul", "Centro-Oeste"];


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
        <span>{selectedValue === 'Todas as Regiões' ? label : selectedValue}</span>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
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

const PartnerCard: React.FC<{ partner: Partner }> = ({ partner }) => {
    const CardIcon = partner.cardIcon;
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full transform hover:shadow-xl transition-shadow duration-300">
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                        <div className="bg-abundanceGreen/10 p-3 rounded-lg">
                             <CardIcon className="w-7 h-7 text-abundanceGreenDark" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-darkGray flex items-center">
                                {partner.name}
                                {partner.isVerified && <CheckBadgeIcon className="w-5 h-5 text-primaryBlue ml-1.5" aria-label="Parceiro Verificado"/>}
                            </h3>
                            <div className="text-xs text-mediumGray flex items-center">
                                <MapPinIcon className="w-3 h-3 mr-1 text-lightGray"/> {partner.location} {partner.distance && `• ${partner.distance}`}
                            </div>
                        </div>
                    </div>
                    {partner.compatibility && (
                        <div className="text-right">
                            <p className="text-2xl font-bold text-abundanceGreenDark">{partner.compatibility}%</p>
                            <p className="text-xs text-mediumGray -mt-1">compatibilidade</p>
                        </div>
                    )}
                </div>

                <p className="text-sm text-mediumGray mb-3 text-clip overflow-hidden line-clamp-2 min-h-[40px]">{partner.description}</p>

                <div className="mb-3">
                    {partner.specialtyTags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-blue-100 text-primaryBlue px-2 py-0.5 rounded-full mr-1.5 mb-1 inline-block">{tag}</span>
                    ))}
                </div>

                {partner.rating && partner.reviews && (
                    <div className="flex items-center text-sm text-yellow-500 mb-3">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`w-4 h-4 ${i < Math.round(partner.rating!) ? 'text-yellow-500' : 'text-gray-300'}`} />
                        ))}
                        <span className="ml-1.5 text-mediumGray">{partner.rating.toFixed(1)} ({partner.reviews} avaliações)</span>
                    </div>
                )}
                
                <div className="text-xs text-mediumGray space-y-1 mb-3">
                    {partner.priceRange && <p><strong>Faixa de Preço:</strong> {partner.priceRange}</p>}
                    {partner.capacity && <p><strong>Capacidade:</strong> {partner.capacity}</p>}
                </div>

                {partner.certificationTags.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs font-semibold text-mediumGray mb-1">Certificações:</p>
                        <div className="flex flex-wrap gap-1.5">
                        {partner.certificationTags.slice(0,3).map(tag => (
                            <span key={tag} className="text-xs bg-green-100 text-abundanceGreenDark px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-auto p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-1">
                        {partner.contactActions?.phone && <button className="p-2 rounded-full hover:bg-gray-200 text-mediumGray" title="Ligar"><PhoneIcon className="w-5 h-5"/></button>}
                        {partner.contactActions?.email && <button className="p-2 rounded-full hover:bg-gray-200 text-mediumGray" title="Email"><EnvelopeIcon className="w-5 h-5"/></button>}
                        {partner.contactActions?.site && <button className="p-2 rounded-full hover:bg-gray-200 text-mediumGray" title="Site"><GlobeAltIcon className="w-5 h-5"/></button>}
                    </div>
                    <button className="bg-abundanceGreenDark text-white px-4 py-2 rounded-md hover:bg-abundanceGreen transition-colors text-sm font-semibold flex-grow sm:flex-grow-0 text-center">
                        Solicitar Orçamento
                    </button>
                </div>
            </div>
        </div>
    );
};


const EcossistemaSyntropyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('Todas as Regiões');
  const [activePartnerTypeFilter, setActivePartnerTypeFilter] = useState('Todos');
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  
  const regionDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target as Node)) {
        setIsRegionDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPartners = useMemo(() => {
    return mockPartnersData.filter(partner => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm = 
        partner.name.toLowerCase().includes(searchTermLower) ||
        partner.description.toLowerCase().includes(searchTermLower) ||
        partner.specialtyTags.some(tag => tag.toLowerCase().includes(searchTermLower)) ||
        partner.certificationTags.some(tag => tag.toLowerCase().includes(searchTermLower));

      const matchesRegion = regionFilter === 'Todas as Regiões' || partner.location.includes(regionFilter); // Simplified region check
      
      const matchesPartnerType = activePartnerTypeFilter === 'Todos' || partner.partnerType === activePartnerTypeFilter;

      return matchesSearchTerm && matchesRegion && matchesPartnerType;
    });
  }, [searchTerm, regionFilter, activePartnerTypeFilter]);


  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-darkGray mb-1">Diretório de Parceiros Verificados</h2>
        <p className="text-sm text-mediumGray mb-6">Encontre os melhores viveiros, implementadores, consultores e auditores para seu projeto.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative md:col-span-1">
            <input
              type="text"
              placeholder="Buscar parceiros..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-abundanceGreenDark focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <CustomDropdown
            label="Todas as Regiões"
            options={regionOptions}
            selectedValue={regionFilter}
            onSelect={setRegionFilter}
            isOpen={isRegionDropdownOpen}
            setIsOpen={setIsRegionDropdownOpen}
            dropdownRef={regionDropdownRef}
          />
          <button className="w-full p-3 border border-gray-300 rounded-md bg-white text-left flex justify-between items-center text-mediumGray hover:border-gray-400">
            <span>Filtros Avançados</span>
            <FilterIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {partnerTypeFilters.map(filter => (
            <button
              key={filter.type}
              onClick={() => setActivePartnerTypeFilter(filter.type)}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors
                ${activePartnerTypeFilter === filter.type 
                  ? 'bg-abundanceGreenDark text-white shadow-md' 
                  : 'bg-gray-100 text-mediumGray hover:bg-gray-200'}`}
            >
              <filter.icon className={`w-4 h-4 mr-2 ${activePartnerTypeFilter === filter.type ? 'text-white' : 'text-gray-500'}`} />
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPartners.length > 0 ? (
          filteredPartners.map(partner => <PartnerCard key={partner.id} partner={partner} />)
        ) : (
          <p className="text-mediumGray col-span-full text-center py-10">Nenhum parceiro encontrado com os filtros atuais.</p>
        )}
      </section>
    </div>
  );
};

export default EcossistemaSyntropyPage;