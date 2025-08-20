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

const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const cpf = document.getElementById('cpf').value.trim();

    // Tipo de usuário
    const tipo = document.getElementById('Produtor').checked
        ? 'PRODUTOR'
        : document.getElementById('Empresario').checked
            ? 'EMPRESARIO'
            : null;

    if (!tipo) {
        alert('Selecione Produtor ou Empresário.');
        return;
    }

    const data = { nome, email, telefone, senha, cpf, tipo };

    try {
        const response = await fetch('/api/produtor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const novoProdutor = await response.json();

        if (response.ok) {
            alert('Usuário cadastrado com sucesso!');
            form.reset();

            // Redireciona automaticamente para página do produtor com o ID gerado
            if (tipo === 'PRODUTOR') {
                window.location.href = `/produtor.html?id=${novoProdutor.cod_produtor}`;
            } else {
                window.location.href = '/produtos.html'; // Página para empresários
            }

        } else {
            alert('Erro: ' + novoProdutor.error);
        }

    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao se comunicar com o servidor.');
    }
});
