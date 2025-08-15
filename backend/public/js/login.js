function mostrarSenha(){
    var inputPass = document.getElementById('senha')
    var btnShowPass = document.getElementById ('btn-senha')

    if (inputPass.type === 'password'){
        inputPass.setAttribute('type', 'text')
        btnShowPass.classList.replace('bi-eye-fill', 'bi-eye-slash-fill')
    }else{
        inputPass.setAttribute('type', 'password')
        btnShowPass.classList.replace('bi-eye-slash-fill', 'bi-eye-fill')
    }
}

const form = document.getElementById('formLogin');

form.addEventListener('submit', (event) => {
    event.preventDefault(); // evita recarregar a página

    // Redireciona direto para home.html
    window.location.href = 'home.html';
});
