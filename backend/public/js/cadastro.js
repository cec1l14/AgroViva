// Pega o formulário
const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); // evita reload da página

  // Pega os valores dos inputs pelo id
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  // Monta o objeto para enviar
  const data = { nome, email, senha };

  console.log('Dados enviados:', data); // <-- aqui o console.log

  try {
    const response = await fetch('/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (response.ok) {
      alert(resData.message); // cadastro OK
      form.reset(); // limpa form
    } else {
      alert('Erro: ' + resData.error);
    }

  } catch (error) {
    console.error('Erro na requisição:', error);
  }
});
