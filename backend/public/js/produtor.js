const container = document.getElementById("produtos-container");
const botoesFiltro = document.querySelectorAll('.filtro');

let produtos = []; // Lista de produtos

// -------------------------------
// Pega usuário logado
// -------------------------------
const usuarioLogadoRaw = localStorage.getItem('usuarioLogado');
const usuarioLogado = (usuarioLogadoRaw && usuarioLogadoRaw !== 'undefined')
    ? JSON.parse(usuarioLogadoRaw)
    : null;

// Redireciona se não houver usuário logado
if (!usuarioLogado || !usuarioLogado.id) {
    window.location.href = 'login.html';
}

// -------------------------------
// Preenche dados do produtor no perfil
// -------------------------------
const nomeProdutor = document.getElementById('nome-produtor');
const emailProdutor = document.getElementById('email-produtor');
const telefoneProdutor = document.getElementById('telefone-produtor');
const cpfProdutor = document.getElementById('cpf-produtor');

if (nomeProdutor) nomeProdutor.textContent = `Nome: ${usuarioLogado.nome || 'Produtor'}`;
if (emailProdutor) emailProdutor.textContent = `Email: ${usuarioLogado.email || ''}`;
if (telefoneProdutor) telefoneProdutor.textContent = `Telefone: ${usuarioLogado.telefone || ''}`;
if (cpfProdutor) cpfProdutor.textContent = `CPF: ${usuarioLogado.cpf || ''}`;

// -------------------------------
// Função para renderizar produtos na tela
// -------------------------------
function renderizarProdutos(lista) {
    container.innerHTML = ''; // Limpa container

    lista.forEach(produto => {
        if (!produto || !produto.descricao) {
            console.warn("Produto inválido:", produto);
            return;
        }

        const cardProd = `
            <div class="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center">
                <div class="card h-100 shadow-sm" style="min-width: 280px; max-width: 350px;" id="produto-${produto.id || produto.cod_produto}">
                    <img src="${produto.imagem ? `/imagens/${produto.imagem}` : '/imagens/default.jpg'}" class="card-img-top" alt="${produto.descricao}">
                    <div class="card-body">
                        <h5 class="card-title">${produto.descricao}</h5>
                        <p class="card-text">Tipo: ${produto.tipo || 'Sem tipo'}</p>
                        <p class="card-text">Preço: R$ ${produto.preco.toFixed(2)}</p>
                        <p class="card-text">Validade: ${produto.validade}</p>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML("beforeend", cardProd);
    });
}

// -------------------------------
// Filtrar produtos por tipo
// -------------------------------
function filtrarProdutos(tipo) {
    if (tipo === "Todos") {
        renderizarProdutos(produtos);
    } else {
        const filtrados = produtos.filter(produto => produto.tipo === tipo);
        renderizarProdutos(filtrados);
    }
}

// -------------------------------
// Carregar produtos do backend
// -------------------------------
async function carregarProdutos() {
    try {
        const response = await fetch(`/api/produtos?cod_produtor=${usuarioLogado.id}`);
        if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
        produtos = await response.json();
        renderizarProdutos(produtos);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        container.innerHTML = '<p>Erro ao carregar produtos.</p>';
    }
}

// -------------------------------
// Configurar filtros
// -------------------------------
function configurarFiltros() {
    if (!botoesFiltro) return;

    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', () => {
            const tipo = botao.dataset.tipo;
            filtrarProdutos(tipo);
        });
    });
}

// -------------------------------
// Inicialização
// -------------------------------
carregarProdutos();
configurarFiltros();
