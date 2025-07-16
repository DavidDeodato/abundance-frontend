const API_BASE_URL = 'http://localhost:8000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface User {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  profile?: string;
  created_at: string;
  updated_at: string;
}

interface UserCreateData {
  full_name: string;
  email: string;
  phone?: string;
  profile?: string;
}

// User API functions
export const userApi = {
  async createUser(userData: UserCreateData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create user');
    }

    const result: ApiResponse<User> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to create user');
    }

    return result.data;
  },

  async getUserById(userId: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get user');
    }

    const result: ApiResponse<User> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to get user');
    }

    return result.data;
  },

  async getUserByEmail(email: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/email/${encodeURIComponent(email)}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get user');
    }

    const result: ApiResponse<User> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to get user');
    }

    return result.data;
  },

  async createOrGetUserFromMapeieForm(userInfo: {
    fullName: string;
    email: string;
    phone?: string;
    profile?: string;
  }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/from-mapeie-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create/get user from MapeieSuaTerra form');
    }

    const result: ApiResponse<User> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to create/get user from MapeieSuaTerra form');
    }

    return result.data;
  },

  async validateUserForFlow(userId: number): Promise<{ user: User; valid: boolean }> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/validate`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'User validation failed');
    }

    const result: ApiResponse<User> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'User validation failed');
    }

    return { user: result.data, valid: true };
  },

  async updateUser(userId: number, updateData: Partial<UserCreateData>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update user');
    }

    const result: ApiResponse<User> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to update user');
    }

    return result.data;
  },
};

// Health check function
export const healthApi = {
  async checkHealth(): Promise<{ status: string; database: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);

    if (!response.ok) {
      throw new Error('Backend is not responding');
    }

    return await response.json();
  },
};

// Generic error handler
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Relatorio API functions (Aba 1 - MapeieSuaTerra)
interface MapeieSubmissionData {
  address: string;
  selectedAreaName: string;
  userInfo: {
    fullName: string;
    email: string;
    phone?: string;
    profile?: string;
  };
  geojson?: any; // Adicionar o campo geojson opcional
}

interface MapeieResponse {
  success: boolean;
  relatorio_id: number;
  user_id: number;
  kpis: Record<string, string>;
  message: string;
}

export const relatorioApi = {
  async processMapeieSubmission(data: MapeieSubmissionData): Promise<MapeieResponse> {
    const response = await fetch(`${API_BASE_URL}/relatorios/process-mapeie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to process MapeieSuaTerra submission');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to process MapeieSuaTerra submission');
    }

    return result;
  },

  async getRelatorioById(relatorioId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/relatorios/${relatorioId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get relatorio');
    }

    const result: ApiResponse<any> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to get relatorio');
    }

    return result.data;
  },

  async getRelatorioKpis(relatorioId: number): Promise<Record<string, string>> {
    const response = await fetch(`${API_BASE_URL}/relatorios/${relatorioId}/kpis`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get relatorio KPIs');
    }

    const result: ApiResponse<Record<string, string>> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to get relatorio KPIs');
    }

    return result.data;
  },

  async validateRelatorioForAba2(relatorioId: number): Promise<{
    relatorio: any;
    user: User;
    valid: boolean;
    ready_for_aba2: boolean;
  }> {
    const response = await fetch(`${API_BASE_URL}/relatorios/${relatorioId}/validate-for-aba2`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Relatorio validation failed');
    }

    const result = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Relatorio validation failed');
    }

    return result.data;
  },

  async getRelatoriosByUser(userId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/relatorios/user/${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get user relatorios');
    }

    const result: ApiResponse<any[]> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to get user relatorios');
    }

    return result.data;
  },

  async getLatestRelatorioByUser(userId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/relatorios/user/${userId}/latest`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get latest relatorio');
    }

    const result: ApiResponse<any> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to get latest relatorio');
    }

    return result.data;
  },
};

// Projecao API functions (Aba 2 - AvalieSuaTerra)
export const projecaoApi = {
  async gerarProjecaoAvalieTerra(relatorioId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/projecoes/gerar-avalie-terra/${relatorioId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to generate AvalieSuaTerra projection');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to generate projection');
    }
    return result.data;
  },

  async buscarProjecaoPorRelatorio(relatorioId: number, userId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/projecoes/por-relatorio/${relatorioId}?user_id=${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get projection');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to get projection');
    }

    return result.data;
  },

  async listarProjecoesUsuario(userId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/projecoes/por-usuario/${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to list user projections');
    }

    return await response.json();
  },

  async buscarProjecaoCompleta(projecaoId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/projecoes/completa/${projecaoId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get complete projection');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to get complete projection');
    }

    return result.data;
  },
};

// Floresta API functions (Aba 3 - ValorizeSuaTerra)
export const florestaApi = {
  async obterDadosPrePopulacao(relatorioId: number, projecaoId: number, userId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/florestas/pre-popular/${relatorioId}/${projecaoId}?user_id=${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get pre-population data');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to get pre-population data');
    }

    return result.data;
  },

  async criarProjetoFlorestal(userId: number, relatorioId: number, projecaoId: number, formData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/florestas/criar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        relatorio_id: relatorioId,
        projecao_id: projecaoId,
        form_data: formData
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create forest project');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to create forest project');
    }

    return result.data;
  },

  async salvarRascunhoProjeto(florestaId: number, userId: number, formData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/florestas/salvar-rascunho/${florestaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        form_data: formData
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to save draft');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to save draft');
    }

    return result.data;
  },

  async listarProjetosUsuario(userId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/florestas/por-usuario/${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to list user projects');
    }

    return await response.json();
  },

  async buscarProjetoCompleto(florestaId: number, userId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/florestas/completo/${florestaId}?user_id=${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get complete project');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to get complete project');
    }

    return result.data;
  },

  async obterEstatisticasUsuario(userId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/florestas/estatisticas/${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get user statistics');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to get user statistics');
    }

    return result.data;
  },

  async listarProjetosMarketplaceReady(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/florestas/marketplace-ready`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to list marketplace ready projects');
    }

    return await response.json();
  },

  async aprovarProjetoMarketplace(florestaId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/florestas/aprovar-marketplace/${florestaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to approve project for marketplace');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to approve project for marketplace');
    }

    return result.data;
  },

  async createFloresta(formData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/florestas/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create forest project');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to create forest project');
    }
    return result.data;
  },

  async getMarketplaceProjetos(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/florestas/marketplace`);
    if (!response.ok) {
        throw new Error('Failed to fetch marketplace projects');
    }
    const result = await response.json();
    return result.data;
  },
};

// Flow API - Helpers for the complete 4-tab flow
export const flowApi = {
  async validateFlowState(userId: number): Promise<{
    user: User;
    latest_relatorio?: any;
    latest_projecao?: any;
    latest_floresta?: any;
    can_access: {
      mapeie: boolean;
      avalie: boolean;
      valorize: boolean;
      monetize: boolean;
    };
  }> {
    // This will be a composite call to check user's flow state
    try {
      const user = await userApi.getUserById(userId);
      const relatorios = await relatorioApi.getRelatoriosByUser(userId);
      
      const latest_relatorio = relatorios.length > 0 ? relatorios[0] : null;
      let latest_projecao = null;
      let latest_floresta = null;
      
      if (latest_relatorio) {
        try {
          latest_projecao = await projecaoApi.buscarProjecaoPorRelatorio(latest_relatorio.id, userId);
        } catch {
          // No projection yet
        }
      }
      
      if (latest_projecao) {
        try {
          const projetos = await florestaApi.listarProjetosUsuario(userId);
          latest_floresta = projetos.length > 0 ? projetos[0] : null;
        } catch {
          // No forest project yet
        }
      }
      
      return {
        user,
        latest_relatorio,
        latest_projecao,
        latest_floresta,
        can_access: {
          mapeie: true,
          avalie: !!latest_relatorio,
          valorize: !!latest_projecao,
          monetize: !!latest_floresta,
        }
      };
    } catch (error) {
      throw new Error(`Failed to validate flow state: ${handleApiError(error)}`);
    }
  },

  async completeAba1AndPrepareAba2(data: MapeieSubmissionData): Promise<{
    relatorio: any;
    user: User;
    next_step: 'avalie';
  }> {
    const mapeieResult = await relatorioApi.processMapeieSubmission(data);
    const user = await userApi.getUserById(mapeieResult.user_id);
    const relatorio = await relatorioApi.getRelatorioById(mapeieResult.relatorio_id);
    
    return {
      relatorio,
      user,
      next_step: 'avalie'
    };
  },

  async completeAba2AndPrepareAba3(relatorioId: number, userId: number): Promise<{
    projecao: any;
    pre_population_data: any;
    next_step: 'valorize';
  }> {
    const projecao = await projecaoApi.gerarProjecaoAvalieTerra(relatorioId);
    const prePopulationData = await florestaApi.obterDadosPrePopulacao(relatorioId, projecao.id, userId);
    
    return {
      projecao,
      pre_population_data: prePopulationData,
      next_step: 'valorize'
    };
  },

  async completeAba3AndPrepareAba4(userId: number, relatorioId: number, projecaoId: number, formData: any): Promise<{
    floresta: any;
    marketplace_ready: boolean;
    next_step: 'monetize';
  }> {
    const floresta = await florestaApi.criarProjetoFlorestal(userId, relatorioId, projecaoId, formData);
    
    return {
      floresta,
      marketplace_ready: floresta.status_marketplace === 'pending_approval' || floresta.status_marketplace === 'approved',
      next_step: 'monetize'
    };
  },
};

// Enhanced health check with all modules
export const enhancedHealthApi = {
  async checkAllServices(): Promise<{
    backend: any;
    projecoes: any;
    florestas: any;
    overall_status: 'healthy' | 'degraded' | 'unhealthy';
  }> {
    try {
      const [backend, projecoes, florestas] = await Promise.allSettled([
        fetch(`${API_BASE_URL.replace('/api', '')}/health`).then(r => r.json()),
        fetch(`${API_BASE_URL}/projecoes/health`).then(r => r.json()),
        fetch(`${API_BASE_URL}/florestas/health`).then(r => r.json()),
      ]);

      const backendHealth = backend.status === 'fulfilled' ? backend.value : { status: 'unhealthy', error: backend.reason };
      const projecoesHealth = projecoes.status === 'fulfilled' ? projecoes.value : { status: 'unhealthy', error: projecoes.reason };
      const florestasHealth = florestas.status === 'fulfilled' ? florestas.value : { status: 'unhealthy', error: florestas.reason };

      const healthyCount = [backendHealth, projecoesHealth, florestasHealth]
        .filter(h => h.status === 'healthy').length;

      let overall_status: 'healthy' | 'degraded' | 'unhealthy';
      if (healthyCount === 3) overall_status = 'healthy';
      else if (healthyCount >= 1) overall_status = 'degraded';
      else overall_status = 'unhealthy';

      return {
        backend: backendHealth,
        projecoes: projecoesHealth,
        florestas: florestasHealth,
        overall_status
      };
    } catch (error) {
      return {
        backend: { status: 'unhealthy', error: 'Failed to connect' },
        projecoes: { status: 'unhealthy', error: 'Failed to connect' },
        florestas: { status: 'unhealthy', error: 'Failed to connect' },
        overall_status: 'unhealthy'
      };
    }
  },
};

// Local storage helpers for basic user session
export const userSession = {
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      // If parsing fails, clear the corrupted item
      localStorage.removeItem('currentUser');
      return null;
    }
  },

  setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  clearCurrentUser(): void {
    localStorage.removeItem('currentUser');
  },

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  },

  // Enhanced session management for flow state
  getFlowState(): any {
    const flowStr = localStorage.getItem('abundanceFlowState');
    return flowStr ? JSON.parse(flowStr) : null;
  },

  setFlowState(flowState: any): void {
    localStorage.setItem('abundanceFlowState', JSON.stringify(flowState));
  },

  clearFlowState(): void {
    localStorage.removeItem('abundanceFlowState');
  },

  // Persistence helpers for each tab
  getMapeieState(): any {
    const mapeieStr = localStorage.getItem('mapeieState');
    return mapeieStr ? JSON.parse(mapeieStr) : null;
  },

  setMapeieState(mapeieState: any): void {
    localStorage.setItem('mapeieState', JSON.stringify(mapeieState));
  },

  getValorizeFormData(): any {
    const valorizeStr = localStorage.getItem('valorizeFormData');
    return valorizeStr ? JSON.parse(valorizeStr) : null;
  },

  setValorizeFormData(formData: any): void {
    localStorage.setItem('valorizeFormData', JSON.stringify(formData));
  },

  clearAllFlowData(): void {
    this.clearFlowState();
    localStorage.removeItem('mapeieState');
    localStorage.removeItem('valorizeFormData');
  },
}; 