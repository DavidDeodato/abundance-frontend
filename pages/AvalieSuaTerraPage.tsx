
import React from 'react';

const ReportHeader: React.FC<{ date: string; title: string; subtitle: string; clientInfo: string }> = ({ date, title, subtitle, clientInfo }) => (
  <div className="bg-primaryBlue text-white p-8 rounded-t-lg relative">
    <div className="absolute top-4 right-4 bg-white text-primaryBlue w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-md">
      AB
    </div>
    <p className="text-sm opacity-80">{date}</p>
    <h1 className="text-3xl font-bold mt-2">{title}</h1>
    <h2 className="text-lg opacity-90">{subtitle}</h2>
    <p className="text-xs mt-3 bg-black bg-opacity-20 px-2 py-1 rounded inline-block">{clientInfo}</p>
  </div>
);

interface SectionTitleProps {
  number: string;
  title: string;
}
const SectionTitle: React.FC<SectionTitleProps> = ({ number, title }) => (
  <div className="flex items-center space-x-3 mb-4 mt-8">
    <div className="bg-abundanceGreenDark text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
      {number}
    </div>
    <h3 className="text-xl font-semibold text-darkGray">{title.toUpperCase()}</h3>
  </div>
);

interface TableRow {
  [key: string]: string | number | JSX.Element;
}
interface SimpleTableProps {
  data: TableRow[];
  columns: { key: string; label: string; className?: string }[];
  highlightLast?: boolean;
}

const SimpleTable: React.FC<SimpleTableProps> = ({ data, columns, highlightLast = false }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className={highlightLast && rowIndex === data.length -1 ? "bg-green-50" : (rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
            {columns.map((col, colIndex) => (
              <td key={col.key} className={`px-4 py-3 text-sm ${colIndex === 0 ? 'font-medium text-darkGray' : 'text-mediumGray'} ${col.className || ''}`}>
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


const AvalieSuaTerraPage: React.FC = () => {
  const sumarioExecutivoData = [
    { item: 'Área total (CAR)', valor: '459,72 ha' },
    { item: 'Área elegível (validação satelital 05/2025)', valor: '306 ha • 66,5%' },
    { item: 'CRUs potenciais (258 t CO₂ / ha)', valor: '78 948 t CO₂' },
    { item: 'Receita potencial (USD 55 / t)', valor: '≈ R$ 25,2 mi' },
    { item: 'Payback projetado*', valor: '≈ 9-12 anos' },
    { item: 'Situação CAR', valor: 'Ativo – sem passivos relevantes' },
  ];

  const fatosCarData = [
    { item: 'Vegetação nativa', valor: '456,57 ha', observacao: '99,3% preservada' },
    { item: 'APP declarada', valor: '62,35 ha', observacao: '100% preservada' },
    { item: 'Reserva Legal', valor: '123,27 ha', observacao: <span className="text-red-600">Excedente + 31,42 ha</span> },
    { item: 'Área rural consolidada', valor: '3,14 ha', observacao: 'Passivo insignificante' },
    { item: 'Sobreposições protegidas', valor: 'Nenhuma', observacao: 'Sem UC/TI' },
    { item: 'Status cadastro', valor: <span className="text-orange-600">Aguardando análise (retificação 08/05/2025)</span>, observacao: '' },
  ];
  
  const capexEstimadoData = [
    { item: "Compra da terra", faixaCusto: "R$ [Preencher] / ha", total: "R$ [–]" },
    { item: "Plantio ARR*", faixaCusto: "R$ 20 000 - 40 000 / ha", total: "R$ 6,1 M - 12,2 M" },
    { item: "Estruturação (PDD ERS + auditorias)", faixaCusto: "–", total: "R$ 0,45 M" },
    { item: "CAPEX total", faixaCusto: "–", total: <strong className="text-darkGray">R$ [calcular]</strong> },
  ];

  const receitasMediasData = [
    { atividade: "Pecuária extensiva", receitaBruta: "R$ 4 500", receitaLiquida: "R$ 1100 - 1500", fontes: ""},
    { atividade: "Soja (arr.)", receitaBruta: "R$ 6 500", receitaLiquida: "R$ 1300 - 1600", fontes: ""},
    { atividade: "Eucalipto (ciclo 7 a)**", receitaBruta: "R$ 7 000 - 10 000 (bruta ciclo)", receitaLiquida: "R$ 2 000 - 3 500 (equiv./ano)", fontes: ""},
    { atividade: <strong className="text-abundanceGreenDark">Carbono ARR</strong>, receitaBruta: <strong className="text-abundanceGreenDark">R$ 3 500 - 5 500</strong>, receitaLiquida: <strong className="text-abundanceGreenDark">R$ 2 500 - 4 000</strong>, fontes: ""},
    { atividade: <strong className="text-abundanceGreenDark">Carbono + SAF (20 ha)</strong>, receitaBruta: <strong className="text-abundanceGreenDark">R$ 4 500 +</strong>, receitaLiquida: <strong className="text-abundanceGreenDark">R$ 3 000 +</strong>, fontes: ""},
  ];
  
  const roadmapData = [
    { fase: "1. Relatório de Elegibilidade (este)", objetivo: "Confirmar potencial", prazoTipico: "Hoje", fonteRecursos: "Capital próprio (R$ 5 k)"},
    { fase: "2. Decisão de Compra", objetivo: "Due diligence & assinatura", prazoTipico: "0 - 2 m", fonteRecursos: "Próprio / parceiro"},
    { fase: "3. Business Plan & Data Room", objetivo: "Estruturar captação", prazoTipico: "1 - 3 m", fonteRecursos: "Serviço Abundance"},
    { fase: "4. Plantio ARR 306 ha", objetivo: "Início do projeto", prazoTipico: "6 - 18 m", fonteRecursos: "Equity + pré-venda CRUs"},
    { fase: "5. Pré-certificação Abundance (em desenv.)", objetivo: "Dossiê técnico", prazoTipico: "18 - 24 m", fonteRecursos: "Capital captado"},
    { fase: "6. Certificação ARR (ERS / VERRA / GS)", objetivo: "Emitir CRUs", prazoTipico: "24 - 36 m", fonteRecursos: "Caixa do projeto"},
    { fase: "7. Venda de Créditos", objetivo: "Receita operacional", prazoTipico: "30 - 40 m", fonteRecursos: "Spot / contratos"},
  ];

  const riscosMitigacoesData = [
    { risco: "Volatilidade do preço de carbono", grau: "Médio", mitigacao: "Offtake ≥ USD 40 / t (30%)" },
    { risco: "Falha de restauração", grau: <span className="text-green-600">Baixo</span>, mitigacao: "Buffer 20 % + espécies nativas" },
    { risco: "Pendência cartorial", grau: <span className="text-green-600">Baixo</span>, mitigacao: "Geo SIGEF antes da compra" },
    { risco: "Mudança regulatória", grau: "Médio", mitigacao: "Conformidade SBCE + ERS" },
  ];


  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg mb-10">
      <ReportHeader 
        date="Maio / 2025"
        title="Diagnóstico Técnico & Potencial de Monetização Ambiental"
        subtitle="Fazenda Leonardo – São Gonçalo do Abaeté I MG"
        clientInfo="Documento confidencial - uso exclusivo do cliente"
      />
      
      <div className="p-6 md:p-8">
        <SectionTitle number="1" title="Sumário Executivo" />
        <SimpleTable 
            data={sumarioExecutivoData} 
            columns={[{key: 'item', label: 'Item'}, {key: 'valor', label: 'Valor', className: 'text-right font-semibold'}]}
        />
        <p className="text-xs text-mediumGray mt-2">* Com base em receita líquida de carbono de R$ 2500 – 4000 / ha / ano.</p>
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-abundanceGreenDark text-mediumGray text-sm rounded-r-md">
          <strong>Resumo:</strong> A terra apresenta potencial para receitas superiores às culturas convencionais se o projeto ARR for bem executado e o mercado de carbono mantiver valores próximos aos atuais.
        </div>

        <SectionTitle number="2" title="Fatos do CAR / SICAR" />
        <SimpleTable 
            data={fatosCarData} 
            columns={[
                {key: 'item', label: 'Item'}, 
                {key: 'valor', label: 'Valor', className: 'font-semibold'}, 
                {key: 'observacao', label: 'Observação'}
            ]}
        />
        
        <SectionTitle number="3" title="Metodologia" />
        <ol className="list-decimal list-inside text-mediumGray space-y-1 text-sm pl-2">
            <li>CAR, matrícula, SICAR on-line.</li>
            <li>Google Earth 07/2013 × 11/2023 (prints).</li>
            <li>Validação satelital de terceiros (306 ha suitable).</li>
            <li>Fator de sequestro 258 t CO₂ / ha.</li>
            <li>Benchmarks CNA, Embrapa, CEPEA para atividades convencionais.</li>
            <li>Pipeline MRV Abundance (IA + revisão humana).</li>
        </ol>

        <SectionTitle number="4" title="Resultado de Elegibilidade" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
                <h4 className="font-semibold text-darkGray mb-2">Análise de Elegibilidade</h4>
                <div className="flex flex-col items-center p-4 border rounded-md">
                    <div className="relative w-32 h-32 mb-3">
                        <svg viewBox="0 0 36 36" className="circular-chart">
                            <path className="circle-bg" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e6e6e6" strokeWidth="3.8"></path>
                            <path className="circle" strokeDasharray="66.5, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2E7D32" strokeWidth="3.8" strokeLinecap="round"></path>
                            <text x="18" y="20.35" className="percentage" textAnchor="middle" dy=".3em" fontSize="0.5em" fill="#2E7D32" fontWeight="bold">66,5%</text>
                        </svg>
                    </div>
                     <p className="text-xs text-mediumGray -mt-2 mb-3">Suitable</p>
                </div>
                <SimpleTable 
                    data={[
                        {classe: 'Suitable ARR', ha: 306, '%': 66.5},
                        {classe: 'Unsuitable', ha: 154, '%': 33.5},
                        {classe: 'Burn area', ha: 0, '%': 0},
                    ]}
                    columns={[
                        {key: 'classe', label: 'Classe'}, 
                        {key: 'ha', label: 'ha', className: 'text-right'}, 
                        {key: '%', label: '%', className: 'text-right' }
                    ]}
                />
            </div>
            <div>
                <h4 className="font-semibold text-darkGray mb-2">Análise Satelital</h4>
                <img src="https://via.placeholder.com/400x250.png?text=Land+Suitability+Map" alt="Análise Satelital Principal" className="w-full rounded-md shadow mb-2"/>
                <div className="grid grid-cols-2 gap-2">
                    <img src="https://via.placeholder.com/195x120.png?text=07/2013" alt="Satélite 07/2013" className="w-full rounded-md shadow"/>
                    <img src="https://via.placeholder.com/195x120.png?text=11/2023" alt="Satélite 11/2023" className="w-full rounded-md shadow"/>
                </div>
            </div>
        </div>
        
        <SectionTitle number="5" title="Custos & Retornos (horizonte de 10 anos)" />
        <h4 className="font-semibold text-mediumGray mt-2 mb-2 text-md">5.1 CAPEX ESTIMADO <span className="text-xs text-lightGray">(Total 306 ha)</span></h4>
         <SimpleTable 
            data={capexEstimadoData}
            columns={[
                {key: 'item', label: 'Item'},
                {key: 'faixaCusto', label: 'Faixa de custo', className: 'text-center'},
                {key: 'total', label: 'Total (306 ha)', className: 'text-right'}
            ]}
        />
        <p className="text-xs text-mediumGray mt-1">* Inclui mudas, preparo, insumos e manutenção inicial.</p>

        <h4 className="font-semibold text-mediumGray mt-6 mb-2 text-md">5.2 RECEITAS MÉDIAS (R$/ha/ano)</h4>
         <SimpleTable 
            data={receitasMediasData}
            columns={[
                {key: 'atividade', label: 'Atividade'},
                {key: 'receitaBruta', label: 'Receita BRUTA', className: 'text-center'},
                {key: 'receitaLiquida', label: 'Receita LÍQUIDA', className: 'text-center'},
                {key: 'fontes', label: 'Fontes', className: 'text-right'}
            ]}
            highlightLast={true}
        />
        <p className="text-xs text-mediumGray mt-1">** Receita anual equivalente ao corte de 7 anos.</p>

        <h4 className="font-semibold text-mediumGray mt-6 mb-2 text-md">5.3 PAYBACK</h4>
        <p className="text-sm text-mediumGray">Com receita líquida de carbono de R$ 2 500 – 4 000 / ha / ano, o fluxo de caixa acumulado atinge o ponto de equilíbrio <strong>entre anos 9 e 12</strong>, dependendo do CAPEX final e da eficácia de pré-venda de créditos.</p>

        <SectionTitle number="6" title="Roadmap I Etapas & Prazos" />
        <SimpleTable 
            data={roadmapData}
            columns={[
                {key: 'fase', label: 'Fase', className: 'w-2/5'},
                {key: 'objetivo', label: 'Objetivo'},
                {key: 'prazoTipico', label: 'Prazo típico', className: 'text-center'},
                {key: 'fonteRecursos', label: 'Fonte de recursos'}
            ]}
        />
        <p className="text-xs text-mediumGray mt-2">Abundance pode apoiar nas fases 3-6, reduzindo necessidade de capital próprio via pré-venda.</p>
        
        <SectionTitle number="7" title="Riscos & Mitigações" />
        <SimpleTable 
            data={riscosMitigacoesData}
            columns={[
                {key: 'risco', label: 'Risco', className: 'w-2/5'},
                {key: 'grau', label: 'Grau', className: 'text-center'},
                {key: 'mitigacao', label: 'Mitigação'}
            ]}
        />

        <div className="mt-8 p-4 bg-gray-50 rounded-md border">
            <h3 className="text-lg font-semibold text-darkGray mb-3">CONSIDERAÇÕES FINAIS</h3>
            <p className="text-sm text-mediumGray mb-3">Este diagnóstico indica que, <strong>se todas as etapas forem executadas de forma rigorosa e o mercado de carbono se mantiver dentro das faixas históricas</strong>, o projeto ARR pode gerar receitas líquidas <strong>comparáveis ou superiores</strong> às atividades convencionais analisadas.</p>
            <p className="text-sm text-mediumGray mb-2"><strong>A decisão de compra deve considerar:</strong></p>
            <ul className="list-disc list-inside text-sm text-mediumGray space-y-1 pl-4 mb-3">
                <li>Capacidade de financiar o CAPEX inicial ou captar via pré-venda/financiadores;</li>
                <li>Tolerância a um período de retorno mais longo (≈ 10 anos);</li>
                <li>Riscos de mercado (preço do carbono) e execução (plantio/MRV).</li>
            </ul>
            <p className="text-sm text-mediumGray">Abundance pode apoiar no <strong>Business Plan</strong>, estruturação PDD ERS e captação, reduzindo riscos de execução.</p>
        </div>
        
        <div className="mt-8 text-xs text-mediumGray space-y-2">
            <h3 className="text-sm font-semibold text-darkGray mb-1">DISCLAIMERS</h3>
            <p>Este documento é informativo; não constitui oferta ou recomendação de investimento.</p>
            <p>Projeções baseiam-se em premissas de mercado sujeitas a variações, incluindo preço de carbono, câmbio, custos de plantio, certificação e manutenção.</p>
            <p>A emissão de créditos depende de aprovação de auditorias externas (ERS, VERRA, Gold Standard) e de condições climáticas que podem afetar o crescimento florestal.</p>
            <p>Os custos de plantio apresentados (R$ 20 000 – 40 000 / ha) são estimativas; valores reais podem divergir.</p>
            <p>Resultados financeiros podem ser inferiores ou superiores ao previsto; Abundance Brasil não garante retorno nem se responsabiliza por decisões de compra baseadas neste relatório.</p>
            <p>Recomenda-se due diligence jurídica, fiscal e ambiental independente antes de qualquer aquisição.</p>
            <p>Documento confidencial; reprodução ou distribuição proibida sem autorização.</p>
        </div>

        <div className="mt-8">
            <h3 className="text-sm font-semibold text-darkGray mb-1">APPENDIX B – Referências</h3>
            <ul className="list-disc list-inside text-xs text-mediumGray space-y-0.5 pl-4">
                <li>CAR / SICAR MG-3161700-...</li>
                <li>Relatório de elegibilidade (plataforma satelital de terceiros, 05/2025)</li>
                <li>Relatório Manus.AI "relatorio_fazenda_leonardo_formatado.pdf"</li>
                <li>Benchmarks CNA, Embrapa, CEPEA 2024-25</li>
            </ul>
        </div>
      </div>
      <footer className="text-center text-xs text-mediumGray py-6 border-t mt-8">
        © {new Date().getFullYear()} Abundance Brasil • Confidencial
      </footer>
    </div>
  );
};

export default AvalieSuaTerraPage;
