// Função para mostrar/esconder a senha
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

// Referência ao formulário de login
const form = document.getElementById('formLogin');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!email || !senha) {
        alert('Preencha todos os campos!');
        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        let data;
        try {
            data = await response.json();
        } catch {
            data = {};
        }

        // 🔹 Alteração importante: acessar data.usuario (como retorna o backend)
        if (response.ok && data.usuario) {
            // Salvar usuário logado no localStorage
            localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
            // Redirecionar para home.html
            window.location.href = 'home.html';
        } else {
            alert('Erro: ' + (data.error || 'Falha no login.'));
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao se comunicar com o servidor.');
    }
});
