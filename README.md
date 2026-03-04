*Supabase

Plataforma de Segurança do Trabalho com IA e banco de dados em nuvem.

---

 Como Rodar (3 passos)

### 1. Instalar dependências
```bash
pip install -r requirements.txt
```

### 2. Iniciar o servidor
```bash
python app.py
```

### 3. Abrir no navegador
```
http://localhost:8000
```

---

## 🗄️ Banco de Dados

| Item | Valor |
|---|---|
| Plataforma | Supabase (PostgreSQL) |
| Projeto ID | vzszzdeqbrjrepbzeiqq |
| URL | https://vzszzdeqbrjrepbzeiqq.supabase.co |
| Tipo | Nuvem — dados persistem permanentemente |

### Tabelas criadas:
- `empresas` — cadastro multi-tenant
- `funcionarios` — colaboradores com score de risco IA
- `cats` — acidentes de trabalho
- `treinamentos` — treinamentos por NR
- `agendamentos` — exames e consultas
- `epis` — estoque de EPIs
- `alertas` — notificações inteligentes

---

## ✨ Diferença vs. versão SQLite

| Recurso | SQLite (v2) | Supabase (v3) |
|---|---|---|
| Dados persistem | ✅ Sim | ✅ Sim |
| Acesso remoto | ❌ Só local | ✅ Qualquer lugar |
| Backup automático | ❌ Manual | ✅ Automático |
| Escalabilidade | ⚠️ Limitada | ✅ Ilimitada |
| Dashboard web Supabase | ❌ | ✅ app.supabase.com |
| Multi-usuário simultâneo | ⚠️ Limitado | ✅ Nativo |

---

## 📡 API REST

Documentação Swagger: `http://localhost:8000/docs`

---

## 🔧 Próximas Evoluções

- [ ] Autenticação com Supabase Auth (login/senha)
- [ ] Row Level Security (RLS) por empresa
- [ ] Realtime updates via Supabase Realtime
- [ ] Notificações WhatsApp via Z-API
- [ ] Export PDF dos laudos
- [ ] Deploy no Railway/Render (produção)
