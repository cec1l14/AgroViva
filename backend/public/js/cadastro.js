// ========================
// Mostrar/ocultar senha
// ========================
function mostrarSenha() {
    const inputPass = document.getElementById('senha');
    const btnShowPass = document.getElementById('btn-senha');

    if (inputPass.type === 'password') {
        inputPass.type = 'text';
        btnShowPass.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
    } else {
        inputPass.type = 'password';
        btnShowPass.classList.replace('bi-eye-slash-fill', 'bi-eye-fill');
    }
}
document.getElementById('btn-senha').addEventListener('click', mostrarSenha);

// ========================
// Elementos
// ========================
const inputCpfCnpj = document.getElementById('cpf');
const checkboxProdutor = document.getElementById('Produtor');
const checkboxEmpresario = document.getElementById('Empresario');
const form = document.querySelector('form');

// ========================
// Funções auxiliares de erro
// ========================

// Cria (ou atualiza) uma mensagem de erro logo abaixo do campo
function mostrarErro(input, mensagem) {
    let erro = input.parentElement.querySelector('.erro-msg');
    if (!erro) {
        erro = document.createElement('div');
        erro.classList.add('erro-msg');
        input.parentElement.appendChild(erro);
    }
    erro.textContent = mensagem;
    input.classList.add('erro'); // 🔹 adiciona destaque visual no campo
}

function removerErro(input) {
    const erro = input.parentElement.querySelector('.erro-msg');
    if (erro) erro.remove();
    input.classList.remove('erro'); // 🔹 remove destaque quando corrigido
}
// Remove erro automaticamente quando o usuário digita
['nome', 'email', 'telefone', 'cpf', 'senha'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => removerErro(input));
});

// Alternar placeholder entre CPF e CNPJ
function alternarCpfCnpj() {
    if (checkboxProdutor.checked) {
        inputCpfCnpj.placeholder = 'CPF';
    } else if (checkboxEmpresario.checked) {
        inputCpfCnpj.placeholder = 'CNPJ';
    } else {
        inputCpfCnpj.placeholder = '';
    }
}

// Apenas um checkbox marcado
checkboxProdutor.addEventListener('change', () => {
    if (checkboxProdutor.checked) checkboxEmpresario.checked = false;
    alternarCpfCnpj();
});
checkboxEmpresario.addEventListener('change', () => {
    if (checkboxEmpresario.checked) checkboxProdutor.checked = false;
    alternarCpfCnpj();
});

// ========================
// Submit do formulário
// ========================
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Capturar valores
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const cpfCnpj = inputCpfCnpj.value.trim();

    // Identificar tipo de usuário
    const tipo = checkboxProdutor.checked ? 'PRODUTOR' : checkboxEmpresario.checked ? 'EMPRESARIO' : null;

    // ========================
    // Validação no front-end
    // ========================
    let valido = true;

    // Nome
    if (!nome) {
        mostrarErro(document.getElementById('nome'), 'Nome é obrigatório.');
        valido = false;
    } else if (nome.length < 3) {
        mostrarErro(document.getElementById('nome'), 'Nome deve ter pelo menos 3 caracteres.');
        valido = false;
    }

    // Email
    if (!email) {
        mostrarErro(document.getElementById('email'), 'Email é obrigatório.');
        valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarErro(document.getElementById('email'), 'Email inválido.');
        valido = false;
    }

    // Senha
    if (!senha) {
        mostrarErro(document.getElementById('senha'), 'Senha é obrigatória.');
        valido = false;
    } else if (senha.length < 6) {
        mostrarErro(document.getElementById('senha'), 'A senha deve ter pelo menos 6 caracteres.');
        valido = false;
    }

    // Telefone (opcional, mas se preencher, deve ter 8+ dígitos)
    if (telefone && telefone.length < 8) {
        mostrarErro(document.getElementById('telefone'), 'Telefone inválido.');
        valido = false;
    }

    // CPF ou CNPJ
    if (!cpfCnpj) {
        mostrarErro(document.getElementById('cpf'), 'Campo obrigatório.');
        valido = false;
    } else if (checkboxProdutor.checked && cpfCnpj.length < 11) {
        mostrarErro(document.getElementById('cpf'), 'CPF inválido.');
        valido = false;
    } else if (checkboxEmpresario.checked && cpfCnpj.length < 14) {
        mostrarErro(document.getElementById('cpf'), 'CNPJ inválido.');
        valido = false;
    }

    // Tipo de usuário
    if (!tipo) {
        alert('Selecione Produtor ou Empresário.');
        valido = false;
    }

    if (!valido) return; // se tiver erro, não envia

    // ========================
    // Envio para o backend
    // ========================
    const data = { nome, email, telefone, senha };
    let url = '';
    let redirectUrl = '';

    if (tipo === 'PRODUTOR') {
        data.cpf = cpfCnpj;
        url = '/api/produtor';
        redirectUrl = '/produtor.html';
    } else {
        data.cnpj = cpfCnpj;
        url = '/api/empresario';
        redirectUrl = '/empresario.html';
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Usuário cadastrado com sucesso!');
            form.reset();
            window.location.href =
                tipo === 'PRODUTOR'
                    ? `${redirectUrl}?id=${result.produtor.id}`
                    : `${redirectUrl}?id=${result.empresario.id}`;
        } else {
            // Mostrar erros vindos do backend (Zod)
            if (result.errors && Array.isArray(result.errors)) {
                result.errors.forEach(e => {
                    const campo = document.getElementById(e.field);
                    if (campo) mostrarErro(campo, e.message);
                });
            } else {
                alert('Erro: ' + (result.error || 'Erro desconhecido'));
            }
        }

    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao se comunicar com o servidor.');
    }
});
