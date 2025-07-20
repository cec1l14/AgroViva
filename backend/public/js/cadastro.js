function mostrarSenhaa(){
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

const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); 

  // Pega os valores dos inputs pelo id
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();


  const data = { nome, email, senha };

  console.log('Dados enviados:', data);

  try {
    const response = await fetch('/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (response.ok) {
      alert(resData.message);
      form.reset(); // limpa form
    } else {
      alert('Erro: ' + resData.error);
    }

  } catch (error) {
    console.error('Erro na requisição:', error);
  }
});
