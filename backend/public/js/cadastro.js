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
const form = document.querySelector('form');

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
    // Validação básica no front-end
    // ========================
    if (!nome || !email || !senha || !cpfCnpj) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    if (!tipo) {
        alert('Selecione Produtor ou Empresário.');
        return;
    }

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

            // Redirecionamento usando ID correto retornado do backend
            if (tipo === 'PRODUTOR') {
                window.location.href = `${redirectUrl}?id=${result.produtor.id}`;
            } else {
                window.location.href = `${redirectUrl}?id=${result.empresario.id}`;
            }

        } else {
            // Mostrar erros retornados do backend
            if (result.errors && Array.isArray(result.errors)) {
                alert(result.errors.map(e => e.message).join('\n'));
            } else {
                alert('Erro: ' + (result.error || 'Erro desconhecido'));
            }
        }

    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao se comunicar com o servidor.');
    }
});