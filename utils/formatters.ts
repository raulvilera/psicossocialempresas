/**
 * Normaliza o nome da turma vindo de diferentes fontes (Supabase, Sheets, Local)
 * Padroniza para "6ºAno A" ou "1ª Série A"
 */
export const normalizeClassName = (raw: string): string => {
    if (!raw || raw === '---') return '---';

    // Limpeza inicial e remoção de termos de desconsideração
    let s = raw.toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[º°ª]/g, "")           // Remove ordinais
        .replace(/\(DESCONSIDER.*\)/g, "") // Remove (desconsidera), (desconsidere), etc.
        .replace(/\s+/g, " ")            // Remove espaços duplos
        .trim();

    // Correções de typos específicos e normalização de espaços
    // Garante que "3SEIE" ou "3 SEIE" virem "3 SERIE"
    s = s.replace(/3\s*SEIE/g, "3 SERIE")
        .replace(/2\s*SEROIE/g, "2 SERIE")
        .replace(/1\s*SR/g, "1 SERIE")
        .replace(/SERIE/g, " SERIE ")
        .replace(/ANO/g, " ANO ")
        .replace(/\s+/g, " ")
        .trim();

    // Regex robusta: captura número, tipo e letra
    const match = s.match(/^(\d+)\s*(ANO|SERIE|EM)?\s*([A-H])?$/);

    if (match) {
        const num = match[1];
        let type = match[2] || (parseInt(num) <= 3 ? 'SERIE' : 'ANO');
        if (type === 'EM') type = 'SERIE';
        const letter = match[3] || '';

        // Regra: 1-3 SERIE -> Xª Série Y
        if (num === '1' || num === '2' || num === '3') {
            return `${num}ª Série ${letter}`.trim();
        }
        // Regra: 6-9 ANO -> XºAno Y
        return `${num}ºAno ${letter}`.trim();
    }

    // Fallback: Retorna o original limpo
    return raw.trim();
};
