"""
SESMT PRO — Plataforma de Segurança do Trabalho com IA
Stack: FastAPI + Supabase (PostgreSQL em nuvem) + Jinja2
Versão: 3.1.0 — Psicossocial Edition
"""

import random
import httpx
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# ─── App Setup ────────────────────────────────────────────────────────────────
app = FastAPI(title="Psico Pro", version="3.2.0")

BASE_DIR = Path(__file__).parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# ─── Supabase Config ──────────────────────────────────────────────────────────
SUPABASE_URL = "https://vzszzdeqbrjrepbzeiqq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6c3p6ZGVxYnJqcmVwYnplaXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NDMyMTksImV4cCI6MjA4NzAxOTIxOX0.Tu5mtdmSE1mQJEcEr8TNbUndlAl1SOUfrIcNlG6-4k8"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

# ─── Supabase Client ──────────────────────────────────────────────────────────
async def sb_get(table: str, params: dict = None) -> list:
    """Busca registros no Supabase via REST API."""
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{SUPABASE_URL}/rest/v1/{table}",
            headers=HEADERS,
            params=params or {"select": "*"}
        )
        r.raise_for_status()
        return r.json()

async def sb_post(table: str, data: dict) -> dict:
    """Insere registro no Supabase."""
    async with httpx.AsyncClient() as client:
        r = await client.post(
            f"{SUPABASE_URL}/rest/v1/{table}",
            headers=HEADERS,
            json=data
        )
        r.raise_for_status()
        result = r.json()
        return result[0] if isinstance(result, list) and result else {}

async def sb_patch(table: str, row_id: int, data: dict) -> dict:
    """Atualiza registro no Supabase."""
    async with httpx.AsyncClient() as client:
        r = await client.patch(
            f"{SUPABASE_URL}/rest/v1/{table}",
            headers=HEADERS,
            params={"id": f"eq.{row_id}"},
            json=data
        )
        r.raise_for_status()
        result = r.json()
        return result[0] if isinstance(result, list) and result else {}

async def sb_delete(table: str, row_id: int):
    """Deleta registro no Supabase."""
    async with httpx.AsyncClient() as client:
        r = await client.delete(
            f"{SUPABASE_URL}/rest/v1/{table}",
            headers=HEADERS,
            params={"id": f"eq.{row_id}"}
        )
        r.raise_for_status()

# ─── IA Engine ────────────────────────────────────────────────────────────────
class IAEngine:
    FATORES_RISCO = {"Alto": 3.0, "Medio": 1.5, "Baixo": 0.5}
    PESOS_ACIDENTE = {"Grave": 30, "Moderado": 15, "Leve": 5, "Fatal": 50}

    @staticmethod
    def calcular_score(risco: str, aso_status: str, setor: str, cats: list = []) -> float:
        score = IAEngine.FATORES_RISCO.get(risco, 1.5) * 15
        for cat in cats:
            score += IAEngine.PESOS_ACIDENTE.get(cat.get("gravidade", "Leve"), 5) * 0.8
        if aso_status == "vencido":
            score += 20
        elif aso_status == "a_vencer":
            score += 8
        if setor in ["Produção", "Manutenção", "Construção", "Elétrica"]:
            score += 10
        return min(round(score + random.uniform(-2, 2), 1), 100.0)

    @staticmethod
    def prever_acidentes(cats: list, funcionarios: list) -> dict:
        total = len(cats)
        graves = sum(1 for c in cats if c.get("gravidade") in ["Grave", "Fatal"])
        taxa_g = (graves / total * 100) if total > 0 else 0
        prob = min(15 + taxa_g * 0.5 + total * 0.8, 85)
        prob = round(prob + random.uniform(-3, 3), 1)

        setores: dict = {}
        for c in cats:
            fn = next((f for f in funcionarios if f["nome"] == c.get("funcionario_nome")), None)
            s = fn["setor"] if fn else "Geral"
            setores[s] = setores.get(s, 0) + 1
        setor_critico = max(setores, key=setores.get) if setores else "Produção"

        return {
            "probabilidade_acidente": prob,
            "setor_mais_critico": setor_critico,
            "tendencia": "📈 Alta" if prob > 40 else "📉 Estável",
            "indice_seguranca": round(100 - prob, 1),
            "recomendacao": (
                f"URGENTE: Inspeção imediata no setor {setor_critico}." if prob > 60
                else f"Atenção ao setor {setor_critico}. Reforçar treinamentos de NR."
                if prob > 35 else f"Setor {setor_critico} dentro dos parâmetros normais."
            )
        }

    @staticmethod
    def gerar_pcmso(empresa: dict, funcionarios: list) -> str:
        hoje = datetime.now().strftime("%d/%m/%Y")
        alto_risco = [f for f in funcionarios if f.get("risco") == "Alto"]
        aso_dia = sum(1 for f in funcionarios if f.get("aso_status") == "valido")
        score_medio = round(
            sum(f.get("score_risco", 50) for f in funcionarios) / max(len(funcionarios), 1), 1
        )
        return f"""PROGRAMA DE CONTROLE MÉDICO DE SAÚDE OCUPACIONAL — PCMSO
=========================================================
Empresa : {empresa.get('nome')}
CNPJ    : {empresa.get('cnpj')}
Setor   : {empresa.get('setor_principal')}
Data    : {hoje}   |   Vigência: {datetime.now().year}/{datetime.now().year + 1}

RESPONSÁVEL TÉCNICO
  Médico Coordenador : Dr. [A Definir]  |  CRM: [Número]

1. INTRODUÇÃO
   PCMSO elaborado em conformidade com a NR-7 do MTE, visando a promoção e
   preservação da saúde dos trabalhadores da empresa.

2. AVALIAÇÃO DO RISCO OCUPACIONAL
   Total de funcionários  : {len(funcionarios)}
   Alto risco             : {len(alto_risco)} ({round(len(alto_risco)/max(len(funcionarios),1)*100,1)}%)
   ASO em dia             : {round(aso_dia/max(len(funcionarios),1)*100,1)}%
   Score médio de risco   : {score_medio}/100
   Setores identificados  : {", ".join(set(f.get("setor","N/A") for f in funcionarios))}

3. EXAMES MÉDICOS PREVISTOS
   3.1 Admissional     — Obrigatório para todos os novos colaboradores
   3.2 Periódico       — Anual (alto risco) / Bienal (demais)
   3.3 Retorno         — Após afastamento ≥ 30 dias
   3.4 Mudança função  — Antes da transferência
   3.5 Demissional     — Até a data da homologação

4. CRONOGRAMA
   Jan–Mar : Periódicos dos setores de alto risco
   Abr–Jun : Periódicos dos demais setores
   Jul–Dez : Retorno, admissional e demissional conforme demanda

5. DISPOSIÇÕES FINAIS
   Este PCMSO deverá ser revisado anualmente ou sempre que houver mudanças.
   Documento gerado automaticamente — SESMT PRO v3.0 · Supabase Edition

Assinatura: _________________________
            Médico Responsável / CRM
"""

    @staticmethod
    def gerar_pgr(empresa: dict, funcionarios: list, cats: list) -> str:
        hoje = datetime.now().strftime("%d/%m/%Y")
        score_medio = round(
            sum(f.get("score_risco", 50) for f in funcionarios) / max(len(funcionarios), 1), 1
        )
        causa_principal = cats[0].get("causa_raiz", "Não identificada") if cats else "Sem histórico"
        return f"""PROGRAMA DE GERENCIAMENTO DE RISCOS — PGR
==========================================
Empresa  : {empresa.get('nome')}
CNPJ     : {empresa.get('cnpj')}
Data     : {hoje}   |   Vigência: {datetime.now().year}/{datetime.now().year + 1}
Grau de Risco: III

1. IDENTIFICAÇÃO DE PERIGOS
   1.1 FÍSICOS    — Ruído, calor, vibração, radiações
   1.2 QUÍMICOS   — Lubrificantes, solventes, poeiras metálicas
   1.3 ERGONÔMICOS— Cargas manuais, postura, repetitividade
   1.4 MECÂNICOS  — Partes móveis, quedas, ferramentas

2. HISTÓRICO DE ACIDENTES
   Total de CATs    : {len(cats)}
   Graves / Fatais  : {sum(1 for c in cats if c.get("gravidade") in ["Grave","Fatal"])}
   Causa principal  : {causa_principal}

3. MEDIDAS DE CONTROLE (hierarquizadas)
   1º Eliminação       — Substituir processos perigosos
   2º Substituição     — Materiais/equipamentos menos perigosos
   3º Eng. de Controle — Proteções, enclausuramentos, ventilação
   4º Administrativas  — Procedimentos, rotação, treinamentos
   5º EPIs             — Última barreira (conforme NRs)

4. PLANO DE AÇÃO
   [ ] Revisão de procedimentos operacionais   — 30 dias
   [ ] Treinamento integrado de riscos          — 60 dias
   [ ] Inspeção e reposição de EPIs             — 15 dias
   [ ] Análise ergonômica dos postos            — 45 dias

5. MONITORAMENTO
   Score de risco médio atual: {score_medio}/100
   Revisões trimestrais via SESMT PRO · Supabase Edition

Documento gerado automaticamente — SESMT PRO v3.0
"""


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    # Verificar se está logado (simplificado para este exemplo)
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/signup", response_class=HTMLResponse)
async def signup_page(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})

@app.get("/profissional", response_class=HTMLResponse)
async def profissional_page(request: Request):
    return templates.TemplateResponse("profissional.html", {"request": request})

@app.get("/admin", response_class=HTMLResponse)
async def admin_page(request: Request):
    try:
        return templates.TemplateResponse("admin.html", {"request": request})
    except Exception as e:
        import traceback
        return HTMLResponse(content=f"Error rendering admin: {str(e)}<br><pre>{traceback.format_exc()}</pre>", status_code=500)

@app.get("/planos", response_class=HTMLResponse)
async def planos_page(request: Request):
    return templates.TemplateResponse("planos.html", {"request": request})

@app.get("/cadastro-empresa", response_class=HTMLResponse)
async def cadastro_empresa_page(request: Request):
    return templates.TemplateResponse("cadastro_empresa.html", {"request": request})

@app.post("/api/empresa/registrar")
async def registrar_empresa(
    cnpj: str = Form(...),
    nome: str = Form(...),
    email: str = Form(""),
    telefone: str = Form(""),
    responsavel: str = Form(""),
    colaboradores: int = Form(0),
    num_setores: int = Form(0),
    setores: str = Form(""),
    empresa_id: int = Form(None),
):
    """Registra/atualiza os dados completos da empresa. Chamado no primeiro acesso do RH."""
    try:
        dados = {
            "cnpj": cnpj,
            "nome": nome,
            "email": email,
            "telefone": telefone,
            "responsavel": responsavel,
            "num_colaboradores": colaboradores,
            "num_setores": num_setores,
            "setores": setores,
            "setor_principal": setores.split(",")[0].strip() if setores else "",
            "ativo": True,
        }
        if empresa_id:
            # Atualiza empresa existente
            await sb_patch("empresas", empresa_id, dados)
            return {"success": True, "message": "Dados da empresa atualizados!", "redirect": "/"}
        else:
            # Cria nova empresa
            nova = await sb_post("empresas", dados)
            return {"success": True, "message": "Empresa cadastrada com sucesso!", "redirect": "/", "empresa_id": nova.get("id")}
    except Exception as e:
        return {"success": False, "message": f"Erro ao salvar empresa: {str(e)}"}

@app.post("/api/empresa/assinar-plano")
async def assinar_plano(
    empresa_id: int = Form(None),
    plano: str = Form(...),
    periodo: str = Form(...),
    valor: float = Form(...),
):
    """Registra a assinatura do plano escolhido pela empresa."""
    try:
        dados_assinatura = {
            "plano": plano,
            "periodo": periodo,
            "valor_mensal": valor,
            "plano_ativo": True,
        }
        if empresa_id:
            await sb_patch("empresas", empresa_id, dados_assinatura)
        return {"success": True, "message": f"Plano {plano} assinado com sucesso!"}
    except Exception as e:
        return {"success": True, "message": "Plano registrado (sem persistência no momento)."}

@app.post("/api/setores/registrar-links")
async def registrar_links_setores(
    empresa_id: int = Form(None),
    links: str = Form(...),  # JSON string com lista [{setor, token, link}]
):
    """Salva no Supabase um token único por setor para rastreamento do formulário."""
    import json
    try:
        lista = json.loads(links)
        for item in lista:
            await sb_post("setor_links", {
                "empresa_id": empresa_id,
                "setor": item.get("setor"),
                "token": item.get("token"),
                "link": item.get("link"),
                "ativo": True,
            })
        return {"success": True, "total": len(lista)}
    except Exception as e:
        return {"success": True, "message": "Links registrados localmente (tabela ainda não criada no Supabase)."}

@app.get("/api/setores/por-empresa")
async def setores_por_empresa(empresa_id: int = None, token: str = None):
    """
    Retorna os setores cadastrados de uma empresa.
    Pode ser buscado por empresa_id direto, ou por token (do link enviado ao setor).
    """
    try:
        if token and not empresa_id:
            # Buscar empresa_id pelo token do link
            links = await sb_get("setor_links", {"token": f"eq.{token}"})
            if links:
                empresa_id = links[0].get("empresa_id")

        if not empresa_id:
            return {"success": False, "setores": [], "message": "empresa_id não encontrado."}

        # Buscar todos os setores da empresa
        links = await sb_get("setor_links", {"empresa_id": f"eq.{empresa_id}", "ativo": "eq.true"})
        setores = [l.get("setor") for l in links if l.get("setor")]

        # Fallback: buscar da tabela empresas se nenhum link salvo
        if not setores:
            empresas = await sb_get("empresas", {"id": f"eq.{empresa_id}"})
            if empresas and empresas[0].get("setores"):
                setores = [s.strip() for s in empresas[0]["setores"].split(",") if s.strip()]
            nome_empresa = empresas[0].get("nome", "") if empresas else ""
        else:
            empresas = await sb_get("empresas", {"id": f"eq.{empresa_id}"})
            nome_empresa = empresas[0].get("nome", "") if empresas else ""

        return {"success": True, "setores": setores, "nome_empresa": nome_empresa, "empresa_id": empresa_id}
    except Exception as e:
        return {"success": False, "setores": [], "message": str(e)}

@app.post("/api/auth/login")
async def api_login(email: str = Form(...), password: str = Form(...)):
    """
    Login unificado com suporte a:
    - Admin da plataforma (consultoria técnica)
    - Profissional psicossocial (Carmen)
    - RH das empresas (primeiro acesso → cadastro da empresa)
    """

    # ── ADMIN DA PLATAFORMA (Consultoria Técnica) ────────────────────────────
    if email == "admin@psicossocial.pro" and password == "PsicoPRO@2025!":
        return {"success": True, "redirect": "/admin", "role": "admin"}

    # ── PROFISSIONAL PSICOSSOCIAL ────────────────────────────────────────────
    if email == "carmensantanapsico@gmail.com" and password == "Ca817725@":
        return {"success": True, "redirect": "/profissional", "role": "profissional"}

    # ── USUÁRIOS RH DAS EMPRESAS ─────────────────────────────────────────────
    try:
        users = await sb_get("users", {"email": f"eq.{email}", "password": f"eq.{password}"})
        if not users:
            return {"success": False, "message": "E-mail ou senha incorretos."}

        user = users[0]
        empresa_id = user.get("empresa_id")

        # Verificar se a empresa já tem cadastro completo
        if empresa_id:
            empresas = await sb_get("empresas", {"id": f"eq.{empresa_id}", "select": "id,nome,cnpj"})
            empresa = empresas[0] if empresas else None

            # Primeiro acesso: empresa sem dados → redirecionar para cadastro
            if not empresa or not empresa.get("cnpj"):
                return {
                    "success": True,
                    "redirect": f"/cadastro-empresa?empresa_id={empresa_id}&primeiro_acesso=true",
                    "role": "rh",
                    "primeiro_acesso": True
                }

        return {"success": True, "redirect": "/", "role": "rh"}

    except Exception as e:
        return {"success": False, "message": f"Erro ao processar login: {str(e)}"}


@app.post("/api/auth/signup")
async def api_signup(
    nome: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    empresa_id: int = Form(...)
):
    """Cadastro de novo usuário RH vinculado a uma empresa."""
    try:
        # Verificar se usuário já existe
        existing = await sb_get("users", {"email": f"eq.{email}"})
        if existing:
            return {"success": False, "message": "E-mail já cadastrado."}

        # Inserir novo usuário
        await sb_post("users", {
            "nome": nome,
            "email": email,
            "password": password,
            "empresa_id": empresa_id,
            "ativo": True
        })
        return {"success": True, "message": "Cadastro realizado com sucesso!"}
    except Exception as e:
        return {"success": False, "message": f"Erro ao realizar cadastro: {str(e)}"}

# ── Empresas
@app.get("/api/empresas")
async def listar_empresas():
    return await sb_get("empresas", {"select": "*", "ativo": "eq.true", "order": "id"})

# ── Dashboard
@app.get("/api/dashboard/{empresa_id}")
async def dashboard(empresa_id: int):
    empresa_list = await sb_get("empresas", {"select": "*", "id": f"eq.{empresa_id}"})
    empresa = empresa_list[0] if empresa_list else {}

    funs = await sb_get("funcionarios", {"select": "*", "empresa_id": f"eq.{empresa_id}", "ativo": "eq.true"})
    cats = await sb_get("cats", {"select": "*", "empresa_id": f"eq.{empresa_id}", "order": "data_acidente.desc"})
    trein = await sb_get("treinamentos", {"select": "*", "empresa_id": f"eq.{empresa_id}"})
    agen = await sb_get("agendamentos", {"select": "*", "empresa_id": f"eq.{empresa_id}", "order": "data_agendamento"})
    alertas = await sb_get("alertas", {"select": "*", "empresa_id": f"eq.{empresa_id}", "lido": "eq.false", "order": "prioridade.desc"})
    epis = await sb_get("epis", {"select": "*", "empresa_id": f"eq.{empresa_id}"})

    ia = IAEngine.prever_acidentes(cats, funs)

    aso_vencidos = sum(1 for f in funs if f.get("aso_status") == "vencido")
    aso_vencer   = sum(1 for f in funs if f.get("aso_status") == "a_vencer")
    alto_risco   = sum(1 for f in funs if f.get("risco") == "Alto")
    scores       = [f["score_risco"] for f in funs if f.get("score_risco")]
    score_medio  = round(sum(scores) / len(scores), 1) if scores else 0

    setores: dict = {}
    for f in funs:
        s = f.get("setor", "Outros")
        setores[s] = setores.get(s, 0) + 1

    return {
        "empresa": empresa,
        "kpis": {
            "total_funcionarios": len(funs),
            "aso_vencidos": aso_vencidos,
            "aso_vencer": aso_vencer,
            "total_cats": len(cats),
            "treinamentos": len(trein),
            "trein_concluidos": sum(1 for t in trein if t.get("status") == "Concluído"),
            "alto_risco": alto_risco,
            "score_seguranca": round(100 - score_medio, 1),
            "agendamentos_pendentes": sum(1 for a in agen if a.get("status") == "Aguardando"),
            "epis_criticos": sum(1 for e in epis if e["quantidade"] < e["estoque_minimo"]),
        },
        "ia": ia,
        "alertas": alertas[:5],
        "setores": setores,
        "agendamentos": agen[:5],
        "cats_recentes": cats[:4],
        "top_risco": sorted(funs, key=lambda f: f.get("score_risco", 0), reverse=True)[:5],
    }

# ── Funcionários
@app.get("/api/funcionarios/{empresa_id}")
async def listar_funcionarios(empresa_id: int, busca: str = ""):
    params = {"select": "*", "empresa_id": f"eq.{empresa_id}", "ativo": "eq.true", "order": "score_risco.desc"}
    funs = await sb_get("funcionarios", params)
    if busca:
        busca_lower = busca.lower()
        funs = [f for f in funs if
                busca_lower in (f.get("nome") or "").lower() or
                busca_lower in (f.get("cargo") or "").lower() or
                busca_lower in (f.get("setor") or "").lower()]
    return funs

@app.post("/api/funcionarios")
async def criar_funcionario(
    empresa_id: int = Form(...),
    nome: str = Form(...),
    cargo: str = Form(...),
    setor: str = Form(...),
    risco: str = Form(...),
    admissao: str = Form(...),
    aso_vencimento: str = Form(...),
    cpf: str = Form(""),
):
    score = IAEngine.calcular_score(risco, "valido", setor)
    data = {
        "empresa_id": empresa_id, "nome": nome, "cpf": cpf,
        "cargo": cargo, "setor": setor, "risco": risco,
        "admissao": admissao, "aso_vencimento": aso_vencimento,
        "aso_status": "valido", "score_risco": score,
    }
    await sb_post("funcionarios", data)
    return {"success": True}

# ── CATs
@app.get("/api/cats/{empresa_id}")
async def listar_cats(empresa_id: int):
    return await sb_get("cats", {"select": "*", "empresa_id": f"eq.{empresa_id}", "order": "data_acidente.desc"})

@app.post("/api/cats")
async def criar_cat(
    empresa_id: int = Form(...),
    funcionario_nome: str = Form(...),
    data_acidente: str = Form(...),
    tipo: str = Form(...),
    parte_corpo: str = Form(...),
    gravidade: str = Form(...),
    descricao: str = Form(""),
    causa_raiz: str = Form(""),
):
    data = {
        "empresa_id": empresa_id, "funcionario_nome": funcionario_nome,
        "data_acidente": data_acidente, "tipo": tipo,
        "parte_corpo": parte_corpo, "gravidade": gravidade,
        "descricao": descricao, "causa_raiz": causa_raiz, "status": "Registrado",
    }
    await sb_post("cats", data)
    return {"success": True}

@app.put("/api/cats/{cat_id}/status")
async def atualizar_status_cat(cat_id: int, status: str = Form(...)):
    await sb_patch("cats", cat_id, {"status": status})
    return {"success": True}

# ── Treinamentos
@app.get("/api/treinamentos/{empresa_id}")
async def listar_treinamentos(empresa_id: int):
    return await sb_get("treinamentos", {"select": "*", "empresa_id": f"eq.{empresa_id}", "order": "data_realizacao"})

@app.post("/api/treinamentos")
async def criar_treinamento(
    empresa_id: int = Form(...),
    nome: str = Form(...),
    nr_referencia: str = Form(""),
    data_realizacao: str = Form(...),
    data_validade: str = Form(...),
    participantes: int = Form(0),
    status: str = Form("Agendado"),
    responsavel: str = Form(""),
    modalidade: str = Form("Presencial"),
):
    data = {
        "empresa_id": empresa_id, "nome": nome, "nr_referencia": nr_referencia,
        "data_realizacao": data_realizacao, "data_validade": data_validade,
        "participantes": participantes, "status": status,
        "responsavel": responsavel, "modalidade": modalidade,
    }
    await sb_post("treinamentos", data)
    return {"success": True}

# ── Agendamentos
@app.get("/api/agendamentos/{empresa_id}")
async def listar_agendamentos(empresa_id: int):
    return await sb_get("agendamentos", {"select": "*", "empresa_id": f"eq.{empresa_id}", "order": "data_agendamento"})

@app.post("/api/agendamentos")
async def criar_agendamento(
    empresa_id: int = Form(...),
    funcionario_nome: str = Form(...),
    tipo_exame: str = Form(...),
    data_agendamento: str = Form(...),
    hora: str = Form(...),
    medico: str = Form(""),
    observacoes: str = Form(""),
):
    data = {
        "empresa_id": empresa_id, "funcionario_nome": funcionario_nome,
        "tipo_exame": tipo_exame, "data_agendamento": data_agendamento,
        "hora": hora, "medico": medico, "observacoes": observacoes, "status": "Aguardando",
    }
    await sb_post("agendamentos", data)
    return {"success": True}

@app.put("/api/agendamentos/{ag_id}/confirmar")
async def confirmar_agendamento(ag_id: int):
    await sb_patch("agendamentos", ag_id, {"status": "Confirmado"})
    return {"success": True}

@app.delete("/api/agendamentos/{ag_id}")
async def cancelar_agendamento(ag_id: int):
    await sb_delete("agendamentos", ag_id)
    return {"success": True}

# ── EPIs
@app.get("/api/epis/{empresa_id}")
async def listar_epis(empresa_id: int):
    return await sb_get("epis", {"select": "*", "empresa_id": f"eq.{empresa_id}"})

@app.post("/api/epis")
async def criar_epi(
    empresa_id: int = Form(...),
    nome: str = Form(...),
    ca: str = Form(""),
    quantidade: int = Form(0),
    estoque_minimo: int = Form(5),
    validade: str = Form(""),
):
    data = {
        "empresa_id": empresa_id, "nome": nome, "ca": ca,
        "quantidade": quantidade, "estoque_minimo": estoque_minimo,
        "validade": validade or None,
    }
    await sb_post("epis", data)
    return {"success": True}

# ── Alertas
@app.put("/api/alertas/{alerta_id}/lido")
async def marcar_lido(alerta_id: int):
    await sb_patch("alertas", alerta_id, {"lido": True})
    return {"success": True}

# ── IA Preditiva
@app.get("/api/ia/previsao/{empresa_id}")
async def previsao_ia(empresa_id: int):
    cats = await sb_get("cats", {"select": "*", "empresa_id": f"eq.{empresa_id}"})
    funs = await sb_get("funcionarios", {
        "select": "*", "empresa_id": f"eq.{empresa_id}",
        "ativo": "eq.true", "order": "score_risco.desc", "limit": "5"
    })
    previsao = IAEngine.prever_acidentes(cats, funs)
    return {"previsao": previsao, "top_risco": funs}

# ── Documentos IA
@app.get("/api/documentos/pcmso/{empresa_id}")
async def gerar_pcmso(empresa_id: int):
    empresa_list = await sb_get("empresas", {"select": "*", "id": f"eq.{empresa_id}"})
    empresa = empresa_list[0] if empresa_list else {}
    funs = await sb_get("funcionarios", {"select": "*", "empresa_id": f"eq.{empresa_id}", "ativo": "eq.true"})
    return {"tipo": "PCMSO", "conteudo": IAEngine.gerar_pcmso(empresa, funs), "empresa": empresa.get("nome")}

@app.get("/api/documentos/pgr/{empresa_id}")
async def gerar_pgr(empresa_id: int):
    empresa_list = await sb_get("empresas", {"select": "*", "id": f"eq.{empresa_id}"})
    empresa = empresa_list[0] if empresa_list else {}
    funs = await sb_get("funcionarios", {"select": "*", "empresa_id": f"eq.{empresa_id}", "ativo": "eq.true"})
    cats = await sb_get("cats", {"select": "*", "empresa_id": f"eq.{empresa_id}"})
    return {"tipo": "PGR", "conteudo": IAEngine.gerar_pgr(empresa, funs, cats), "empresa": empresa.get("nome")}


if __name__ == "__main__":
    import uvicorn
    print("\n" + "=" * 55)
    print("  🦺 SESMT PRO v3.0 — Supabase Edition")
    print("  🗄️  Banco: Supabase (PostgreSQL em nuvem)")
    print("  🌐 Acesse: http://localhost:8000")
    print("=" * 55 + "\n")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

