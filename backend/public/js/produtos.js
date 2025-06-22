const container = document.getElementById("produtos-container");
const botoesFiltro = document.querySelectorAll('.filtro');

let produtos = []; 

function renderizarProdutos(lista) {
  container.innerHTML = ''; // Limpa o conteúdo antes de renderizar

  lista.forEach(produto => {
    const cardProd = `
      <div class="card" id="produto-${produto.nome.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}">
        <h6 class="produto-disponivel">Produto disponível</h6> 
        <img src="${produto.imagem}" class="card-img" alt="${produto.nome}">
        <div class="card-body">
          <span class="fa-solid fa-trash delete-icon"></span>
          <h5 class="card-title">${produto.nome}</h5>
          <i class="bx bxs-user"></i>
          <p class="card-title">${produto.tipo}</p>
        </div>
      </div>
    `;
    
    container.insertAdjacentHTML("beforeend", cardProd);
  });
}

function filtrarProdutos(tipo) {
  if (tipo === "Todos") {
    renderizarProdutos(produtos);
  } else {
    const filtrados = produtos.filter(produto => produto.tipo === tipo);
    renderizarProdutos(filtrados);
  }
}

async function carregarProdutos() {
  try {
    const response = await fetch('/api/produtos'); 
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    produtos = await response.json();
    renderizarProdutos(produtos); 
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
}

function configurarFiltros() {
  botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
      const tipo = botao.dataset.tipo;
      filtrarProdutos(tipo);
    });
  });
}

// Delegação de evento para deletar produto
container.addEventListener('click', function (event) {
  if (event.target.classList.contains('delete-icon')) {
    const card = event.target.closest('.card');
    if (card) card.remove();
  }
});

carregarProdutos();
configurarFiltros();
