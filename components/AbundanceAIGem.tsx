
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SparklesIcon } from '../constants';
import { ChatMessage, Page } from '../types';
import { generateContextualContent } from '../services/geminiService';

interface AbundanceAIGemProps {
  currentPage: Page;
  currentPageTitle: string;
}

const AbundanceAIGem: React.FC<AbundanceAIGemProps> = ({ currentPage, currentPageTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const getInitialContextualPrompt = useCallback((): string => {
    switch (currentPage) {
      case Page.DashboardPrincipal:
        return `Estou no ${currentPageTitle}. Poderia me dar um resumo da minha jornada de sustentabilidade ou sugerir próximos passos?`;
      case Page.MapeieSuaTerra:
        return `Estou na página ${currentPageTitle}. Quais são as considerações chave ao submeter um arquivo CAR ou KML?`;
      case Page.Marketplace:
        return `Estou visualizando o ${currentPageTitle}. Como posso encontrar os melhores projetos para compensação?`;
      default:
        return `Estou na página ${currentPageTitle}. Me ajude a entender melhor esta seção.`;
    }
  }, [currentPage, currentPageTitle]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const firstMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'ai',
        text: `Olá! Sou seu copiloto IA da Abundance. ${getInitialContextualPrompt()}`,
        timestamp: new Date(),
      };
      setMessages([firstMessage]);
    }
  }, [isOpen, messages.length, getInitialContextualPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponseText = await generateContextualContent(inputValue, currentPage);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Desculpe, não consegui processar sua solicitação no momento. Tente novamente mais tarde.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-aiPurple text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        aria-label="Open Abundance AI Assistant"
      >
        <SparklesIcon className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[70vh] max-h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-40 border border-gray-300">
          <header className="bg-aiPurple text-white p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold">Abundance AI Agent</h3>
            <p className="text-xs">Contexto: {currentPageTitle}</p>
          </header>
          
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primaryBlue text-white' : 'bg-lighterGray text-darkGray'}`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70">{msg.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {isLoading && <p className="p-4 text-sm text-mediumGray text-center">AI está pensando...</p>}

          <div className="p-4 border-t border-gray-200">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Pergunte algo..."
              className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-aiPurple focus:border-transparent"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || inputValue.trim() === ''}
              className="mt-2 w-full bg-abundanceGreenDark text-white p-2 rounded-md hover:bg-abundanceGreen transition-colors disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AbundanceAIGem;