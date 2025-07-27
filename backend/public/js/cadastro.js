function mostrarSenha(){
    var inputPass = document.getElementById('senha');
    var btnShowPass = document.getElementById ('btn-senha');

    if (inputPass.type === 'password'){
        inputPass.setAttribute('type', 'text');
        btnShowPass.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
    }else{
        inputPass.setAttribute('type', 'password')
        btnShowPass.classList.replace('bi-eye-slash-fill', 'bi-eye-fill');
    }
};
document.getElementById('btn-senha').addEventListener('click', mostrarSenha);

const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); 

  
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const data = {nome, email, telefone, senha, cpf };

  try {
    const response = await fetch('/api/produtor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (response.ok) {
      alert('Usuário cadastrado com sucesso!');
      form.reset();
    } else {
      alert('Erro: ' + resData.error);
    }

  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Erro ao se comunicar com o servidor.');
  }
});
