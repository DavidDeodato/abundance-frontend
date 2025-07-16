
import React, { useState, useEffect } from 'react';
import { florestaApi } from '../services/apiService';

const MarketplacePage: React.FC = () => {
    const [projetos, setProjetos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjetos = async () => {
            try {
                const data = await florestaApi.getMarketplaceProjetos();
                setProjetos(data);
            } catch (error) {
                console.error("Erro ao buscar projetos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjetos();
    }, []);

    if (loading) {
        return <div className="p-6">Carregando projetos do marketplace...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Marketplace de Ativos Florestais</h1>
            {projetos.length === 0 ? (
                <p>Nenhum projeto disponível no marketplace no momento.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projetos.map((projeto) => (
                        <div key={projeto.id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold mb-2">{projeto.nome_projeto || 'Projeto Sem Nome'}</h2>
                            <p className="text-gray-700 mb-4">{projeto.descricao_projeto || 'Sem descrição.'}</p>
                            <div className="text-sm">
                                <span className="font-semibold">Área:</span> {projeto.area_total_ha || 'N/A'} ha
                            </div>
                            {/* Outros detalhes podem ser adicionados aqui */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MarketplacePage;
