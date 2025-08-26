const container = document.getElementById("produtos-container");
const botoesFiltro = document.querySelectorAll('.filtro');

let produtos = []; // Lista de produtos

// Função para renderizar produtos na tela
function renderizarProdutos(lista) {
  container.innerHTML = ''; // Limpa o container

  lista.forEach(produto => {
    if (!produto || !produto.descricao) {
      console.warn("Produto inválido:", produto);
      return;
    }

    const cardProd = `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm" id="produto-${produto.cod_produto}">
          <img src="${produto.imagem || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${produto.descricao}">
          <div class="card-body">
            <h5 class="card-title">${produto.descricao}</h5>
            <p class="card-text">Tipo: ${produto.tipo || 'Sem tipo'}</p>
            <p class="card-text">Preço: R$ ${produto.preco.toFixed(2)}</p>
            <p class="card-text">Validade: ${produto.validade}</p>
            <i class="bx bxs-user perfil-icon" data-produtor="${produto.cod_produtor}" title="Ver perfil do produtor"></i>
          </div>
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", cardProd);
  });
}

// Filtrar produtos por tipo
function filtrarProdutos(tipo) {
  if (tipo === "Todos") {
    renderizarProdutos(produtos);
  } else {
    const filtrados = produtos.filter(produto => produto.tipo === tipo);
    renderizarProdutos(filtrados);
  }
}

// Carregar produtos da API
async function carregarProdutos() {
  try {
    const response = await fetch('/api/produtos');
    if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
    produtos = await response.json();
    renderizarProdutos(produtos);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    container.innerHTML = '<p>Erro ao carregar produtos.</p>';
  }
}

// Configurar filtros
function configurarFiltros() {
  botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
      const tipo = botao.dataset.tipo;
      filtrarProdutos(tipo);
    });
  });
}

// Clique no ícone do produtor
container.addEventListener('click', function (event) {
  if (event.target.classList.contains('perfil-icon')) {
    const produtorId = event.target.dataset.produtor;
    window.location.href = `produtor.html?id=${produtorId}`;
  }
});

// Inicialização
carregarProdutos();
configurarFiltros();

