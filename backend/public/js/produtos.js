const container = document.getElementById("produtos-container");
const botoesFiltro = document.querySelectorAll('.filtro');
const formPesquisa = document.getElementById('form-pesquisa');
const inputPesquisa = document.getElementById('input-pesquisa');

let produtos = []; // Lista completa de produtos carregados

// Função para renderizar produtos na tela
function renderizarProdutos(lista) {
    container.innerHTML = ''; // Limpa o container antes de renderizar

    lista.forEach(produto => {
        if (!produto || !produto.descricao) {
            console.warn("Produto inválido:", produto);
            return;
        }

        const cardProd = `
            <div class="col">
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

// Pesquisar produtos por descrição
function pesquisarProdutos(query) {
    const filtrados = produtos.filter(produto => produto.descricao.toLowerCase().includes(query.toLowerCase()));
    renderizarProdutos(filtrados);
}

// Carregar produtos da API
async function carregarProdutos() {
    try {
        const response = await fetch('/api/produtos');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        produtos = await response.json();
        renderizarProdutos(produtos);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        container.innerHTML = '<p>Erro ao carregar produtos.</p>';
    }
}

// Configurar filtros clicáveis
function configurarFiltros() {
    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', () => {
            const tipo = botao.dataset.tipo;
            filtrarProdutos(tipo);
        });
    });
}

// Delegação de evento para perfil do produtor
container.addEventListener('click', function (event) {
    if (event.target.classList.contains('perfil-icon')) {
        const produtorId = event.target.dataset.produtor;
        window.location.href = `produtor.html?id=${produtorId}`;
    }
});

// Pesquisa via input
formPesquisa.addEventListener('submit', function (event) {
    event.preventDefault();
    const query = inputPesquisa.value.trim();
    pesquisarProdutos(query);
});

// Inicialização
carregarProdutos();
configurarFiltros();
