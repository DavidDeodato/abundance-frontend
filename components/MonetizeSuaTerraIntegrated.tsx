import React from 'react';
import { useAbundanceNavigation } from '../contexts/AbundanceFlowContext';

const MonetizeSuaTerraIntegrated: React.FC = () => {
    const navigation = useAbundanceNavigation();

    return (
        <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-green-600 mb-4">Projeto Submetido com Sucesso!</h1>
            <p className="mb-6">Seu projeto foi enviado para nossa equipe e em breve estará visível no marketplace.</p>
            <button
                onClick={() => navigation.navigateTo('marketplace')}
                className="bg-abundanceGreenDark text-white px-8 py-3 rounded-md hover:bg-abundanceGreen transition-colors font-semibold text-lg"
            >
                Ir para o Marketplace
            </button>
        </div>
    );
};

export default MonetizeSuaTerraIntegrated; 