import React from 'react';

export const STEPS = [
    "Informações Básicas", "Localização e CAR", "Características da Floresta",
    "Monitoramento e Certificação", "Impacto Social", "Documentos e Fotos", "Revisão Final"
];

const FormField: React.FC<{ label: string; children: React.ReactNode; description?: string }> = ({ label, children, description }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
        {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
    </div>
);

export const renderStepContent = (step: number, formData: any, handleChange: (section: string, field: string, value: any) => void, handleCheckboxChange: (field: string, value: boolean) => void) => {
    // Acessar os dados com segurança
    const informacoesBasicas = formData.informacoesBasicas || {};
    const localizacaoCAR = formData.localizacaoCAR || {};
    const caracteristicasFloresta = formData.caracteristicasFloresta || {};
    const monitoramentoCertificacao = formData.monitoramentoCertificacao || {};
    const impactoSocial = formData.impactoSocial || {};
    const documentosFotos = formData.documentosFotos || {};

    switch (step) {
        case 0: // Informações Básicas
            return (
                <div className="space-y-4">
                    <FormField label="Nome do Projeto"><input value={informacoesBasicas.nomeProjeto || ''} onChange={(e) => handleChange('informacoesBasicas', 'nomeProjeto', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                    <FormField label="Descrição"><textarea value={informacoesBasicas.descricaoProjeto || ''} onChange={(e) => handleChange('informacoesBasicas', 'descricaoProjeto', e.target.value)} className="w-full p-2 border rounded" rows={3} /></FormField>
                    <FormField label="Tipo de Projeto"><input value={informacoesBasicas.tipoProjeto || ''} onChange={(e) => handleChange('informacoesBasicas', 'tipoProjeto', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                    <FormField label="Objetivo Principal"><input value={informacoesBasicas.objetivoPrincipal || ''} onChange={(e) => handleChange('informacoesBasicas', 'objetivoPrincipal', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                </div>
            );
        case 1: // Localização e CAR
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Estado"><input value={localizacaoCAR.estado || ''} onChange={(e) => handleChange('localizacaoCAR', 'estado', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                    <FormField label="Cidade"><input value={localizacaoCAR.cidade || ''} onChange={(e) => handleChange('localizacaoCAR', 'cidade', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                    <FormField label="Endereço Completo"><input value={localizacaoCAR.enderecoCompleto || ''} onChange={(e) => handleChange('localizacaoCAR', 'enderecoCompleto', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                    <FormField label="Código do CAR"><input value={localizacaoCAR.codigoCAR || ''} onChange={(e) => handleChange('localizacaoCAR', 'codigoCAR', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                    <FormField label="Latitude"><input type="number" value={localizacaoCAR.latitude || ''} onChange={(e) => handleChange('localizacaoCAR', 'latitude', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                    <FormField label="Longitude"><input type="number" value={localizacaoCAR.longitude || ''} onChange={(e) => handleChange('localizacaoCAR', 'longitude', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                    <FormField label="Área Total (ha)"><input type="number" value={localizacaoCAR.areaTotalHa || ''} onChange={(e) => handleChange('localizacaoCAR', 'areaTotalHa', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                </div>
            );
        case 2: // Características da Floresta
            return(
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Bioma"><input value={caracteristicasFloresta.bioma || ''} onChange={(e) => handleChange('caracteristicasFloresta', 'bioma', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                    <FormField label="Data do Plantio"><input type="date" value={caracteristicasFloresta.dataPlantio || ''} onChange={(e) => handleChange('caracteristicasFloresta', 'dataPlantio', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                    <FormField label="Número de Árvores"><input type="number" value={caracteristicasFloresta.numeroArvores || ''} onChange={(e) => handleChange('caracteristicasFloresta', 'numeroArvores', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                    <FormField label="Densidade (Árvores/ha)"><input type="number" value={caracteristicasFloresta.densidadeArvoresHa || ''} onChange={(e) => handleChange('caracteristicasFloresta', 'densidadeArvoresHa', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                </div>
            );
        case 3: // Monitoramento e Certificação
             return (
                <div className="space-y-4">
                    <FormField label="Metodologia de Carbono"><input value={monitoramentoCertificacao.metodologiaCarbono || ''} onChange={(e) => handleChange('monitoramentoCertificacao', 'metodologiaCarbono', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                    <FormField label="Responsável Técnico"><input value={monitoramentoCertificacao.responsavelTecnico || ''} onChange={(e) => handleChange('monitoramentoCertificacao', 'responsavelTecnico', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                    <FormField label="Cronograma de Monitoramento"><input value={monitoramentoCertificacao.cronogramaMonitoramento || ''} onChange={(e) => handleChange('monitoramentoCertificacao', 'cronogramaMonitoramento', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                    <FormField label="Frequência de Monitoramento"><input value={monitoramentoCertificacao.frequenciaMonitoramento || ''} onChange={(e) => handleChange('monitoramentoCertificacao', 'frequenciaMonitoramento', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                </div>
            );
        case 4: // Impacto Social
            return (
                <div className="space-y-4">
                    <FormField label="Comunidade Local Envolvida"><textarea value={impactoSocial.comunidadeLocalEnvolvida || ''} onChange={(e) => handleChange('impactoSocial', 'comunidadeLocalEnvolvida', e.target.value)} className="w-full p-2 border rounded" rows={3} /></FormField>
                    <FormField label="Estimativa de Empregos Gerados"><input type="number" value={impactoSocial.empregosGeradosEstimativa || ''} onChange={(e) => handleChange('impactoSocial', 'empregosGeradosEstimativa', e.target.value)} className="w-full p-2 border rounded" /></FormField>
                </div>
            );
        case 5: // Documentos e Fotos
            return (
                <div className="space-y-4">
                    <FormField label="Documentos do Projeto" description="Faça upload dos documentos relevantes (PDF, DOCX)."><input type="file" multiple className="w-full text-sm"/></FormField>
                    <FormField label="Fotos da Área" description="Faça upload de fotos da área do projeto (JPG, PNG)."><input type="file" multiple className="w-full text-sm"/></FormField>
                </div>
            );
        case 6: // Revisão Final
            return (
                <div>
                    <h3 className="text-lg font-semibold">Revise os dados do seu projeto</h3>
                    <pre className="mt-4 p-4 bg-gray-100 rounded-md text-xs overflow-auto max-h-96">{JSON.stringify(formData, null, 2)}</pre>
                    <div className="mt-4 flex items-center">
                        <input type="checkbox" id="aceitaTermos" checked={formData.aceitaTermos || false} onChange={(e) => handleCheckboxChange('aceitaTermos', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                        <label htmlFor="aceitaTermos" className="ml-2 block text-sm text-gray-900">Li e aceito os termos de serviço.</label>
                    </div>
                </div>
            );
        default: return null; // Retorna null para evitar "Passo não encontrado"
    }
}; 