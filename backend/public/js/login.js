const form = document.getElementById('formLogin');

// Verifica se já há um usuário logado
const usuarioExistente = localStorage.getItem('usuarioLogado');
if (usuarioExistente) {
    window.location.href = 'home.html';
}

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

        const data = await response.json();

        if (response.ok && data.usuario && data.token && data.tipo) {
            // Salva usuário, tipo e token no localStorage
            localStorage.setItem(
                'usuarioLogado',
                JSON.stringify({ ...data.usuario, tipo: data.tipo })
            );
            localStorage.setItem('token', data.token);

            // Redireciona para home
            window.location.href = 'home.html';
        } else {
            alert('Erro: ' + (data.error || 'Falha no login.'));
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao se comunicar com o servidor.');
    }
});
