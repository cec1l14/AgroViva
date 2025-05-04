import { produtos } from './dados.js';

const container = document.getElementById("produtos-container");
const botoesFiltro = document.querySelectorAll('.filtro');

function renderizarProdutos(lista) {
  container.innerHTML = ''; // Limpa o conteúdo antes de renderizar

  lista.forEach(produto => {
    const cardProd = `
      <div class="card" id="produto-${produto.nome}">
        <img src="${produto.imagem}" class="card-img" alt="${produto.nome}">
        <div class="card-body">
          <span class="fa-solid fa-trash delete-icon"></span>
          <h5 class="card-title">${produto.nome}</h5>
          <p class="card-title">${produto.tipo}</p>
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", cardProd);

    // Agora adiciona o evento de deletar
    const trashIcon = container.querySelector(
      `#produto-${produto.nome} .delete-icon`
    );

    trashIcon.onclick = function () {
      const cardToRemove = document.querySelector(`#produto-${produto.nome}`);
      cardToRemove.remove();
    };
  });
}

function filtrarProdutos(categoria) {
  const filtrados = produtos.filter(produto => produto.tipo === categoria);
  renderizarProdutos(filtrados);
}

botoesFiltro.forEach(botao => {
  botao.addEventListener('click', () => {
    const categoria = botao.dataset.categoria;
    if (categoria === "Todos") {
      renderizarProdutos(produtos);
    } else {
      filtrarProdutos(categoria);
    }
  });
});

// Renderiza todos inicialmente
renderizarProdutos(produtos);


