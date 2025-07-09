import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Tipos para o estado compartilhado
export interface UserInfoData {
  fullName: string;
  email: string;
  phone: string;
  profile: string;
}

export interface MapeieResults {
  relatorio_id?: number;
  area_observada: string;
  arvores_existentes: string;
  carbono_sequestrado: string;
  elegivel_plantio: string;
  potencial_carbono: string;
  creditos_gerados: string;
  selected_area_name: string;
  address: string;
  user_info: UserInfoData;
}

export interface AvalieResults {
  projecao_id?: number;
  sumario_executivo: Record<string, any>;
  fatos_car: Record<string, any>;
  capex_estimado: Record<string, any>;
  receitas_medias: Record<string, any>;
  roadmap: Record<string, any>;
  riscos_mitigacoes: Record<string, any>;
}

export interface ValorizeFormData {
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
    especiesNativasPrincipais: Record<string, boolean>;
    dataPlantio: string;
    numeroArvores: string;
    densidadeArvoresHa: string;
  };
  monitoramentoCertificacao: {
    metodologiaCarbono: string;
    certificacoes: Record<string, boolean>;
    responsavelTecnico: string;
    cronogramaMonitoramento: string;
    frequenciaMonitoramento: string;
  };
  impactoSocial: {
    comunidadeLocalEnvolvida: string;
    beneficiosSociais: Record<string, boolean>;
    empregosGeradosEstimativa: string;
  };
  documentosFotos: {
    documentosProjeto: File[];
    fotosArea: File[];
  };
  aceitaTermos: boolean;
}

export interface MonetizeData {
  floresta_id?: number;
  status_marketplace: string;
  completude_percentual: number;
}

// Estado do fluxo completo
export interface AbundanceFlowState {
  // Controle de navegação
  currentTab: 'mapeie' | 'avalie' | 'valorize' | 'monetize';
  completedTabs: Set<string>;
  
  // Estados específicos de cada aba
  mapeie: {
    step: 'initial' | 'area_defined' | 'user_info_form' | 'analysis_results';
    results: MapeieResults | null;
    loading: boolean;
    error: string | null;
  };
  
  avalie: {
    results: AvalieResults | null;
    loading: boolean;
    error: string | null;
  };
  
  valorize: {
    currentStep: number;
    formData: ValorizeFormData;
    completionPercentage: number;
    loading: boolean;
    error: string | null;
    isDraft: boolean;
  };
  
  monetize: {
    data: MonetizeData | null;
    loading: boolean;
    error: string | null;
  };
  
  // Controle global
  user_id: number | null;
  loading: boolean;
  error: string | null;
}

// Ações disponíveis
export type AbundanceFlowAction =
  // Navegação
  | { type: 'SET_CURRENT_TAB'; payload: AbundanceFlowState['currentTab'] }
  | { type: 'MARK_TAB_COMPLETED'; payload: string }
  | { type: 'SET_USER_ID'; payload: number }
  
  // Aba 1 - Mapeie
  | { type: 'SET_MAPEIE_STEP'; payload: AbundanceFlowState['mapeie']['step'] }
  | { type: 'SET_MAPEIE_LOADING'; payload: boolean }
  | { type: 'SET_MAPEIE_RESULTS'; payload: MapeieResults }
  | { type: 'SET_MAPEIE_ERROR'; payload: string | null }
  | { type: 'RESET_MAPEIE' }
  
  // Aba 2 - Avalie
  | { type: 'SET_AVALIE_LOADING'; payload: boolean }
  | { type: 'SET_AVALIE_RESULTS'; payload: AvalieResults }
  | { type: 'SET_AVALIE_ERROR'; payload: string | null }
  
  // Aba 3 - Valorize
  | { type: 'SET_VALORIZE_STEP'; payload: number }
  | { type: 'SET_VALORIZE_FORM_DATA'; payload: Partial<ValorizeFormData> }
  | { type: 'SET_VALORIZE_COMPLETION'; payload: number }
  | { type: 'SET_VALORIZE_LOADING'; payload: boolean }
  | { type: 'SET_VALORIZE_ERROR'; payload: string | null }
  | { type: 'SET_VALORIZE_DRAFT_STATUS'; payload: boolean }
  | { type: 'PREPOPULATE_VALORIZE_FORM'; payload: Partial<ValorizeFormData> }
  
  // Aba 4 - Monetize
  | { type: 'SET_MONETIZE_LOADING'; payload: boolean }
  | { type: 'SET_MONETIZE_DATA'; payload: MonetizeData }
  | { type: 'SET_MONETIZE_ERROR'; payload: string | null }
  
  // Global
  | { type: 'SET_GLOBAL_LOADING'; payload: boolean }
  | { type: 'SET_GLOBAL_ERROR'; payload: string | null }
  | { type: 'RESET_FLOW' };

// Estado inicial
const initialValorizeFormData: ValorizeFormData = {
  informacoesBasicas: { nomeProjeto: '', descricaoProjeto: '', tipoProjeto: '', objetivoPrincipal: '' },
  localizacaoCAR: { estado: '', cidade: '', enderecoCompleto: '', codigoCAR: '', latitude: '', longitude: '', areaTotalHa: '' },
  caracteristicasFloresta: { bioma: '', especiesNativasPrincipais: {}, dataPlantio: '', numeroArvores: '', densidadeArvoresHa: '' },
  monitoramentoCertificacao: { metodologiaCarbono: '', certificacoes: {}, responsavelTecnico: '', cronogramaMonitoramento: '', frequenciaMonitoramento: '' },
  impactoSocial: { comunidadeLocalEnvolvida: '', beneficiosSociais: {}, empregosGeradosEstimativa: '' },
  documentosFotos: { documentosProjeto: [], fotosArea: [] },
  aceitaTermos: false,
};

const initialState: AbundanceFlowState = {
  currentTab: 'mapeie',
  completedTabs: new Set(),
  
  mapeie: {
    step: 'initial',
    results: null,
    loading: false,
    error: null,
  },
  
  avalie: {
    results: null,
    loading: false,
    error: null,
  },
  
  valorize: {
    currentStep: 0,
    formData: initialValorizeFormData,
    completionPercentage: 0,
    loading: false,
    error: null,
    isDraft: false,
  },
  
  monetize: {
    data: null,
    loading: false,
    error: null,
  },
  
  user_id: null,
  loading: false,
  error: null,
};

// Reducer
function abundanceFlowReducer(state: AbundanceFlowState, action: AbundanceFlowAction): AbundanceFlowState {
  switch (action.type) {
    // Navegação
    case 'SET_CURRENT_TAB':
      return { ...state, currentTab: action.payload };
      
    case 'MARK_TAB_COMPLETED':
      return { 
        ...state, 
        completedTabs: new Set([...state.completedTabs, action.payload]) 
      };
      
    case 'SET_USER_ID':
      return { ...state, user_id: action.payload };
    
    // Aba 1 - Mapeie
    case 'SET_MAPEIE_STEP':
      return {
        ...state,
        mapeie: { ...state.mapeie, step: action.payload }
      };
      
    case 'SET_MAPEIE_LOADING':
      return {
        ...state,
        mapeie: { ...state.mapeie, loading: action.payload }
      };
      
    case 'SET_MAPEIE_RESULTS':
      return {
        ...state,
        mapeie: { ...state.mapeie, results: action.payload, error: null }
      };
      
    case 'SET_MAPEIE_ERROR':
      return {
        ...state,
        mapeie: { ...state.mapeie, error: action.payload }
      };
      
    case 'RESET_MAPEIE':
      return {
        ...state,
        mapeie: initialState.mapeie,
        completedTabs: new Set([...state.completedTabs].filter(tab => tab !== 'mapeie'))
      };
    
    // Aba 2 - Avalie
    case 'SET_AVALIE_LOADING':
      return {
        ...state,
        avalie: { ...state.avalie, loading: action.payload }
      };
      
    case 'SET_AVALIE_RESULTS':
      return {
        ...state,
        avalie: { ...state.avalie, results: action.payload, error: null }
      };
      
    case 'SET_AVALIE_ERROR':
      return {
        ...state,
        avalie: { ...state.avalie, error: action.payload }
      };
    
    // Aba 3 - Valorize
    case 'SET_VALORIZE_STEP':
      return {
        ...state,
        valorize: { ...state.valorize, currentStep: action.payload }
      };
      
    case 'SET_VALORIZE_FORM_DATA':
      return {
        ...state,
        valorize: { 
          ...state.valorize, 
          formData: { ...state.valorize.formData, ...action.payload } 
        }
      };
      
    case 'SET_VALORIZE_COMPLETION':
      return {
        ...state,
        valorize: { ...state.valorize, completionPercentage: action.payload }
      };
      
    case 'SET_VALORIZE_LOADING':
      return {
        ...state,
        valorize: { ...state.valorize, loading: action.payload }
      };
      
    case 'SET_VALORIZE_ERROR':
      return {
        ...state,
        valorize: { ...state.valorize, error: action.payload }
      };
      
    case 'SET_VALORIZE_DRAFT_STATUS':
      return {
        ...state,
        valorize: { ...state.valorize, isDraft: action.payload }
      };
      
    case 'PREPOPULATE_VALORIZE_FORM':
      return {
        ...state,
        valorize: { 
          ...state.valorize, 
          formData: { ...state.valorize.formData, ...action.payload } 
        }
      };
    
    // Aba 4 - Monetize
    case 'SET_MONETIZE_LOADING':
      return {
        ...state,
        monetize: { ...state.monetize, loading: action.payload }
      };
      
    case 'SET_MONETIZE_DATA':
      return {
        ...state,
        monetize: { ...state.monetize, data: action.payload, error: null }
      };
      
    case 'SET_MONETIZE_ERROR':
      return {
        ...state,
        monetize: { ...state.monetize, error: action.payload }
      };
    
    // Global
    case 'SET_GLOBAL_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_GLOBAL_ERROR':
      return { ...state, error: action.payload };
      
    case 'RESET_FLOW':
      return initialState;
      
    default:
      return state;
  }
}

// Context
const AbundanceFlowContext = createContext<{
  state: AbundanceFlowState;
  dispatch: React.Dispatch<AbundanceFlowAction>;
} | null>(null);

// Provider
export const AbundanceFlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(abundanceFlowReducer, initialState);

  return (
    <AbundanceFlowContext.Provider value={{ state, dispatch }}>
      {children}
    </AbundanceFlowContext.Provider>
  );
};

// Hook customizado
export const useAbundanceFlow = () => {
  const context = useContext(AbundanceFlowContext);
  if (!context) {
    throw new Error('useAbundanceFlow deve ser usado dentro de AbundanceFlowProvider');
  }
  return context;
};

// Hooks especializados para cada aba
export const useMapeieFlow = () => {
  const { state, dispatch } = useAbundanceFlow();
  
  return {
    // Estado
    step: state.mapeie.step,
    results: state.mapeie.results,
    loading: state.mapeie.loading,
    error: state.mapeie.error,
    
    // Ações
    setStep: (step: AbundanceFlowState['mapeie']['step']) => 
      dispatch({ type: 'SET_MAPEIE_STEP', payload: step }),
    setLoading: (loading: boolean) => 
      dispatch({ type: 'SET_MAPEIE_LOADING', payload: loading }),
    setResults: (results: MapeieResults) => 
      dispatch({ type: 'SET_MAPEIE_RESULTS', payload: results }),
    setError: (error: string | null) => 
      dispatch({ type: 'SET_MAPEIE_ERROR', payload: error }),
    reset: () => 
      dispatch({ type: 'RESET_MAPEIE' }),
    markCompleted: () => 
      dispatch({ type: 'MARK_TAB_COMPLETED', payload: 'mapeie' }),
  };
};

export const useAvalieFlow = () => {
  const { state, dispatch } = useAbundanceFlow();
  
  return {
    // Estado
    results: state.avalie.results,
    loading: state.avalie.loading,
    error: state.avalie.error,
    
    // Ações
    setLoading: (loading: boolean) => 
      dispatch({ type: 'SET_AVALIE_LOADING', payload: loading }),
    setResults: (results: AvalieResults) => 
      dispatch({ type: 'SET_AVALIE_RESULTS', payload: results }),
    setError: (error: string | null) => 
      dispatch({ type: 'SET_AVALIE_ERROR', payload: error }),
    markCompleted: () => 
      dispatch({ type: 'MARK_TAB_COMPLETED', payload: 'avalie' }),
  };
};

export const useValorizeFlow = () => {
  const { state, dispatch } = useAbundanceFlow();
  
  return {
    // Estado
    currentStep: state.valorize.currentStep,
    formData: state.valorize.formData,
    completionPercentage: state.valorize.completionPercentage,
    loading: state.valorize.loading,
    error: state.valorize.error,
    isDraft: state.valorize.isDraft,
    
    // Ações
    setStep: (step: number) => 
      dispatch({ type: 'SET_VALORIZE_STEP', payload: step }),
    setFormData: (data: Partial<ValorizeFormData>) => 
      dispatch({ type: 'SET_VALORIZE_FORM_DATA', payload: data }),
    setCompletion: (percentage: number) => 
      dispatch({ type: 'SET_VALORIZE_COMPLETION', payload: percentage }),
    setLoading: (loading: boolean) => 
      dispatch({ type: 'SET_VALORIZE_LOADING', payload: loading }),
    setError: (error: string | null) => 
      dispatch({ type: 'SET_VALORIZE_ERROR', payload: error }),
    setDraftStatus: (isDraft: boolean) => 
      dispatch({ type: 'SET_VALORIZE_DRAFT_STATUS', payload: isDraft }),
    prepopulateForm: (data: Partial<ValorizeFormData>) => 
      dispatch({ type: 'PREPOPULATE_VALORIZE_FORM', payload: data }),
    markCompleted: () => 
      dispatch({ type: 'MARK_TAB_COMPLETED', payload: 'valorize' }),
  };
};

export const useMonetizeFlow = () => {
  const { state, dispatch } = useAbundanceFlow();
  
  return {
    // Estado
    data: state.monetize.data,
    loading: state.monetize.loading,
    error: state.monetize.error,
    
    // Ações
    setLoading: (loading: boolean) => 
      dispatch({ type: 'SET_MONETIZE_LOADING', payload: loading }),
    setData: (data: MonetizeData) => 
      dispatch({ type: 'SET_MONETIZE_DATA', payload: data }),
    setError: (error: string | null) => 
      dispatch({ type: 'SET_MONETIZE_ERROR', payload: error }),
    markCompleted: () => 
      dispatch({ type: 'MARK_TAB_COMPLETED', payload: 'monetize' }),
  };
};

// Hook para navegação entre abas
export const useAbundanceNavigation = () => {
  const { state, dispatch } = useAbundanceFlow();
  
  const canNavigateTo = (tab: AbundanceFlowState['currentTab']): boolean => {
    switch (tab) {
      case 'mapeie':
        return true; // Sempre pode voltar para aba 1
      case 'avalie':
        return state.completedTabs.has('mapeie'); // Precisa completar aba 1
      case 'valorize':
        return state.completedTabs.has('avalie'); // Precisa completar aba 2
      case 'monetize':
        return state.completedTabs.has('valorize'); // Precisa completar aba 3
      default:
        return false;
    }
  };
  
  const navigateTo = (tab: AbundanceFlowState['currentTab']) => {
    if (canNavigateTo(tab)) {
      dispatch({ type: 'SET_CURRENT_TAB', payload: tab });
    }
  };
  
  return {
    currentTab: state.currentTab,
    completedTabs: Array.from(state.completedTabs),
    canNavigateTo,
    navigateTo,
    setCurrentTab: (tab: AbundanceFlowState['currentTab']) => 
      dispatch({ type: 'SET_CURRENT_TAB', payload: tab }),
  };
}; 