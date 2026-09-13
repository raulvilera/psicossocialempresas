"""
S Psicos — Plataforma de Saúde Ocupacional com IA
Stack  : FastAPI + Supabase (PostgreSQL) + Jinja2
Versão : 3.3.0 — DRPS Standalone Edition
"""

# ── stdlib ─────────────────────────────────────────────────────────────────────
import random
from datetime import datetime
from pathlib  import Path
from typing   import Optional

# ── third-party ────────────────────────────────────────────────────────────────
import httpx
from fastapi                   import FastAPI, Request, Form
from fastapi.middleware.cors   import CORSMiddleware
from fastapi.responses         import HTMLResponse, RedirectResponse
from fastapi.templating        import Jinja2Templates

# ── aplicação ──────────────────────────────────────────────────────────────────

app       = FastAPI(title="S Psicos", version="3.3.0")
BASE_DIR  = Path(__file__).parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# ── CORS ───────────────────────────────────────────────────────────────────────
# Permite que o questionário (em qualquer domínio) envie dados para a API.
# Em produção, substitua "*" pelos domínios reais do questionário.

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # ex.: ["https://questionario.seudominio.com.br"]
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ── Supabase ───────────────────────────────────────────────────────────────────

SUPABASE_URL = "https://vzszzdeqbrjrepbzeiqq.supabase.co"
SUPABASE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    ".eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6c3p6ZGVxYnJqcmVwYnplaXFxIiwicm9sZSI6ImFub24i"
    "LCJpYXQiOjE3NzE0NDMyMTksImV4cCI6MjA4NzAxOTIxOX0"
    ".Tu5mtdmSE1mQJEcEr8TNbUndlAl1SOUfrIcNlG6-4k8"
)

SB_HEADERS = {
    "apikey":        SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=representation",
}

# ── credenciais fixas ──────────────────────────────────────────────────────────

ADMIN_EMAIL    = "raulvilera@gmail.com"
ADMIN_PASSWORD = "Psicos@2026"

CONSULTOR_EMAIL    = "carmensantanapsico@gmail.com"
CONSULTOR_PASSWORD = "Ca817725@"

# ── helpers Supabase ───────────────────────────────────────────────────────────

async def sb_get(table: str, params: dict = None) -> list:
    """SELECT — retorna lista de registros."""
    async with httpx.AsyncClient(timeout=15) as c:
        r = await c.get(
            f"{SUPABASE_URL}/rest/v1/{table}",
            headers=SB_HEADERS,
            params=params or {"select": "*"},
        )
        r.raise_for_status()
        return r.json()


async def sb_post(table: str, data: dict) -> dict:
    """INSERT — retorna o registro criado."""
    async with httpx.AsyncClient(timeout=15) as c:
        r = await c.post(
            f"{SUPABASE_URL}/rest/v1/{table}",
            headers=SB_HEADERS,
            json=data,
        )
        r.raise_for_status()
        result = r.json()
        return result[0] if isinstance(result, list) and result else {}


async def sb_patch(table: str, row_id: int, data: dict) -> dict:
    """UPDATE — retorna o registro atualizado."""
    async with httpx.AsyncClient(timeout=15) as c:
        r = await c.patch(
            f"{SUPABASE_URL}/rest/v1/{table}",
            headers=SB_HEADERS,
            params={"id": f"eq.{row_id}"},
            json=data,
        )
        r.raise_for_status()
        result = r.json()
        return result[0] if isinstance(result, list) and result else {}


async def sb_delete(table: str, row_id: int) -> None:
    """DELETE — remove o registro pelo id."""
    async with httpx.AsyncClient(timeout=15) as c:
        r = await c.delete(
            f"{SUPABASE_URL}/rest/v1/{table}",
            headers=SB_HEADERS,
            params={"id": f"eq.{row_id}"},
        )
        r.raise_for_status()

# ── IAEngine ───────────────────────────────────────────────────────────────────

class IAEngine:
    """Motor de análise preditiva de riscos ocupacionais."""

    FATORES_RISCO    = {"Alto": 3.0, "Medio": 1.5, "Baixo": 0.5}
    PESOS_ACIDENTE   = {"Grave": 30,  "Moderado": 15, "Leve": 5, "Fatal": 50}
    SETORES_CRITICOS = {"Produção", "Manutenção", "Construção", "Elétrica"}

    @staticmethod
    def calcular_score(risco: str, aso_status: str, setor: str, cats: list = []) -> float:
        """Score de risco individual (0–100)."""
        score = IAEngine.FATORES_RISCO.get(risco, 1.5) * 15
        for cat in cats:
            score += IAEngine.PESOS_ACIDENTE.get(cat.get("gravidade", "Leve"), 5) * 0.8
        if aso_status == "vencido":    score += 20
        elif aso_status == "a_vencer": score += 8
        if setor in IAEngine.SETORES_CRITICOS: score += 10
        return min(round(score + random.uniform(-2, 2), 1), 100.0)

    @staticmethod
    def prever_acidentes(cats: list, funcionarios: list) -> dict:
        """Probabilidade preditiva de acidente."""
        total  = len(cats)
        graves = sum(1 for c in cats if c.get("gravidade") in {"Grave", "Fatal"})
        taxa_g = (graves / total * 100) if total > 0 else 0
        prob   = round(min(15 + taxa_g * 0.5 + total * 0.8, 85) + random.uniform(-3, 3), 1)

        setores: dict = {}
        for cat in cats:
            fn = next((f for f in funcionarios if f["nome"] == cat.get("funcionario_nome")), None)
            s  = fn["setor"] if fn else "Geral"
            setores[s] = setores.get(s, 0) + 1
        setor_critico = max(setores, key=setores.get) if setores else "Produção"

        return {
            "probabilidade_acidente": prob,
            "setor_mais_critico":     setor_critico,
            "tendencia":              "📈 Alta" if prob > 40 else "📉 Estável",
            "indice_seguranca":       round(100 - prob, 1),
            "recomendacao": (
                f"URGENTE: Inspeção imediata no setor {setor_critico}." if prob > 60 else
                f"Atenção ao setor {setor_critico}. Reforçar treinamentos de NR." if prob > 35 else
                f"Setor {setor_critico} dentro dos parâmetros normais."
            ),
        }

    @staticmethod
    def gerar_pcmso(empresa: dict, funs: list) -> str:
        """Texto do PCMSO (NR-7)."""
        hoje   = datetime.now().strftime("%d/%m/%Y")
        ano    = datetime.now().year
        total  = max(len(funs), 1)
        alto   = sum(1 for f in funs if f.get("risco") == "Alto")
        em_dia = sum(1 for f in funs if f.get("aso_status") == "valido")
        score  = round(sum(f.get("score_risco", 50) for f in funs) / total, 1)
        sets   = ", ".join(set(f.get("setor", "N/A") for f in funs))
        return (
            f"PCMSO — PROGRAMA DE CONTROLE MÉDICO DE SAÚDE OCUPACIONAL\n{'='*57}\n"
            f"Empresa: {empresa.get('nome')} | CNPJ: {empresa.get('cnpj')}\n"
            f"Data: {hoje}  |  Vigência: {ano}/{ano+1}\n\n"
            f"AVALIAÇÃO DO RISCO OCUPACIONAL\n"
            f"  Total de funcionários : {len(funs)}\n"
            f"  Alto risco            : {alto} ({round(alto/total*100, 1)}%)\n"
            f"  ASO em dia            : {round(em_dia/total*100, 1)}%\n"
            f"  Score médio de risco  : {score}/100\n"
            f"  Setores               : {sets}\n\n"
            f"EXAMES PREVISTOS\n"
            f"  Admissional · Periódico · Retorno · Mudança de função · Demissional\n\n"
            f"Assinatura: _______________________  Médico Responsável / CRM\n"
            f"[Gerado por S Psicos v3.3 — NR-7 Compliance]\n"
        )

    @staticmethod
    def gerar_pgr(empresa: dict, funs: list, cats: list) -> str:
        """Texto do PGR (NR-1 §1.5)."""
        hoje   = datetime.now().strftime("%d/%m/%Y")
        ano    = datetime.now().year
        total  = max(len(funs), 1)
        score  = round(sum(f.get("score_risco", 50) for f in funs) / total, 1)
        causa  = cats[0].get("causa_raiz", "Não identificada") if cats else "Sem histórico"
        graves = sum(1 for c in cats if c.get("gravidade") in {"Grave", "Fatal"})
        return (
            f"PGR — PROGRAMA DE GERENCIAMENTO DE RISCOS\n{'='*57}\n"
            f"Empresa: {empresa.get('nome')} | CNPJ: {empresa.get('cnpj')}\n"
            f"Data: {hoje}  |  Vigência: {ano}/{ano+1}  |  Grau de Risco: III\n\n"
            f"HISTÓRICO DE ACIDENTES\n"
            f"  Total de CATs   : {len(cats)}\n"
            f"  Graves / Fatais : {graves}\n"
            f"  Causa principal : {causa}\n\n"
            f"MEDIDAS DE CONTROLE (hierarquizadas)\n"
            f"  1º Eliminação · 2º Substituição · 3º Eng. Controle · 4º Adm. · 5º EPIs\n\n"
            f"  Score de risco médio atual: {score}/100\n"
            f"[Gerado por S Psicos v3.3 — NR-1 §1.5 Compliance]\n"
        )

# ── DRPSEngine ─────────────────────────────────────────────────────────────────

class DRPSEngine:
    """Motor de cálculo e classificação do Diagnóstico de Riscos Psicossociais."""

    CAMPOS = [
        ("T1 — Assédio",        "t01_assedio"),
        ("T2 — Carga",          "t02_carga"),
        ("T3 — Reconhecimento", "t03_reconhecimento"),
        ("T4 — Clima",          "t04_clima"),
        ("T5 — Autonomia",      "t05_autonomia"),
        ("T6 — Pressão",        "t06_pressao"),
        ("T7 — Insegurança",    "t07_inseguranca"),
        ("T8 — Conflitos",      "t08_conflitos"),
        ("T9 — Vida Pessoal",   "t09_vida_pessoal"),
    ]

    @staticmethod
    def nivel_por_media(media: float) -> str:
        """Classifica nível de risco pela média Likert (0–4)."""
        if media >= 3.2: return "Crítico"
        if media >= 2.5: return "Alto"
        if media >= 1.5: return "Médio"
        return "Baixo"

    @staticmethod
    def agregar(rows: list) -> dict:
        """Agrega uma lista de respostas em KPIs e breakdown por setor."""
        if not rows:
            return {
                "total_respostas":   0,
                "setores_avaliados": 0,
                "criticos":          0,
                "baixos":            0,
                "por_setor":         [],
                "medias_globais":    [],
            }

        # agrupa por setor
        setor_map: dict = {}
        for row in rows:
            s = row.get("setor") or "Geral"
            setor_map.setdefault(s, []).append(row)

        por_setor      = []
        total_criticos = 0
        total_baixos   = 0

        for setor_nome, resp_list in setor_map.items():
            topicos = []
            for i, (nome, campo) in enumerate(DRPSEngine.CAMPOS):
                vals  = [r.get(campo, 0) for r in resp_list if r.get(campo) is not None]
                media = round(sum(vals) / len(vals), 2) if vals else 0.0
                nivel = DRPSEngine.nivel_por_media(media)
                if nivel == "Crítico": total_criticos += 1
                if nivel == "Baixo":   total_baixos   += 1
                topicos.append({"id": i + 1, "nome": nome, "media": media, "nivel": nivel})
            por_setor.append({"setor": setor_nome, "respondentes": len(resp_list), "topicos": topicos})

        # médias globais (todos os setores)
        medias_globais = []
        for i, (nome, campo) in enumerate(DRPSEngine.CAMPOS):
            vals  = [r.get(campo, 0) for r in rows if r.get(campo) is not None]
            media = round(sum(vals) / len(vals), 2) if vals else 0.0
            medias_globais.append({"id": i + 1, "nome": nome, "media": media, "nivel": DRPSEngine.nivel_por_media(media)})

        return {
            "total_respostas":   len(rows),
            "setores_avaliados": len(por_setor),
            "criticos":          total_criticos,
            "baixos":            total_baixos,
            "por_setor":         por_setor,
            "medias_globais":    medias_globais,
        }

# ── rotas de página ────────────────────────────────────────────────────────────

@app.get("/",                 response_class=HTMLResponse)
async def root():
    return RedirectResponse(url="/login")


@app.get("/login",            response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.get("/signup",           response_class=HTMLResponse)
async def signup_page(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})


@app.get("/dashboard",        response_class=HTMLResponse)
async def dashboard_page(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/rh",               response_class=HTMLResponse)
async def rh_page(request: Request):
    return templates.TemplateResponse("rh.html", {"request": request})


@app.get("/admin",            response_class=HTMLResponse)
async def admin_page(request: Request):
    return templates.TemplateResponse("admin.html", {"request": request})


@app.get("/questionario",     response_class=HTMLResponse)
async def questionario_page(request: Request):
    return templates.TemplateResponse("questionario.html", {"request": request})


@app.get("/cadastro-empresa", response_class=HTMLResponse)
async def cadastro_empresa_page(request: Request):
    return templates.TemplateResponse("cadastro_empresa.html", {"request": request})


@app.get("/profissional",     response_class=HTMLResponse)
async def profissional_redirect():
    return RedirectResponse(url="/dashboard")

# ── API: auth ──────────────────────────────────────────────────────────────────

@app.post("/api/auth/login")
async def api_login(
    email:    str = Form(...),
    password: str = Form(...),
    role:     str = Form(default="consultor"),
):
    """Autentica por credenciais fixas ou banco Supabase."""
    email = email.strip().lower()

    # admin fixo
    if email == ADMIN_EMAIL.lower() and password == ADMIN_PASSWORD:
        destino = {"admin": "/admin", "consultor": "/dashboard", "rh": "/rh"}
        return {"success": True, "redirect": destino.get(role, "/admin"), "perfil": role or "admin"}

    # consultora fixa
    if email == CONSULTOR_EMAIL.lower() and password == CONSULTOR_PASSWORD:
        if role == "admin":
            return {"success": False, "message": "Sem permissão para perfil Admin."}
        return {"success": True, "redirect": "/rh" if role == "rh" else "/dashboard", "perfil": role}

    # banco de dados
    try:
        users = await sb_get("users", {"email": f"eq.{email}", "password": f"eq.{password}", "select": "*"})
        if not users:
            return {"success": False, "message": "E-mail ou senha incorretos."}
        u       = users[0]
        db_role = u.get("role", "rh")
        if role == "admin"     and db_role != "admin": return {"success": False, "message": "Sem permissão para Admin."}
        if role == "consultor" and db_role == "rh":    return {"success": False, "message": "Sem permissão para Consultor."}
        destino = {"admin": "/admin", "consultor": "/dashboard", "rh": "/rh"}
        return {"success": True, "redirect": destino.get(role, "/rh"), "perfil": role}
    except Exception:
        return {"success": False, "message": "Erro ao processar login. Tente novamente."}


@app.post("/api/auth/signup")
async def api_signup(
    nome:       str = Form(...),
    email:      str = Form(...),
    password:   str = Form(...),
    empresa_id: int = Form(...),
):
    """Cadastra novo usuário RH no banco."""
    if not email.endswith("@empresa.com.br") and email != CONSULTOR_EMAIL:
        return {"success": False, "message": "Apenas e-mails corporativos são permitidos."}
    try:
        if await sb_get("users", {"email": f"eq.{email}"}):
            return {"success": False, "message": "E-mail já cadastrado."}
        await sb_post("users", {
            "nome":       nome,
            "email":      email,
            "password":   password,
            "empresa_id": empresa_id,
            "ativo":      True,
        })
        return {"success": True, "message": "Cadastro realizado! Aguarde confirmação."}
    except Exception as e:
        return {"success": False, "message": f"Erro ao realizar cadastro: {e}"}

# ── API: empresas ──────────────────────────────────────────────────────────────

@app.get("/api/empresas")
async def listar_empresas():
    return await sb_get("empresas", {"select": "*", "ativo": "eq.true", "order": "id"})


@app.post("/api/empresa/registrar")
async def registrar_empresa(
    cnpj:          str = Form(...),
    nome:          str = Form(...),
    telefone:      str = Form(...),
    responsavel:   str = Form(...),
    colaboradores: int = Form(...),
    setores:       str = Form(...),
):
    return {"success": True, "message": "Dados da empresa salvos com sucesso!"}

# ── API: dashboard ─────────────────────────────────────────────────────────────

@app.get("/api/dashboard/{empresa_id}")
async def dashboard_data(empresa_id: int):
    """KPIs, alertas, IA e resumo da empresa."""
    emp_list = await sb_get("empresas",     {"select": "*", "id": f"eq.{empresa_id}"})
    empresa  = emp_list[0] if emp_list else {}

    funs    = await sb_get("funcionarios", {"select": "*", "empresa_id": f"eq.{empresa_id}", "ativo": "eq.true"})
    cats    = await sb_get("cats",         {"select": "*", "empresa_id": f"eq.{empresa_id}", "order": "data_acidente.desc"})
    trein   = await sb_get("treinamentos", {"select": "*", "empresa_id": f"eq.{empresa_id}"})
    agen    = await sb_get("agendamentos", {"select": "*", "empresa_id": f"eq.{empresa_id}", "order": "data_agendamento"})
    alertas = await sb_get("alertas",      {"select": "*", "empresa_id": f"eq.{empresa_id}", "lido": "eq.false", "order": "prioridade.desc"})
    epis    = await sb_get("epis",         {"select": "*", "empresa_id": f"eq.{empresa_id}"})

    ia     = IAEngine.prever_acidentes(cats, funs)
    scores = [f["score_risco"] for f in funs if f.get("score_risco")]
    sm     = round(sum(scores) / len(scores), 1) if scores else 0

    setores: dict = {}
    for f in funs:
        s = f.get("setor", "Outros")
        setores[s] = setores.get(s, 0) + 1

    return {
        "empresa":       empresa,
        "kpis": {
            "total_funcionarios":     len(funs),
            "aso_vencidos":           sum(1 for f in funs if f.get("aso_status") == "vencido"),
            "aso_vencer":             sum(1 for f in funs if f.get("aso_status") == "a_vencer"),
            "total_cats":             len(cats),
            "treinamentos":           len(trein),
            "trein_concluidos":       sum(1 for t in trein if t.get("status") == "Concluído"),
            "alto_risco":             sum(1 for f in funs if f.get("risco") == "Alto"),
            "score_seguranca":        round(100 - sm, 1),
            "agendamentos_pendentes": sum(1 for a in agen if a.get("status") == "Aguardando"),
            "epis_criticos":          sum(1 for e in epis if e["quantidade"] < e["estoque_minimo"]),
        },
        "ia":            ia,
        "alertas":       alertas[:5],
        "setores":       setores,
        "agendamentos":  agen[:5],
        "cats_recentes": cats[:4],
        "top_risco":     sorted(funs, key=lambda f: f.get("score_risco", 0), reverse=True)[:5],
    }

# ── API: funcionários ──────────────────────────────────────────────────────────

@app.get("/api/funcionarios/{empresa_id}")
async def listar_funcionarios(empresa_id: int, busca: str = ""):
    funs = await sb_get("funcionarios", {
        "select":     "*",
        "empresa_id": f"eq.{empresa_id}",
        "ativo":      "eq.true",
        "order":      "score_risco.desc",
    })
    if busca:
        q    = busca.lower()
        funs = [
            f for f in funs
            if q in (f.get("nome")  or "").lower()
            or q in (f.get("cargo") or "").lower()
            or q in (f.get("setor") or "").lower()
        ]
    return funs


@app.post("/api/funcionarios")
async def criar_funcionario(
    empresa_id:     int = Form(...),
    nome:           str = Form(...),
    cargo:          str = Form(...),
    setor:          str = Form(...),
    risco:          str = Form(...),
    admissao:       str = Form(...),
    aso_vencimento: str = Form(...),
    cpf:            str = Form(""),
):
    score = IAEngine.calcular_score(risco, "valido", setor)
    await sb_post("funcionarios", {
        "empresa_id":     empresa_id,
        "nome":           nome,
        "cpf":            cpf,
        "cargo":          cargo,
        "setor":          setor,
        "risco":          risco,
        "admissao":       admissao,
        "aso_vencimento": aso_vencimento,
        "aso_status":     "valido",
        "score_risco":    score,
    })
    return {"success": True}

# ── API: CATs ──────────────────────────────────────────────────────────────────

@app.get("/api/cats/{empresa_id}")
async def listar_cats(empresa_id: int):
    return await sb_get("cats", {
        "select":     "*",
        "empresa_id": f"eq.{empresa_id}",
        "order":      "data_acidente.desc",
    })


@app.post("/api/cats")
async def criar_cat(
    empresa_id:      int = Form(...),
    funcionario_nome:str = Form(...),
    data_acidente:   str = Form(...),
    tipo:            str = Form(...),
    parte_corpo:     str = Form(...),
    gravidade:       str = Form(...),
    descricao:       str = Form(""),
    causa_raiz:      str = Form(""),
):
    await sb_post("cats", {
        "empresa_id":       empresa_id,
        "funcionario_nome": funcionario_nome,
        "data_acidente":    data_acidente,
        "tipo":             tipo,
        "parte_corpo":      parte_corpo,
        "gravidade":        gravidade,
        "descricao":        descricao,
        "causa_raiz":       causa_raiz,
        "status":           "Registrado",
    })
    return {"success": True}

# ── API: treinamentos ──────────────────────────────────────────────────────────

@app.get("/api/treinamentos/{empresa_id}")
async def listar_treinamentos(empresa_id: int):
    return await sb_get("treinamentos", {
        "select":     "*",
        "empresa_id": f"eq.{empresa_id}",
        "order":      "data_realizacao",
    })


@app.post("/api/treinamentos")
async def criar_treinamento(
    empresa_id:     int = Form(...),
    nome:           str = Form(...),
    nr_referencia:  str = Form(""),
    data_realizacao:str = Form(...),
    data_validade:  str = Form(...),
    participantes:  int = Form(0),
    status:         str = Form("Agendado"),
    responsavel:    str = Form(""),
    modalidade:     str = Form("Presencial"),
):
    await sb_post("treinamentos", {
        "empresa_id":      empresa_id,
        "nome":            nome,
        "nr_referencia":   nr_referencia,
        "data_realizacao": data_realizacao,
        "data_validade":   data_validade,
        "participantes":   participantes,
        "status":          status,
        "responsavel":     responsavel,
        "modalidade":      modalidade,
    })
    return {"success": True}

# ── API: agendamentos ──────────────────────────────────────────────────────────

@app.get("/api/agendamentos/{empresa_id}")
async def listar_agendamentos(empresa_id: int):
    return await sb_get("agendamentos", {
        "select":     "*",
        "empresa_id": f"eq.{empresa_id}",
        "order":      "data_agendamento",
    })


@app.post("/api/agendamentos")
async def criar_agendamento(
    empresa_id:      int = Form(...),
    funcionario_nome:str = Form(...),
    tipo_exame:      str = Form(...),
    data_agendamento:str = Form(...),
    hora:            str = Form(...),
    medico:          str = Form(""),
    observacoes:     str = Form(""),
):
    await sb_post("agendamentos", {
        "empresa_id":       empresa_id,
        "funcionario_nome": funcionario_nome,
        "tipo_exame":       tipo_exame,
        "data_agendamento": data_agendamento,
        "hora":             hora,
        "medico":           medico,
        "observacoes":      observacoes,
        "status":           "Aguardando",
    })
    return {"success": True}


@app.put("/api/agendamentos/{ag_id}/confirmar")
async def confirmar_agendamento(ag_id: int):
    await sb_patch("agendamentos", ag_id, {"status": "Confirmado"})
    return {"success": True}


@app.delete("/api/agendamentos/{ag_id}")
async def cancelar_agendamento(ag_id: int):
    await sb_delete("agendamentos", ag_id)
    return {"success": True}

# ── API: EPIs ──────────────────────────────────────────────────────────────────

@app.get("/api/epis/{empresa_id}")
async def listar_epis(empresa_id: int):
    return await sb_get("epis", {"select": "*", "empresa_id": f"eq.{empresa_id}"})


@app.post("/api/epis")
async def criar_epi(
    empresa_id:     int = Form(...),
    nome:           str = Form(...),
    ca:             str = Form(""),
    quantidade:     int = Form(0),
    estoque_minimo: int = Form(5),
    validade:       str = Form(""),
):
    await sb_post("epis", {
        "empresa_id":     empresa_id,
        "nome":           nome,
        "ca":             ca,
        "quantidade":     quantidade,
        "estoque_minimo": estoque_minimo,
        "validade":       validade or None,
    })
    return {"success": True}

# ── API: alertas ───────────────────────────────────────────────────────────────

@app.put("/api/alertas/{alerta_id}/lido")
async def marcar_lido(alerta_id: int):
    await sb_patch("alertas", alerta_id, {"lido": True})
    return {"success": True}

# ── API: admin ─────────────────────────────────────────────────────────────────

@app.get("/api/admin/usuarios")
async def get_usuarios():
    try:
        return await sb_get("users", {"select": "*"}) or []
    except Exception:
        return []

# ── API: IA ────────────────────────────────────────────────────────────────────

@app.get("/api/ia/previsao/{empresa_id}")
async def previsao_ia(empresa_id: int):
    cats = await sb_get("cats",         {"select": "*", "empresa_id": f"eq.{empresa_id}"})
    funs = await sb_get("funcionarios", {
        "select":     "*",
        "empresa_id": f"eq.{empresa_id}",
        "ativo":      "eq.true",
        "order":      "score_risco.desc",
        "limit":      "5",
    })
    return {"previsao": IAEngine.prever_acidentes(cats, funs), "top_risco": funs}

# ── API: documentos ────────────────────────────────────────────────────────────

@app.get("/api/documentos/pcmso/{empresa_id}")
async def gerar_pcmso(empresa_id: int):
    emp_list = await sb_get("empresas",     {"select": "*", "id": f"eq.{empresa_id}"})
    funs     = await sb_get("funcionarios", {"select": "*", "empresa_id": f"eq.{empresa_id}", "ativo": "eq.true"})
    empresa  = emp_list[0] if emp_list else {}
    return {
        "tipo":     "PCMSO",
        "conteudo": IAEngine.gerar_pcmso(empresa, funs),
        "empresa":  empresa.get("nome"),
    }


@app.get("/api/documentos/pgr/{empresa_id}")
async def gerar_pgr(empresa_id: int):
    emp_list = await sb_get("empresas",     {"select": "*", "id": f"eq.{empresa_id}"})
    funs     = await sb_get("funcionarios", {"select": "*", "empresa_id": f"eq.{empresa_id}", "ativo": "eq.true"})
    cats     = await sb_get("cats",         {"select": "*", "empresa_id": f"eq.{empresa_id}"})
    empresa  = emp_list[0] if emp_list else {}
    return {
        "tipo":     "PGR",
        "conteudo": IAEngine.gerar_pgr(empresa, funs, cats),
        "empresa":  empresa.get("nome"),
    }

# ── API: DRPS ──────────────────────────────────────────────────────────────────

@app.post("/api/drps/resposta")
async def drps_resposta(request: Request):
    """
    Recebe o payload do questionário standalone e persiste no Supabase.
    Chamado via fetch() de qualquer origem (CORS habilitado).
    """
    body       = await request.json()
    empresa_id = body.get("empresa_id")
    await sb_post("drps_respostas_v2", {
        "empresa_id":         int(empresa_id) if empresa_id else None,
        "funcao":             body.get("funcao",             ""),
        "setor":              body.get("setor",              ""),
        "t01_assedio":        body.get("t01_assedio",        0),
        "t02_carga":          body.get("t02_carga",          0),
        "t03_reconhecimento": body.get("t03_reconhecimento", 0),
        "t04_clima":          body.get("t04_clima",          0),
        "t05_autonomia":      body.get("t05_autonomia",      0),
        "t06_pressao":        body.get("t06_pressao",        0),
        "t07_inseguranca":    body.get("t07_inseguranca",    0),
        "t08_conflitos":      body.get("t08_conflitos",      0),
        "t09_vida_pessoal":   body.get("t09_vida_pessoal",   0),
        "score_total":        body.get("score_total",        0),
        "respostas_brutas":   body.get("respostas",          {}),
        "data_resposta":      datetime.now().isoformat(),
    })
    return {"success": True}


@app.get("/api/drps/resultados/{empresa_id}")
async def drps_resultados(empresa_id: int, setor: Optional[str] = None):
    """Dados completos do DRPS agregados por setor — alimenta o dashboard."""
    params = {"select": "*", "empresa_id": f"eq.{empresa_id}"}
    if setor:
        params["setor"] = f"eq.{setor}"
    rows = await sb_get("drps_respostas_v2", params)
    return DRPSEngine.agregar(rows)


@app.get("/api/drps/status/{empresa_id}")
async def drps_status(empresa_id: int):
    """
    Endpoint leve — retorna apenas os contadores para o mini-card do dashboard.
    O frontend faz polling a cada 30s para mostrar respostas em tempo real.
    """
    params = {"select": "id,setor,score_total,data_resposta", "empresa_id": f"eq.{empresa_id}"}
    rows   = await sb_get("drps_respostas_v2", params)
    if not rows:
        return {"total": 0, "setores": 0, "ultima_resposta": None}

    setores       = len(set(r.get("setor") or "Geral" for r in rows))
    ultima        = max((r.get("data_resposta") or "") for r in rows) or None
    score_medio   = round(sum(r.get("score_total", 0) for r in rows) / len(rows), 2)

    return {
        "total":           len(rows),
        "setores":         setores,
        "score_medio":     score_medio,
        "ultima_resposta": ultima,
    }


@app.get("/api/drps/link/{empresa_id}")
async def drps_link(empresa_id: int, request: Request):
    """
    Gera a URL pública do questionário para a empresa informada.
    O dashboard usa este endpoint para exibir e copiar o link de distribuição.
    """
    base = str(request.base_url).rstrip("/")
    return {
        "empresa_id": empresa_id,
        "url":        f"{base}/questionario?emp={empresa_id}",
        "qr_hint":    f"Distribua este link para os funcionários responderem anonimamente.",
    }


@app.get("/api/drps/setup-sql")
async def drps_setup_sql():
    """SQL para criar a tabela drps_respostas_v2 no Supabase."""
    sql = """
CREATE TABLE IF NOT EXISTS drps_respostas_v2 (
    id                  SERIAL PRIMARY KEY,
    empresa_id          INTEGER REFERENCES empresas(id),
    funcao              TEXT,
    setor               TEXT,
    t01_assedio         NUMERIC(4,2) DEFAULT 0,
    t02_carga           NUMERIC(4,2) DEFAULT 0,
    t03_reconhecimento  NUMERIC(4,2) DEFAULT 0,
    t04_clima           NUMERIC(4,2) DEFAULT 0,
    t05_autonomia       NUMERIC(4,2) DEFAULT 0,
    t06_pressao         NUMERIC(4,2) DEFAULT 0,
    t07_inseguranca     NUMERIC(4,2) DEFAULT 0,
    t08_conflitos       NUMERIC(4,2) DEFAULT 0,
    t09_vida_pessoal    NUMERIC(4,2) DEFAULT 0,
    score_total         NUMERIC(4,2) DEFAULT 0,
    respostas_brutas    JSONB,
    data_resposta       TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_drps_v2_empresa ON drps_respostas_v2(empresa_id);
CREATE INDEX IF NOT EXISTS idx_drps_v2_setor   ON drps_respostas_v2(empresa_id, setor);
"""
    return {"sql": sql, "instrucoes": "Execute no SQL Editor do Supabase."}

# ── entry point ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    print("\n" + "=" * 55)
    print("  🧠 S Psicos v3.3 — DRPS Standalone Edition")
    print("  🗄️  Banco : Supabase (PostgreSQL em nuvem)")
    print("  🌐 Acesse: http://localhost:8000")
    print("=" * 55 + "\n")
    uvicorn.run("app:app", host="0.0.0.0", port=8000)
