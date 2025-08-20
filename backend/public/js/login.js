function mostrarSenha(){
    var inputPass = document.getElementById('senha');
    var btnShowPass = document.getElementById('btn-senha');

    if (inputPass.type === 'password'){
        inputPass.setAttribute('type', 'text');
        btnShowPass.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
    } else {
        inputPass.setAttribute('type', 'password');
        btnShowPass.classList.replace('bi-eye-slash-fill', 'bi-eye-fill');
    }
}

const form = document.getElementById('formLogin');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // evita recarregar a página

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            // login válido
            alert('Login realizado com sucesso!');
            window.location.href = 'home.html'; // ou outra página específica
        } else {
            // login inválido
            alert('Erro: ' + data.error);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao se comunicar com o servidor.');
    }
});
