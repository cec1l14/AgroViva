const lista = document.getElementById('lista-produtos');
const nomeEmpresario = document.getElementById('nome-empresario');
const logoutBtn = document.getElementById('logout');

const btnNovoProduto = document.getElementById('btn-novo-produto');
const formProdutoSection = document.getElementById('form-produto-section');
const formProduto = document.getElementById('form-produto');
const btnCancelarProduto = document.getElementById('btn-cancelar-produto');

// Pega dados do usuário logado
const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

if (!usuarioLogado) {
    window.location.href = 'login.html';
} else {
    nomeEmpresario.textContent = usuarioLogado.nome;
}

// Abrir formulário de cadastro de produto
btnNovoProduto.addEventListener('click', () => {
    if (usuarioLogado.tipo !== 'produtor') {
        alert('Apenas produtores podem cadastrar produtos!');
        return;
    }
    formProdutoSection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Cancelar cadastro de produto
btnCancelarProduto.addEventListener('click', () => {
    formProdutoSection.style.display = 'none';
    formProduto.reset();
});

// Submit do formulário de produto
formProduto.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (usuarioLogado.tipo !== 'produtor') {
        alert('Apenas produtores podem cadastrar produtos!');
        return;
    }

    const descricao = document.getElementById('descricao').value.trim();
    const tipo = document.getElementById('tipo').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const validade = document.getElementById('validade').value;
    const imagem = document.getElementById('imagem').value.trim();

    if (!descricao || !tipo || !preco || !validade) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    const data = {
        descricao,
        tipo,
        preco,
        validade,
        imagem: imagem || null,
        cod_produtor: usuarioLogado.id
    };

    try {
        const response = await fetch('/api/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Produto cadastrado com sucesso!');
            formProduto.reset();
            formProdutoSection.style.display = 'none';
            carregarProdutos(); // atualiza lista de produtos
        } else {
            alert('Erro: ' + result.error);
        }
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        alert('Erro ao se comunicar com o servidor.');
    }
});

// Carrega produtos
async function carregarProdutos() {
    try {
        const response = await fetch(`/api/produtos`);
        if (!response.ok) throw new Error("Erro ao buscar produtos");
        const produtos = await response.json();

        lista.innerHTML = '';

        produtos.forEach(produto => {
            const div = document.createElement('div');
            div.classList.add('col');

            const imagemProduto = produto.imagem ? `/imagens/${produto.imagem}` : '/imagens/default.jpg';

            div.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${imagemProduto}" class="card-img-top" alt="${produto.descricao}">
                    <div class="card-body">
                        <h5 class="card-title">${produto.descricao}</h5>
                        <p class="card-text">Preço: R$ ${produto.preco.toFixed(2)}</p>
                        <p class="card-text">Produtor: ${produto.produtor.nome}</p>
                        <p class="card-text">Contato: ${produto.produtor.telefone}</p>
                        <div class="d-flex justify-content-between mt-2">
                            <a href="https://wa.me/${produto.produtor.telefone}" target="_blank" class="btn btn-success btn-sm">WhatsApp</a>
                            <a href="tel:${produto.produtor.telefone}" class="btn btn-primary btn-sm">Ligar</a>
                        </div>
                    </div>
                </div>
            `;

            lista.appendChild(div);
        });
    } catch (error) {
        console.error(error);
        lista.innerHTML = "<p>Erro ao carregar produtos.</p>";
    }
}

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
});

// Inicialização
carregarProdutos();
