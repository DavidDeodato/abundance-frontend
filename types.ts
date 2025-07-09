
export enum Page {
  DashboardPrincipal = 'DASHBOARD_PRINCIPAL',
  MeusAtivosProjetos = 'MEUS_ATIVOS_PROJETOS',
  MapeieSuaTerra = 'MAPEIE_SUA_TERRA', // This will be the main hub
  Marketplace = 'MARKETPLACE',
  EcossistemaSyntropy = 'ECOSSISTEMA_SYNTROPY',
  ConfiguracoesConta = 'CONFIGURACOES_CONTA',
}

export interface NavItem {
  id: Page;
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  subItems?: NavItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface Project {
  id: string;
  name: string;
  type: string;
  status: 'Validado' | 'Analisando' | 'Pendente';
  progress: number;
  estimatedRevenue: string;
  nextAction: string;
  location?: string;
  area?: string;
  rating?: number;
  reviews?: number;
  description?: string;
  tags?: string[];
  imageUrl?: string;
  pricePerCredit?: number;
  totalCredits?: number;
}

export interface Partner {
  id: string;
  name: string;
  cardIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  isVerified?: boolean;
  location: string;
  distance?: string;
  compatibility?: number;
  partnerType: string;
  description: string;
  specialtyTags: string[];
  rating?: number;
  reviews?: number;
  priceRange?: string;
  capacity?: string;
  certificationTags: string[];
  contactActions?: {
    phone?: boolean;
    email?: boolean;
    site?: boolean;
  };
}

export interface ValorizeForestFormData {
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
    documentosProjeto: File[]; // Store File objects directly
    fotosArea: File[];       // Store File objects directly
  };
  aceitaTermos: boolean;
}
