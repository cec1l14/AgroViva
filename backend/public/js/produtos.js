const container = document.getElementById("produtos-container");
const botoesFiltro = document.querySelectorAll('.filtro');

let produtos = []; // Lista de produtos

console.log("Script produtos.js carregado");

// ========================
// 🔐 Verifica token JWT
// ========================
const token = localStorage.getItem('token');
console.log("Token JWT do localStorage:", token);

if (!token) {
    console.warn("Token não encontrado! Redirecionando para login...");
    window.location.href = 'login.html';
}

// ========================
// 🚪 Logout
// ========================
document.querySelectorAll('.sub-menu-link').forEach(link => {
    if (link.querySelector('p')?.textContent === 'Sair') {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('usuarioLogado');
            window.location.href = 'login.html';
        });
    }
});

// ========================
// 🧑 Carregar dados do perfil do usuário
// ========================
async function carregarPerfil() {
    try {
        const response = await fetch('/api/perfil', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Erro ao carregar perfil");

        const user = await response.json();
        console.log("Perfil carregado:", user);

        // Nome no submenu
        const nomeEl = document.querySelector(".user-info h2");
        if (nomeEl) nomeEl.textContent = user.nome;

        // Foto no submenu
        const imgMenu = document.querySelector(".user-info img");
        if (imgMenu) {
            imgMenu.src = user.foto ? `/imagens/${user.foto}` : "../../imagens/cara.png";
        }

        // Foto do menu superior
        const imgTop = document.querySelector(".user-pic");
        if (imgTop) {
            imgTop.src = user.foto ? `/imagens/${user.foto}` : "../../imagens/cara.png";
        }

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
    }
}

// ========================
// 🛒 Função para renderizar produtos
// ========================
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
                    <img src="${produto.imagem || "/imagens/default.jpg"}" class="card-img-top" alt="${produto.descricao}">
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

// ========================
// 🔎 Filtrar produtos por tipo
// ========================
function filtrarProdutos(tipo) {
    if (tipo === "Todos") {
        renderizarProdutos(produtos);
    } else {
        const filtrados = produtos.filter(produto => produto.tipo === tipo);
        renderizarProdutos(filtrados);
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

// ========================
// 👤 Clique no ícone do produtor
// ========================
container.addEventListener('click', function (event) {
    if (event.target.classList.contains('perfil-icon')) {
        const produtorId = event.target.dataset.produtor;
        window.location.href = `produtor.html?id=${produtorId}`;
    }
});

// ========================
// 📦 Carregar produtos da API
// ========================
async function carregarProdutos() {
    console.log("Carregando produtos da API...");

    try {
        const response = await fetch('/api/produtos', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("Status da resposta:", response.status);

        if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);

        produtos = await response.json();
        console.log("Produtos recebidos:", produtos);

        renderizarProdutos(produtos);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        container.innerHTML = '<p>Erro ao carregar produtos.</p>';
    }
}

// ========================
// 🚀 Inicialização
// ========================
carregarPerfil();  // <--- Agora carrega nome + foto
carregarProdutos();
configurarFiltros();
