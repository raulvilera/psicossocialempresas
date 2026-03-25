import React, { useState, useEffect } from 'react';
import { fetchTurmas, fetchAlunosByTurma, saveOcorrencia } from '../services/sheetsService';
import type { Aluno, Ocorrencia } from '../services/sheetsService';


interface ProfessorViewProps {
    userEmail: string;
    onLogout: () => void;
}

const ProfessorView: React.FC<ProfessorViewProps> = ({ userEmail, onLogout }) => {
    const [turmas, setTurmas] = useState<string[]>([]);
    const [selectedTurma, setSelectedTurma] = useState('');
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
    const [irregularidades, setIrregularidades] = useState<string[]>([]);
    const [descricao, setDescricao] = useState('');
    const [disciplina, setDisciplina] = useState('');
    const [loading, setLoading] = useState(false);

    const tagsIrregularidades = [
        "ATRASO", "SEM MATERIAL", "USO DE CELULAR", "CONVERSA",
        "DESRESPEITO", "INDISCIPLINA", "DESACATO", "SEM TAREFA", "SAIU SEM PERMISSÃO"
    ];

    useEffect(() => {
        const loadTurmas = async () => {
            const data = await fetchTurmas();
            setTurmas(data);
        };
        loadTurmas();
    }, []);

    useEffect(() => {
        if (selectedTurma) {
            const loadAlunos = async () => {
                setLoading(true);
                const data = await fetchAlunosByTurma(selectedTurma);
                setAlunos(data);
                setLoading(false);
            };
            loadAlunos();
        } else {
            setAlunos([]);
        }
        setSelectedAluno(null);
    }, [selectedTurma]);

    const toggleIrregularidade = (tag: string) => {
        setIrregularidades(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSave = async () => {
        if (!selectedAluno || !selectedTurma || irregularidades.length === 0) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const novaOcorrencia: Ocorrencia = {
            data: new Date().toLocaleDateString('pt-BR'),
            professor: userEmail.split('@')[0].replace('.', ' ').toUpperCase(),
            turma: selectedTurma,
            aluno: selectedAluno.nome,
            ra: selectedAluno.ra,
            disciplina: disciplina || "N/A",
            irregularidades: irregularidades,
            descricao: descricao,
            horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };

        const success = await saveOcorrencia(novaOcorrencia);
        if (success) {
            alert("Ocorrência registrada com sucesso!");
            // Limpar campos
            setIrregularidades([]);
            setDescricao('');
            setSelectedAluno(null);
        }
    };

    return (
        <div className="app-container">
            <header className="professor-header">
                <div className="header-info">
                    <h2>ÁREA DO PROFESSOR 2026</h2>
                    <p>EE FIORAVANTE IERVOLINO</p>
                </div>
                <div className="user-profile">
                    <span className="user-email">{userEmail}</span>
                    <button className="btn-sync">Sincronizar Alunos</button>
                    <button className="btn-exit" onClick={onLogout}>Sair</button>
                </div>
            </header>

            <main className="main-content">
                <div className="registration-card">
                    <div className="card-header">Lançamento de Registros Disciplinares</div>
                    <div className="card-body">
                        <div className="form-section">
                            <div className="input-group">
                                <label className="input-label">Professor Responsável</label>
                                <input type="text" className="text-input" value={userEmail.split('@')[0].toUpperCase()} disabled />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Selecione os Alunos</label>
                                <div className="aluno-selection-area">
                                    {loading ? (
                                        <p>Carregando alunos...</p>
                                    ) : selectedTurma ? (
                                        <div className="alunos-grid" style={{ width: '100%', padding: '1rem', overflowY: 'auto', height: '100%' }}>
                                            {alunos.map(aluno => (
                                                <div
                                                    key={aluno.ra}
                                                    className={`aluno-card ${selectedAluno?.ra === aluno.ra ? 'selected' : ''}`}
                                                    style={{
                                                        padding: '0.75rem',
                                                        marginBottom: '0.5rem',
                                                        background: selectedAluno?.ra === aluno.ra ? '#4facfe' : 'rgba(255,255,255,0.05)',
                                                        borderRadius: '0.5rem',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => setSelectedAluno(aluno)}
                                                >
                                                    <small style={{ opacity: 0.7 }}>{aluno.ra}</small>
                                                    <p style={{ fontWeight: 700 }}>{aluno.nome}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>Selecione uma turma para carregar os alunos</p>
                                    )}
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Irregularidades</label>
                                <div className="irregularidades-grid">
                                    {tagsIrregularidades.map(tag => (
                                        <button
                                            key={tag}
                                            className={`tag-btn ${irregularidades.includes(tag) ? 'active' : ''}`}
                                            onClick={() => toggleIrregularidade(tag)}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="side-section">
                            <div className="input-group">
                                <label className="input-label">Turma / Série</label>
                                <select
                                    className="select-field"
                                    value={selectedTurma}
                                    onChange={(e) => setSelectedTurma(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    {turmas.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Disciplina</label>
                                <input
                                    type="text"
                                    className="text-input"
                                    placeholder="Ex: Matemática"
                                    value={disciplina}
                                    onChange={(e) => setDisciplina(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Descrição Adicional</label>
                                <textarea
                                    className="text-input"
                                    rows={4}
                                    style={{ resize: 'none' }}
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                ></textarea>
                            </div>

                            <button className="btn-login" onClick={handleSave} style={{ marginTop: '1rem' }}>
                                Registrar Ocorrência
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfessorView;
