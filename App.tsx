
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Page, NavItem } from './types';
import { NAV_ITEMS, PAGE_TITLES, AbundanceLogoIcon, ChevronDownIcon, SparklesIcon, PlusIcon } from './constants';
import AbundanceAIGem from './components/AbundanceAIGem';
import { AbundanceFlowProvider, useAbundanceNavigation } from './contexts/AbundanceFlowContext';
import { userSession, userApi, handleApiError } from './services/apiService';

// Import Page Components
import DashboardPrincipalPage from './pages/DashboardPrincipalPage';
import MapeieSuaTerraIntegrated from './components/MapeieSuaTerraIntegrated';
import AvalieSuaTerraIntegrated from './components/AvalieSuaTerraIntegrated';
import MarketplacePage from './pages/MarketplacePage';
import MeusAtivosProjetosPage from './pages/MeusAtivosProjetosPage';
import EcossistemaSyntropyPage from './pages/EcossistemaSyntropyPage';

// Placeholder for other pages
const ConfiguracoesContaPage: React.FC = () => <div className="p-6 text-xl">Conteúdo Configurações da Conta</div>;
const ValorizeSuaTerraPage: React.FC = () => <div className="p-6 text-xl">Conteúdo ValorizeSuaTerra (Em Breve)</div>;
const MonetizePage: React.FC = () => <div className="p-6 text-xl">Conteúdo Monetize (Em Breve)</div>;


const CriarNovaFlorestaFlow: React.FC = () => {
  const { currentTab } = useAbundanceNavigation();

  switch (currentTab) {
    case 'mapeie':
      return <MapeieSuaTerraIntegrated />;
    case 'avalie':
      return <AvalieSuaTerraIntegrated />;
    case 'valorize':
      return <ValorizeSuaTerraPage />;
    case 'monetize':
      return <MonetizePage />;
    default:
      return <MapeieSuaTerraIntegrated />;
  }
};


const LoginModal: React.FC<{ onClose: () => void; onLoginSuccess: (user: any) => void; }> = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Simulating login by fetching user by email.
      // In a real app, this would be a POST to /auth/login with email/password.
      const user = await userApi.getUserByEmail(email);
      userSession.setCurrentUser(user);
      onLoginSuccess(user);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full">
        <h2 className="text-2xl font-bold text-darkGray mb-4">Entrar ou Registrar</h2>
        <p className="text-mediumGray mb-6">Use seu email para continuar. Se não tiver conta, uma será criada.</p>
        <form onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full p-3 border border-gray-300 rounded-md mb-4"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-abundanceGreenDark text-white py-3 rounded-md font-semibold hover:bg-abundanceGreen transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Continuar com Email'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 text-sm text-mediumGray hover:text-darkGray"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};


const UserProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(userSession.getCurrentUser());

  useEffect(() => {
    const handleUserChange = () => {
      setCurrentUser(userSession.getCurrentUser());
    };
    // Custom event to handle user state changes across components
    window.addEventListener('userChanged', handleUserChange);
    return () => window.removeEventListener('userChanged', handleUserChange);
  }, []);

  const handleLogout = () => {
    userSession.clearCurrentUser();
    userSession.clearAllFlowData(); // Clear flow state on logout
    window.dispatchEvent(new Event('userChanged'));
    setIsOpen(false);
    // Optionally, redirect to a public page
  };

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    window.dispatchEvent(new Event('userChanged'));
  };

  if (!currentUser) {
    return (
      <>
        <button onClick={() => setIsLoginModalOpen(true)} className="bg-abundanceGreenDark text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-abundanceGreen transition-colors">
          Entrar / Registrar
        </button>
        {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={handleLoginSuccess} />}
      </>
    );
  }

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700">
        <img src={`https://i.pravatar.cc/40?u=${currentUser.email}`} alt="User Avatar" className="w-8 h-8 rounded-full" />
        <span className="text-white text-sm hidden md:block">{currentUser.full_name}</span>
        <ChevronDownIcon className="w-4 h-4 text-white hidden md:block" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meu Perfil</a>
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configurações</a>
          <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sair</button>
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, setIsOpen }) => {
  const handleNavigation = (page: Page) => {
    onNavigate(page);
    if (window.innerWidth < 768) { // md breakpoint
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"></div>}
      
      <aside className={`fixed top-0 left-0 h-full bg-darkGray text-white w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col`}>
        <div className="p-4 flex items-center space-x-3 border-b border-gray-700">
          <AbundanceLogoIcon className="h-10 w-10 text-abundanceGreen" />
          <span className="text-xl font-semibold">Abundance Brasil</span>
        </div>
        <nav className="flex-grow p-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-md text-sm hover:bg-gray-700 transition-colors ${currentPage === item.id ? 'bg-abundanceGreenDark text-white' : 'text-gray-300'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
          Forest OS do Brasil &copy; {new Date().getFullYear()}
        </div>
      </aside>
    </>
  );
};


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.MapeieSuaTerra); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
    if (window.innerWidth < 768) { 
      setIsSidebarOpen(false);
    }
  }, []);

  const currentPageTitle = useMemo(() => PAGE_TITLES[currentPage] || 'Abundance Brasil', [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.DashboardPrincipal:
        return <DashboardPrincipalPage />;
      case Page.MeusAtivosProjetos:
        return <MeusAtivosProjetosPage onNavigate={handleNavigate} />;
      case Page.MapeieSuaTerra:
        return <CriarNovaFlorestaFlow />;
      case Page.Marketplace:
        return <MarketplacePage />;
      case Page.EcossistemaSyntropy:
        return <EcossistemaSyntropyPage />;
      case Page.ConfiguracoesConta:
        return <ConfiguracoesContaPage />;
      default:
        // This case handles any Page enum value that might not have a dedicated render path
        // For example, if AvalieSuaTerra or CriarNovaFloresta were still in Page enum but not handled.
        // Since we removed them from Page enum, this default is less likely to be hit for those specific old pages.
        const exhaustiveCheck: never = currentPage; 
        console.warn(`Unhandled page: ${exhaustiveCheck}`);
        return <div className="p-6 text-xl">Página não encontrada ou em desenvolvimento.</div>;
    }
  };

  return (
    <AbundanceFlowProvider>
      <div className="flex h-screen bg-offWhite">
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="bg-white shadow-md p-4 flex justify-between items-center md:ml-64">
            <div className="flex items-center">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 focus:outline-none md:hidden mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <h1 className="text-2xl font-semibold text-darkGray">{currentPageTitle}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-abundanceGreenDark text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-abundanceGreen transition-colors hidden sm:block">
                Fale com nosso time
              </button>
              <UserProfileDropdown />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-offWhite md:ml-64 p-6">
            {renderPage()}
          </main>
        </div>
        <AbundanceAIGem currentPage={currentPage} currentPageTitle={currentPageTitle} />
      </div>
    </AbundanceFlowProvider>
  );
};

export default App;
