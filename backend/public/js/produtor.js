const container = document.getElementById("produtos-container");
const nomeProdutor = document.getElementById("nome-produtor");
const emailProdutor = document.getElementById("email-produtor");
const telefoneProdutor = document.getElementById("telefone-produtor");
const cpfProdutor = document.getElementById("cpf-produtor");

// Pega o ID do produtor da URL
const urlParams = new URLSearchParams(window.location.search);
const produtorId = urlParams.get("id");

async function carregarProdutor() {
  try {
    const response = await fetch(`/api/produtor/${produtorId}`);
    if (!response.ok) throw new Error("Erro ao buscar dados do produtor");

    const produtor = await response.json();
    nomeProdutor.textContent = produtor.nome;
    emailProdutor.textContent = `Email: ${produtor.email}`;
    telefoneProdutor.textContent = `Telefone: ${produtor.telefone}`;
    cpfProdutor.textContent = `CPF: ${produtor.cpf}`;
  } catch (error) {
    console.error(error);
    nomeProdutor.textContent = "Produtor não encontrado";
  }
}

async function carregarProdutos() {
  try {
    const response = await fetch(`/api/produtos?cod_produtor=${produtorId}`);
    if (!response.ok) throw new Error("Erro ao buscar produtos");

    const produtos = await response.json();
    container.innerHTML = '';

    produtos.forEach(produto => {
      const cardProd = `
        <div class="card">
          <h6 class="produto-disponivel">Produto disponível</h6> 
          <img src="${produto.imagem || 'https://via.placeholder.com/150'}" class="card-img" alt="${produto.descricao}">
          <div class="card-body">
            <h5 class="card-title">${produto.descricao}</h5>
            <p class="card-title">${produto.tipo || 'Sem tipo'}</p>
          </div>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", cardProd);
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Erro ao carregar produtos.</p>";
  }
}

// Carrega dados do produtor e produtos
carregarProdutor();
carregarProdutos();
