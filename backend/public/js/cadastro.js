// Mostrar/ocultar senha
function mostrarSenha() {
    const inputPass = document.getElementById('senha');
    const btnShowPass = document.getElementById('btn-senha');

    if (inputPass.type === 'password') {
        inputPass.setAttribute('type', 'text');
        btnShowPass.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
    } else {
        inputPass.setAttribute('type', 'password');
        btnShowPass.classList.replace('bi-eye-slash-fill', 'bi-eye-fill');
    }
}
document.getElementById('btn-senha').addEventListener('click', mostrarSenha);

// Elementos
const inputCpfCnpj = document.getElementById('cpf');
const checkboxProdutor = document.getElementById('Produtor');
const checkboxEmpresario = document.getElementById('Empresario');

// Função para alternar placeholder entre CPF e CNPJ
function alternarCpfCnpj() {
    if (checkboxProdutor.checked) {
        inputCpfCnpj.placeholder = 'CPF';
    } else if (checkboxEmpresario.checked) {
        inputCpfCnpj.placeholder = 'CNPJ';
    } else {
        inputCpfCnpj.placeholder = '';
    }
}

// Garante que apenas um checkbox esteja marcado e atualiza placeholder
checkboxProdutor.addEventListener('change', () => {
    if (checkboxProdutor.checked) checkboxEmpresario.checked = false;
    alternarCpfCnpj();
});

checkboxEmpresario.addEventListener('change', () => {
    if (checkboxEmpresario.checked) checkboxProdutor.checked = false;
    alternarCpfCnpj();
});

// Submit do formulário
const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const cpfCnpj = inputCpfCnpj.value.trim();

    // Identificar o tipo de usuário
    const tipo = checkboxProdutor.checked ? 'PRODUTOR' : checkboxEmpresario.checked ? 'EMPRESARIO' : null;

    if (!tipo) {
        alert('Selecione Produtor ou Empresário.');
        return;
    }

    const data = { nome, email, telefone, senha };
    let url = '';

    if (tipo === 'PRODUTOR') {
        data.cpf = cpfCnpj; // Para produtores
        url = '/api/produtor';
    } else {
        data.cnpj = cpfCnpj; // Para empresários
        url = '/api/empresario';
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

            // Redirecionamento
            if (tipo === 'PRODUTOR') {
                window.location.href = `/produtor.html?id=${result.novoProdutor.cod_produtor}`;
            } else {
                window.location.href = `/empresario.html?id=${result.novoEmpresario.cod_empresario}`;
            }

        } else {
            alert('Erro: ' + result.error);
        }

    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao se comunicar com o servidor.');
    }
});
