-- ============================================================
-- SCRIPT DE LIBERAÇÃO DE ACESSO - PROFESSORA ALINE CARDOSO
-- Execute este script no SQL Editor do seu painel Supabase
-- ============================================================

-- 1. ADICIONAR E-MAILS À LISTA DE AUTORIZADOS
-- (Caso a tabela 'authorized_professors' exista no seu projeto)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'authorized_professors') THEN
        INSERT INTO authorized_professors (email) 
        VALUES 
          ('alinecardoso1@prof.educacao.sp.gov.br'),
          ('alinecardoso1@professor.educacao.sp.gov.br'),
          ('aline.gestao@prof.educacao.sp.gov.br')
        ON CONFLICT (email) DO NOTHING;
    END IF;
END $$;

-- 2. ATUALIZAR POLÍTICAS DE ACESSO (RLS) NA TABELA 'STUDENTS'
-- Isso garante que qualquer professor autenticado possa sincronizar alunos
DROP POLICY IF EXISTS "Allow write access for managers" ON students;
DROP POLICY IF EXISTS "Allow write access for all authorized users" ON students;
CREATE POLICY "Allow write access for all authorized users"
  ON students FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. VERIFICAÇÃO FINAL
-- Lista os e-mails que agora têm acesso de gestão
SELECT 'ACESSO DE GESTÃO LIBERADO PARA:' as status, email 
FROM authorized_professors 
WHERE email LIKE '%aline%';
