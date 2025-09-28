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

        const data = await response.json();

        if (response.ok && data.usuario && data.token) {
            localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
            localStorage.setItem('token', data.token); // salvar JWT
            window.location.href = 'home.html';
        } else {
            alert('Erro: ' + (data.error || 'Falha no login.'));
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao se comunicar com o servidor.');
    }
});