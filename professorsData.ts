// Mapeamento de e-mails institucionais para nomes de professores
// Este arquivo permite o preenchimento automático do nome do professor ao fazer login

export interface ProfessorData {
    email: string;
    nome: string;
    role?: 'gestor' | 'professor';
}

export const PROFESSORS_DB: ProfessorData[] = [
    // Contas de gestão
    { email: 'gestao@escola.com', nome: 'GESTÃO ESCOLAR', role: 'gestor' },
    { email: 'vilera@prof.educacao.sp.gov.br', nome: 'RAUL VILERA - GESTÃO', role: 'gestor' },
    { email: 'cadastroslkm@gmail.com', nome: 'CADASTROS LKM - GESTÃO', role: 'gestor' },
    { email: 'alinecardoso1@prof.educacao.sp.gov.br', nome: 'ALINE CARDOSO - GESTÃO', role: 'gestor' },
    { email: 'alinecardoso1@professor.educacao.sp.gov.br', nome: 'ALINE CARDOSO - GESTÃO', role: 'gestor' },
    { email: 'aline.gestao@prof.educacao.sp.gov.br', nome: 'ALINE CARDOSO - GESTÃO', role: 'gestor' },
    { email: 'deizylaura@prof.educacao.sp.gov.br', nome: 'DEIZY LAURA - GESTÃO', role: 'gestor' },
    { email: 'anderson.ikawa@servidor.educacao.sp.gov.br', nome: 'ANDERSON IKAWA - GESTÃO', role: 'gestor' },

    // Lista Completa Baseada na Imagem Oficial
    { email: 'luth@professor.educacao.sp.gov.br', nome: 'ALEX LUTH PEREIRA MARANHÃO', role: 'professor' },
    { email: 'luth@prof.educacao.sp.gov.br', nome: 'ALEX LUTH PEREIRA MARANHÃO', role: 'professor' },
    { email: 'avarella@professor.educacao.sp.gov.br', nome: 'ALEXANDRA PAULA VARELLA DE SOUZA', role: 'professor' },
    { email: 'avarella@prof.educacao.sp.gov.br', nome: 'ALEXANDRA PAULA VARELLA DE SOUZA', role: 'professor' },
    { email: 'alisonv@professor.educacao.sp.gov.br', nome: 'ALISON VASCONCELOS BESERRA', role: 'professor' },
    { email: 'alisonv@prof.educacao.sp.gov.br', nome: 'ALISON VASCONCELOS BESERRA', role: 'professor' },
    { email: 'anapereira08@professor.educacao.sp.gov.br', nome: 'ANA PAULA ALVES PEREIRA', role: 'professor' },
    { email: 'anapereira08@prof.educacao.sp.gov.br', nome: 'ANA PAULA ALVES PEREIRA', role: 'professor' },
    { email: 'sanfreitas@professor.educacao.sp.gov.br', nome: 'ANDREIA DOS SANTOS FREITAS', role: 'professor' },
    { email: 'sanfreitas@prof.educacao.sp.gov.br', nome: 'ANDREIA DOS SANTOS FREITAS', role: 'professor' },
    { email: 'andreiamadureira@professor.educacao.sp.gov.br', nome: 'ANDREIA MADUREIRA REIS', role: 'professor' },
    { email: 'andreiamadureira@prof.educacao.sp.gov.br', nome: 'ANDREIA MADUREIRA REIS', role: 'professor' },
    { email: 'antoniocarloso@professor.educacao.sp.gov.br', nome: 'ANTÔNIO CARLOS DE OLIVEIRA', role: 'professor' },
    { email: 'antoniocarloso@prof.educacao.sp.gov.br', nome: 'ANTÔNIO CARLOS DE OLIVEIRA', role: 'professor' },
    { email: 'antonioramosaraujo@professor.educacao.sp.gov.br', nome: 'ANTÔNIO RAMOS DE ARAUJO', role: 'professor' },
    { email: 'antonioramosaraujo@prof.educacao.sp.gov.br', nome: 'ANTÔNIO RAMOS DE ARAUJO', role: 'professor' },
    { email: 'antoniowilton@professor.educacao.sp.gov.br', nome: 'ANTÔNIO WILTON WANDERLEY CABRAL', role: 'professor' },
    { email: 'antoniowilton@prof.educacao.sp.gov.br', nome: 'ANTÔNIO WILTON WANDERLEY CABRAL', role: 'professor' },
    { email: 'augustolino@professor.educacao.sp.gov.br', nome: 'AUGUSTO LINO PESSOA NETO', role: 'professor' },
    { email: 'augustolino@prof.educacao.sp.gov.br', nome: 'AUGUSTO LINO PESSOA NETO', role: 'professor' },
    { email: 'carolinapermoniam@professor.educacao.sp.gov.br', nome: 'CAROLINA PERMONIAM PARUSSOLO', role: 'professor' },
    { email: 'carolinapermoniam@prof.educacao.sp.gov.br', nome: 'CAROLINA PERMONIAM PARUSSOLO', role: 'professor' },
    { email: 'charlesd@professor.educacao.sp.gov.br', nome: 'CHARLES DALAN JESUS DOS SANTOS', role: 'professor' },
    { email: 'charlesd@prof.educacao.sp.gov.br', nome: 'CHARLES DALAN JESUS DOS SANTOS', role: 'professor' },
    { email: 'cicero1@professor.educacao.sp.gov.br', nome: 'CÍCERO FERREIRA', role: 'professor' },
    { email: 'cicero1@prof.educacao.sp.gov.br', nome: 'CÍCERO FERREIRA', role: 'professor' },
    { email: 'aguiarl@professor.educacao.sp.gov.br', nome: 'CLAUDINEIA DE AGUIAR LIMA', role: 'professor' },
    { email: 'aguiarl@prof.educacao.sp.gov.br', nome: 'CLAUDINEIA DE AGUIAR LIMA', role: 'professor' },
    { email: 'danielalmeida@professor.educacao.sp.gov.br', nome: 'DANIEL DE FREITAS ALMEIDA', role: 'professor' },
    { email: 'danielalmeida@prof.educacao.sp.gov.br', nome: 'DANIEL DE FREITAS ALMEIDA', role: 'professor' },
    { email: 'daniellopesbarbosa@professor.educacao.sp.gov.br', nome: 'DANIEL LOPES BARBOSA', role: 'professor' },
    { email: 'daniellopesbarbosa@prof.educacao.sp.gov.br', nome: 'DANIEL LOPES BARBOSA', role: 'professor' },
    { email: 'danielaflima@professor.educacao.sp.gov.br', nome: 'DANIELA FERREIRA LIMA', role: 'professor' },
    { email: 'danielaflima@prof.educacao.sp.gov.br', nome: 'DANIELA FERREIRA LIMA', role: 'professor' },
    { email: 'deyseoliveira@professor.educacao.sp.gov.br', nome: 'DEYSE DE MIRANDA OLIVEIRA', role: 'professor' },
    { email: 'deyseoliveira@prof.educacao.sp.gov.br', nome: 'DEYSE DE MIRANDA OLIVEIRA', role: 'professor' },
    { email: 'ediane@professor.educacao.sp.gov.br', nome: 'EDIANE VIEIRA DA SILVA', role: 'professor' },
    { email: 'ediane@prof.educacao.sp.gov.br', nome: 'EDIANE VIEIRA DA SILVA', role: 'professor' },
    { email: 'edileusa@professor.educacao.sp.gov.br', nome: 'EDILEUSA NUNES PEREIRA', role: 'professor' },
    { email: 'edileusa@prof.educacao.sp.gov.br', nome: 'EDILEUSA NUNES PEREIRA', role: 'professor' },
    { email: 'henriquefonseca@professor.educacao.sp.gov.br', nome: 'EDUARDO HENRIQUE DA FONSECA', role: 'professor' },
    { email: 'henriquefonseca@prof.educacao.sp.gov.br', nome: 'EDUARDO HENRIQUE DA FONSECA', role: 'professor' },
    { email: 'essantos@professor.educacao.sp.gov.br', nome: 'ELIANE SANTOS SILVA', role: 'professor' },
    { email: 'essantos@prof.educacao.sp.gov.br', nome: 'ELIANE SANTOS SILVA', role: 'professor' },
    { email: 'elias1@professor.educacao.sp.gov.br', nome: 'ELIAS MONTEIRO DA SILVA', role: 'professor' },
    { email: 'elias1@prof.educacao.sp.gov.br', nome: 'ELIAS MONTEIRO DA SILVA', role: 'professor' },
    { email: 'elisabetepires@professor.educacao.sp.gov.br', nome: 'ELISABETE APARECIDA PIRES', role: 'professor' },
    { email: 'elisabetepires@prof.educacao.sp.gov.br', nome: 'ELISABETE APARECIDA PIRES', role: 'professor' },
    { email: 'egabler@professor.educacao.sp.gov.br', nome: 'EMERSON GABLER DE ALMEIDA', role: 'professor' },
    { email: 'egabler@prof.educacao.sp.gov.br', nome: 'EMERSON GABLER DE ALMEIDA', role: 'professor' },
    { email: 'erineidearagao@professor.educacao.sp.gov.br', nome: 'ERINEIDE LEITE ARAGÃO NERY', role: 'professor' },
    { email: 'erineidearagao@prof.educacao.sp.gov.br', nome: 'ERINEIDE LEITE ARAGÃO NERY', role: 'professor' },
    { email: 'euzeli@professor.educacao.sp.gov.br', nome: 'EUZELI ARAÚJO DE OLIVEIRA', role: 'professor' },
    { email: 'euzeli@prof.educacao.sp.gov.br', nome: 'EUZELI ARAÚJO DE OLIVEIRA', role: 'professor' },
    { email: 'fabianoaugusto@professor.educacao.sp.gov.br', nome: 'FABIANO AUGUSTO PIEDADE', role: 'professor' },
    { email: 'fabianoaugusto@prof.educacao.sp.gov.br', nome: 'FABIANO AUGUSTO PIEDADE', role: 'professor' },
    { email: 'camilof@professor.educacao.sp.gov.br', nome: 'FÁBIO CAMILO', role: 'professor' },
    { email: 'camilof@prof.educacao.sp.gov.br', nome: 'FÁBIO CAMILO', role: 'professor' },
    { email: 'fernandojs@professor.educacao.sp.gov.br', nome: 'FERNANDO JOSÉ DA SILVA FILHO', role: 'professor' },
    { email: 'fernandojs@prof.educacao.sp.gov.br', nome: 'FERNANDO JOSÉ DA SILVA FILHO', role: 'professor' },
    { email: 'flaviacri@professor.educacao.sp.gov.br', nome: 'FLÁVIA CRISTINA APARECIDA BICHLER', role: 'professor' },
    { email: 'flaviacri@prof.educacao.sp.gov.br', nome: 'FLÁVIA CRISTINA APARECIDA BICHLER', role: 'professor' },
    { email: 'flaviofleury@professor.educacao.sp.gov.br', nome: 'FLÁVIO CARDOSO FLEURY', role: 'professor' },
    { email: 'flaviofleury@prof.educacao.sp.gov.br', nome: 'FLÁVIO CARDOSO FLEURY', role: 'professor' },
    { email: 'gabrielaserighelli@professor.educacao.sp.gov.br', nome: 'GABRIELA SERIGHELLI DE MELO', role: 'professor' },
    { email: 'gabrielaserighelli@prof.educacao.sp.gov.br', nome: 'GABRIELA SERIGHELLI DE MELO', role: 'professor' },
    { email: 'gelsonalmeida@professor.educacao.sp.gov.br', nome: 'GELSON DE ALMEIDA BATISTA', role: 'professor' },
    { email: 'gelsonalmeida@prof.educacao.sp.gov.br', nome: 'GELSON DE ALMEIDA BATISTA', role: 'professor' },
    { email: 'genilton@professor.educacao.sp.gov.br', nome: 'GENILTON DE OLIVEIRA SILVA', role: 'professor' },
    { email: 'genilton@prof.educacao.sp.gov.br', nome: 'GENILTON DE OLIVEIRA SILVA', role: 'professor' },
    { email: 'oshikawa@professor.educacao.sp.gov.br', nome: 'IVANILDE DOS SANTOS OSHIKAWA', role: 'professor' },
    { email: 'oshikawa@prof.educacao.sp.gov.br', nome: 'IVANILDE DOS SANTOS OSHIKAWA', role: 'professor' },
    { email: 'janinabraga@professor.educacao.sp.gov.br', nome: 'JANINA DOS PASSOS BRAGA DE ALMEIDA', role: 'professor' },
    { email: 'janinabraga@prof.educacao.sp.gov.br', nome: 'JANINA DOS PASSOS BRAGA DE ALMEIDA', role: 'professor' },
    { email: 'joseaparecidosilva@professor.educacao.sp.gov.br', nome: 'JOSÉ APARECIDO DA SILVA', role: 'professor' },
    { email: 'joseaparecidosilva@prof.educacao.sp.gov.br', nome: 'JOSÉ APARECIDO DA SILVA', role: 'professor' },
    { email: 'juarezgomes@professor.educacao.sp.gov.br', nome: 'JUAREZ GOMES DE MAGALHÃES FILHO', role: 'professor' },
    { email: 'juarezgomes@prof.educacao.sp.gov.br', nome: 'JUAREZ GOMES DE MAGALHÃES FILHO', role: 'professor' },
    { email: 'juremas@professor.educacao.sp.gov.br', nome: 'JUREMA SOLEDADE FURINI SANTOS', role: 'professor' },
    { email: 'juremas@prof.educacao.sp.gov.br', nome: 'JUREMA SOLEDADE FURINI SANTOS', role: 'professor' },
    { email: 'katiusciabomfim@professor.educacao.sp.gov.br', nome: 'KATIUSCIA ALVES BOMFIM', role: 'professor' },
    { email: 'katiusciabomfim@prof.educacao.sp.gov.br', nome: 'KATIUSCIA ALVES BOMFIM', role: 'professor' },
    { email: 'luanalima01@professor.educacao.sp.gov.br', nome: 'LUANA CAROLINE ALVES LIMA', role: 'professor' },
    { email: 'luanalima01@prof.educacao.sp.gov.br', nome: 'LUANA CAROLINE ALVES LIMA', role: 'professor' },
    { email: 'luanafreitas@professor.educacao.sp.gov.br', nome: 'LUANA DE FREITAS SILVA', role: 'professor' },
    { email: 'luanafreitas@prof.educacao.sp.gov.br', nome: 'LUANA DE FREITAS SILVA', role: 'professor' },
    { email: 'luanapaiva01@professor.educacao.sp.gov.br', nome: 'LUANA DE PAIVA', role: 'professor' },
    { email: 'luanapaiva01@prof.educacao.sp.gov.br', nome: 'LUANA DE PAIVA', role: 'professor' },
    { email: 'novaiscorreia@professor.educacao.sp.gov.br', nome: 'LUCIANA NOVAIS CORREIA SANTOS', role: 'professor' },
    { email: 'novaiscorreia@prof.educacao.sp.gov.br', nome: 'LUCIANA NOVAIS CORREIA SANTOS', role: 'professor' },
    { email: 'lucianomoreira@professor.educacao.sp.gov.br', nome: 'LUCIANO MOREIRA DE AZEVEDO', role: 'professor' },
    { email: 'lucianomoreira@prof.educacao.sp.gov.br', nome: 'LUCIANO MOREIRA DE AZEVEDO', role: 'professor' },
    { email: 'marcielsilva@professor.educacao.sp.gov.br', nome: 'MARCIEL DA SILVA', role: 'professor' },
    { email: 'marcielsilva@prof.educacao.sp.gov.br', nome: 'MARCIEL DA SILVA', role: 'professor' },
    { email: 'marcunha@professor.educacao.sp.gov.br', nome: 'MARIA HELENA CUNHA MORO', role: 'professor' },
    { email: 'marcunha@prof.educacao.sp.gov.br', nome: 'MARIA HELENA CUNHA MORO', role: 'professor' },
    { email: 'quiteriasantos@professor.educacao.sp.gov.br', nome: 'MARIA QUITÉRIA FERREIRA DOS SANTOS', role: 'professor' },
    { email: 'quiteriasantos@prof.educacao.sp.gov.br', nome: 'MARIA QUITÉRIA FERREIRA DOS SANTOS', role: 'professor' },
    { email: 'mariceliasilva@professor.educacao.sp.gov.br', nome: 'MARICELIA SILVA SANTOS PINA', role: 'professor' },
    { email: 'mariceliasilva@prof.educacao.sp.gov.br', nome: 'MARICELIA SILVA SANTOS PINA', role: 'professor' },
    { email: 'marinafrancisco@professor.educacao.sp.gov.br', nome: 'MARINA DA CONCEIÇÃO FRANCISCO SILVA', role: 'professor' },
    { email: 'marinafrancisco@prof.educacao.sp.gov.br', nome: 'MARINA DA CONCEIÇÃO FRANCISCO SILVA', role: 'professor' },
    { email: 'mauriciobsantos@professor.educacao.sp.gov.br', nome: 'MAURÍCIO DE BARROS SANTOS', role: 'professor' },
    { email: 'mauriciobsantos@prof.educacao.sp.gov.br', nome: 'MAURÍCIO DE BARROS SANTOS', role: 'professor' },
    { email: 'michelepinhio@professor.educacao.sp.gov.br', nome: 'MICHELE DE PINHO MORAES', role: 'professor' },
    { email: 'michelepinhio@prof.educacao.sp.gov.br', nome: 'MICHELE DE PINHO MORAES', role: 'professor' },
    { email: 'moisesbarros@professor.educacao.sp.gov.br', nome: 'MOISÉS ANTÔNIO DE BARROS', role: 'professor' },
    { email: 'moisesbarros@prof.educacao.sp.gov.br', nome: 'MOISÉS ANTÔNIO DE BARROS', role: 'professor' },
    { email: 'patriciag@professor.educacao.sp.gov.br', nome: 'PATRÍCIA GOMES ROCHA RIBEIRO', role: 'professor' },
    { email: 'patriciag@prof.educacao.sp.gov.br', nome: 'PATRÍCIA GOMES ROCHA RIBEIRO', role: 'professor' },
    { email: 'paulaarmani@professor.educacao.sp.gov.br', nome: 'PAULA ARMANI VILA', role: 'professor' },
    { email: 'paulaarmani@prof.educacao.sp.gov.br', nome: 'PAULA ARMANI VILA', role: 'professor' },
    { email: 'pauloito@professor.educacao.sp.gov.br', nome: 'PAULO ROBERTO DA SILVA ITO', role: 'professor' },
    { email: 'pauloito@prof.educacao.sp.gov.br', nome: 'PAULO ROBERTO DA SILVA ITO', role: 'professor' },
    { email: 'pedrozanotti@professor.educacao.sp.gov.br', nome: 'PEDRO ZANOTTI FILHO', role: 'professor' },
    { email: 'pedrozanotti@prof.educacao.sp.gov.br', nome: 'PEDRO ZANOTTI FILHO', role: 'professor' },
    { email: 'vilera@professor.educacao.sp.gov.br', nome: 'RAUL PEREIRA VILERA JUNIOR', role: 'professor' },
    { email: 'vilera@prof.educacao.sp.gov.br', nome: 'RAUL PEREIRA VILERA JUNIOR', role: 'professor' },
    { email: 'regianecurti@professor.educacao.sp.gov.br', nome: 'REGIANE CURTI DE SOUZA OLIVEIRA', role: 'professor' },
    { email: 'regianecurti@prof.educacao.sp.gov.br', nome: 'REGIANE CURTI DE SOUZA OLIVEIRA', role: 'professor' },
    { email: 'reginasilvacastro@professor.educacao.sp.gov.br', nome: 'REGINA DA SILVA CASTRO', role: 'professor' },
    { email: 'reginasilvacastro@prof.educacao.sp.gov.br', nome: 'REGINA DA SILVA CASTRO', role: 'professor' },
    { email: 'renatahypolito@professor.educacao.sp.gov.br', nome: 'RENATA MAGALHÃES HYPOLITO', role: 'professor' },
    { email: 'renatahypolito@prof.educacao.sp.gov.br', nome: 'RENATA MAGALHÃES HYPOLITO', role: 'professor' },
    { email: 'ricardoamerico@professor.educacao.sp.gov.br', nome: 'RICARDO AMÉRICO DA SILVA', role: 'professor' },
    { email: 'ricardoamerico@prof.educacao.sp.gov.br', nome: 'RICARDO AMÉRICO DA SILVA', role: 'professor' },
    { email: 'robertosalgado@professor.educacao.sp.gov.br', nome: 'ROBERTO SALGADO', role: 'professor' },
    { email: 'robertosalgado@prof.educacao.sp.gov.br', nome: 'ROBERTO SALGADO', role: 'professor' },
    { email: 'rodrigovieira1@professor.educacao.sp.gov.br', nome: 'RODRIGO VIEIRA', role: 'professor' },
    { email: 'rodrigovieira1@prof.educacao.sp.gov.br', nome: 'RODRIGO VIEIRA', role: 'professor' },
    { email: 'rosanamiranda@professor.educacao.sp.gov.br', nome: 'ROSANA APARECIDA MIRANDA', role: 'professor' },
    { email: 'rosanamiranda@prof.educacao.sp.gov.br', nome: 'ROSANA APARECIDA MIRANDA', role: 'professor' },
    { email: 'roseliaraujo01@professor.educacao.sp.gov.br', nome: 'ROSELI LUIZ ARAÚJO', role: 'professor' },
    { email: 'roseliaraujo01@prof.educacao.sp.gov.br', nome: 'ROSELI LUIZ ARAÚJO', role: 'professor' },
    { email: 'rosimerypessoa@professor.educacao.sp.gov.br', nome: 'ROSIMERY DE SOUZA PESSOA', role: 'professor' },
    { email: 'rosimerypessoa@prof.educacao.sp.gov.br', nome: 'ROSIMERY DE SOUZA PESSOA', role: 'professor' },
    { email: 'rosmaracardoso@professor.educacao.sp.gov.br', nome: 'ROSMARA DA SILVA CARDOSO', role: 'professor' },
    { email: 'rosmaracardoso@prof.educacao.sp.gov.br', nome: 'ROSMARA DA SILVA CARDOSO', role: 'professor' },
    { email: 'sandracristinamacedo@professor.educacao.sp.gov.br', nome: 'SANDRA CRISTINA MACEDO MORAES', role: 'professor' },
    { email: 'sandracristinamacedo@prof.educacao.sp.gov.br', nome: 'SANDRA CRISTINA MACEDO MORAES', role: 'professor' },
    { email: 'sergioagripino@professor.educacao.sp.gov.br', nome: 'SÉRGIO AGRIPINO VILLA NOVA', role: 'professor' },
    { email: 'sergioagripino@prof.educacao.sp.gov.br', nome: 'SÉRGIO AGRIPINO VILLA NOVA', role: 'professor' },
    { email: 'silvasimone@professor.educacao.sp.gov.br', nome: 'SIMONE DA SILVA', role: 'professor' },
    { email: 'silvasimone@prof.educacao.sp.gov.br', nome: 'SIMONE DA SILVA', role: 'professor' },
    { email: 'almeidafazio@professor.educacao.sp.gov.br', nome: 'SOLANGE ALMEIDA DA SILVA', role: 'professor' },
    { email: 'almeidafazio@prof.educacao.sp.gov.br', nome: 'SOLANGE ALMEIDA DA SILVA', role: 'professor' },
    { email: 'suzineidefreitas@professor.educacao.sp.gov.br', nome: 'SUZINEIDE SILVA DE FREITAS', role: 'professor' },
    { email: 'suzineidefreitas@prof.educacao.sp.gov.br', nome: 'SUZINEIDE SILVA DE FREITAS', role: 'professor' },
    { email: 'titto@professor.educacao.sp.gov.br', nome: 'TITTO AUGUSTO NASCIMENTO SILVA', role: 'professor' },
    { email: 'titto@prof.educacao.sp.gov.br', nome: 'TITTO AUGUSTO NASCIMENTO SILVA', role: 'professor' },
    { email: 'vanessaivete@professor.educacao.sp.gov.br', nome: 'VANESSA IVETE GOMES DOS SANTOS', role: 'professor' },
    { email: 'vanessaivete@prof.educacao.sp.gov.br', nome: 'VANESSA IVETE GOMES DOS SANTOS', role: 'professor' },
    { email: 'vaniapenha@professor.educacao.sp.gov.br', nome: 'VANIA PENHA DE BARROS', role: 'professor' },
    { email: 'vaniapenha@prof.educacao.sp.gov.br', nome: 'VANIA PENHA DE BARROS', role: 'professor' },
    { email: 'camera@professor.educacao.sp.gov.br', nome: 'VIVIANE LEAL CÂMERA DE MORAES', role: 'professor' },
    { email: 'camera@prof.educacao.sp.gov.br', nome: 'VIVIANE LEAL CÂMERA DE MORAES', role: 'professor' },
    { email: 'wmota@professor.educacao.sp.gov.br', nome: 'WILSON RODRIGUES MOTA', role: 'professor' },
    { email: 'wmota@prof.educacao.sp.gov.br', nome: 'WILSON RODRIGUES MOTA', role: 'professor' },
];

/**
 * Normaliza o e-mail institucional para o formato base para comparação
 */
const normalizeInstitutionalEmail = (email: string): string => {
    const [user, domain] = email.toLowerCase().trim().split('@');
    if (domain === 'prof.educacao.sp.gov.br' || domain === 'professor.educacao.sp.gov.br') {
        return `${user}@prof.educacao.sp.gov.br`;
    }
    return email.toLowerCase().trim();
};

/**
 * Verifica se o e-mail está registrado no sistema
 * IMPORTANTE: Apenas e-mails cadastrados em PROFESSORS_DB podem acessar a plataforma
 * Agora aceita automaticamente ambas as variantes (@prof e @professor)
 */
export const isProfessorRegistered = (email: string): boolean => {
    const normalizedTarget = normalizeInstitutionalEmail(email);
    return PROFESSORS_DB.some(p => normalizeInstitutionalEmail(p.email) === normalizedTarget);
};

/**
 * Extrai o nome do professor a partir do e-mail
 * Se não encontrar no banco, tenta extrair do próprio e-mail
 */
export const getProfessorNameFromEmail = (email: string): string => {
    const normalizedTarget = normalizeInstitutionalEmail(email);

    // Busca no banco de dados de professores usando e-mail normalizado
    const professor = PROFESSORS_DB.find(p => normalizeInstitutionalEmail(p.email) === normalizedTarget);

    if (professor) {
        return professor.nome;
    }

    // Se não encontrar, tenta extrair do e-mail
    // Exemplo: maria.silva@escola.com.br -> MARIA SILVA
    const emailUsername = email.split('@')[0];
    const nameParts = emailUsername.split(/[._-]/);
    const formattedName = nameParts
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');

    return formattedName.toUpperCase();
};

/**
 * Retorna o papel (role) do professor a partir do e-mail
 */
export const getProfessorRoleFromEmail = (email: string): 'gestor' | 'professor' | null => {
    const normalizedTarget = normalizeInstitutionalEmail(email);
    const professor = PROFESSORS_DB.find(p => normalizeInstitutionalEmail(p.email) === normalizedTarget);
    return professor?.role || null;
};
