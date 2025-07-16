import random
from typing import Dict, Any

class GeminiService:
    def generate_ai_blueprint(self, kpis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Simula a geração do relatório "AI Blueprint" com base nos KPIs.
        """
        area_ha_str = kpis.get('ÁREA OBSERVADA', '0 ha').split(' ')[0].replace('.', '').replace(',', '.')
        area_ha = float(area_ha_str)

        return {
            "sumario_executivo": self._generate_sumario(area_ha),
            "fatos_car": self._generate_fatos_car(),
            "capex_estimado": self._generate_capex(area_ha),
            "receitas_medias": self._generate_receitas(area_ha),
            "roadmap": self._generate_roadmap(),
            "riscos_mitigacoes": self._generate_riscos()
        }

    def _generate_sumario(self, area_ha: float) -> Dict[str, Any]:
        return {
            "potencial_de_geracao_de_creditos": f"{int(area_ha * 25)} tCO2/ano",
            "expectativa_de_receita_anual_bruta": f"R$ {int(area_ha * 25 * 50):,}".replace(',', '.'),
            "investimento_inicial_estimado": f"R$ {int(area_ha * 1500):,}".replace(',', '.'),
            "taxa_interna_de_retorno_tir": f"{random.uniform(18, 25):.1f}%",
            "tempo_de_retorno_do_investimento": f"{random.randint(5, 8)} anos",
            "nivel_de_confianca_da_analise": "Alto (85%)"
        }

    def _generate_fatos_car(self) -> Dict[str, Any]:
        return {
            "status_do_car": {"valor": "Ativo", "observacao": "Regular, sem pendências"},
            "reserva_legal_averbada": {"valor": "Sim", "observacao": "20% da área total"},
            "areas_de_preservacao_permanente_app": {"valor": "Declarado", "observacao": "Cursos d'água e nascentes"}
        }

    def _generate_capex(self, area_ha: float) -> Dict[str, Any]:
        return {
            "preparo_da_area": f"R$ {int(area_ha * 300):,}",
            "mudas_e_insumos": f"R$ {int(area_ha * 600):,}",
            "mao_de_obra_plantio": f"R$ {int(area_ha * 400):,}",
            "manutencao_primeiros_2_anos": f"R$ {int(area_ha * 200):,}",
            "total_estimado": f"R$ {int(area_ha * 1500):,}"
        }

    def _generate_receitas(self, area_ha: float) -> Dict[str, Any]:
        return {
            "credito_de_carbono_voluntario": {"receita_bruta": "R$ 80-120", "receita_liquida": "R$ 60-100"},
            "manejo_sustentavel_madeireiro": {"receita_bruta": "R$ 200-400", "receita_liquida": "R$ 150-300"},
            "sistemas_agroflorestais_safs": {"receita_bruta": "R$ 500-1500", "receita_liquida": "R$ 400-1200"},
            "nosso_projeto_estimativa": {"receita_bruta": f"R$ {int(area_ha * 25 * 50 / area_ha):,}", "receita_liquida": f"R$ {int(area_ha * 25 * 40 / area_ha):,}"}
        }

    def _generate_roadmap(self) -> Dict[str, Any]:
        return {
            "fase_1_planejamento_detalhado": {"objetivo": "Validação de documentos e plano de ação", "prazo": "1-3 meses"},
            "fase_2_licenciamento_e_preparo": {"objetivo": "Obtenção de licenças e preparo do solo", "prazo": "3-6 meses"},
            "fase_3_plantio": {"objetivo": "Execução do plantio das mudas", "prazo": "1-2 meses"},
            "fase_4_manutencao_e_monitoramento_inicial": {"objetivo": "Garantir a sobrevivência das mudas", "prazo": "2 anos"},
            "fase_5_certificacao_do_projeto": {"objetivo": "Certificação por padrões internacionais", "prazo": "A partir do 3º ano"},
            "fase_6_monitoramento_continuo_e_venda_de_creditos": {"objetivo": "Geração de receita", "prazo": "Anual, a partir do 4º ano"}
        }

    def _generate_riscos(self) -> Dict[str, Any]:
        return {
            "risco_de_incendios_florestais": {"grau": "Médio", "mitigacao": "Criação de aceiros e brigada de incêndio local"},
            "risco_de_pragas_e_doencas": {"grau": "Baixo", "mitigacao": "Monitoramento constante e uso de espécies nativas resistentes"},
            "risco_de_mercado_volatilidade_do_preco_do_carbono": {"grau": "Médio", "mitigacao": "Contratos de longo prazo (off-take) e diversificação de receitas"}
        } 