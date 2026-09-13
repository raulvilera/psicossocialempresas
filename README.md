# 🧠 S Psicos — Plataforma de Saúde Ocupacional & Riscos Psicossociais (NR-1)

Plataforma integrada de Gestão de Riscos Ocupacionais e Psicossociais com Inteligência Artificial preditiva e banco de dados Supabase (PostgreSQL em nuvem).

---

## 🚀 Como Rodar o Projeto

### 1. Instalar dependências
```bash
pip install -r requirements.txt
```

### 2. Iniciar o servidor
```bash
python app.py
```
ou utilizando `uvicorn`:
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### 3. Acessar a aplicação
- **Web App**: [http://localhost:8000](http://localhost:8000)
- **Questionário DRPS**: [http://localhost:8000/questionario](http://localhost:8000/questionario)
- **Documentação da API (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📂 Estrutura do Repositório

```text
Platafoma Psicos/
├── app.py                  # Servidor FastAPI v3.3 (DRPS Standalone Edition)
├── check_supabase.py       # Script utilitário de validação de conectividade
├── requirements.txt        # Dependências Python
├── vercel.json             # Configuração para deploy serverless
├── README.md               # Documentação oficial
└── templates/              # Templates Jinja2 (HTML5 / CSS / JS)
    ├── admin.html          # Painel Administrativo
    ├── cadastro_empresa.html # Cadastro de Empresas
    ├── index.html          # Dashboard Principal S Psicos
    ├── login.html          # Autenticação Multi-Perfil (RH, Consultor, Admin)
    ├── planos.html         # Página de Planos e Assinaturas
    ├── profissional.html   # Portal do Profissional / Consultor
    ├── questionario.html   # Questionário DRPS NR-1 Standalone
    ├── rh.html             # Painel Gestor de RH
    └── signup.html         # Cadastro de Usuários RH
```

---

## 🗄️ Banco de Dados & Arquitetura

| Item | Descrição |
|---|---|
| **Plataforma** | Supabase (PostgreSQL em nuvem) |
| **URL** | `https://vzszzdeqbrjrepbzeiqq.supabase.co` |
| **Tabelas Principais** | `empresas`, `users`, `funcionarios`, `drps_respostas_v2`, `cats`, `treinamentos`, `agendamentos`, `epis`, `alertas` |

---

## ⚙️ Principais Módulos

- **IAEngine**: Cálculo automatizado de score de risco individual, predição de acidentes e geração automatizada de relatórios PCMSO (NR-7) e PGR (NR-1).
- **DRPSEngine**: Diagnóstico de Riscos Psicossociais em 9 dimensões normativas (Assédio, Carga, Reconhecimento, Clima, Autonomia, Pressão, Insegurança, Conflitos, Vida Pessoal) com classificação de risco Likert e agregação por setor.
- **Multi-Perfil**: Níveis de acesso dedicados para RH da Empresa, Consultor Especialista e Administrador Geral.
