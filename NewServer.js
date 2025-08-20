const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;

const alunos = [
    {
   "id": 1, 
  "nome": "Maria Silva", 
  "cpf": "12345678901", 
  "cep": "01234567", 
  "uf": "SP", 
  "rua": "Av. Central", 
  "numero": 123, 
  "complemento": "Apto 12" 
    }
]

app.get('/alunos', (req, res) => {
    res.json(alunos);
});

function validarCEP(cep) {
    return /^\d{8}$/.test(cep);
};

function validarCPF(cpf)
{
    return /^\d{11}$/.test(cpf);
}
function validarEndereco(rua, numero) {
    return rua && numero && typeof rua === 'string' && typeof numero === 'number';
}
app.post('/alunos', (req, res) => {
    const {nome, cpf, cep, uf, rua, numero} = req.body;

    if (!nome || !cpf || !cep || !uf || !rua || !numero) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    if (!validarCPF(cpf)) {
        return res.status(400).json({ error: 'CPF inválido.' });
    }
    if (!validarCEP(cep)) {
        return res.status(400).json({ error: 'CEP inválido.' });
    }
    if (alunos.some(a => a.cpf === cpf)) {
        return res.status(409).json({ error: 'CPF duplicado.' });
    }
    if (!validarEndereco(rua, numero)) {
        return res.status(400).json({ error: 'Endereço inválido.' });
    }
    const novoAluno = {
        id: alunos.length + 1,
        nome,
        cpf,
        cep,
        uf,
        rua,
        numero,
        complemento: req.body.complemento || ''
    };
    alunos.push(novoAluno);
    res.status(201).json({
        message: 'Aluno cadastrado com sucesso.',
        aluno: novoAluno
    });
});

app.put('/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const {nome, cpf, cep, uf, rua, numero} = req.body;
    const alunoIndex = alunos.findIndex(a => a.id === id);
    if (alunoIndex === -1) {
        return res.status(404).json({ error: 'Aluno não encontrado.' });
    }
    if (!nome || !cpf || !cep || !uf || !rua || !numero) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    if (!validarCPF(cpf)) {
        return res.status(400).json({ error: 'CPF inválido.' });
    }
    if (!validarCEP(cep)) {
        return res.status(400).json({ error: 'CEP inválido.' });
    }
    if (alunos.some(a => a.cpf === cpf)) {
        return res.status(409).json({ error: 'CPF duplicado.' });
    }
    if (!validarEndereco(rua, numero)) {
        return res.status(400).json({ error: 'Endereço inválido.' });
    }
    alunos[alunoIndex] = {
        id,
        nome,
        cpf,
        cep,
        uf,
        rua,
        numero,
        complemento: req.body.complemento || ''
    };
    res.json({
        message: 'Aluno atualizado com sucesso.',
        aluno: alunos[alunoIndex]
    });
});

app.get('/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const aluno = alunos.find(a => a.id === id);
    if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado.' });
    }
    res.json(aluno);
});

app.get("/", (req, res) => {
    res.json("Bem-vindo à API de Alunos!");
});
app.delete('/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const alunoIndex = alunos.findIndex(a => a.id === id);
    if (alunoIndex === -1) {
        return res.status(404).json({ error: 'Aluno não encontrado.' });
    }
    alunos.splice(alunoIndex, 1);
    res.json({ message: 'Aluno removido com sucesso.' });
});
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

