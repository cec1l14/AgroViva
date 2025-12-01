document.addEventListener('DOMContentLoaded', () => {
  const fotoPerfil = document.getElementById('foto-perfil');
  const nomeUsuario = document.getElementById('nome-usuario');
  const tipoUsuario = document.getElementById('tipo-usuario');
  const emailUsuario = document.getElementById('email-usuario');
  const telefoneUsuario = document.getElementById('telefone-usuario');
  const extraInfo = document.querySelector('#extra-info span');
  const btnAlterarFoto = document.getElementById('btn-alterar-foto');
  const logoutBtn = document.getElementById('logout');

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const token = localStorage.getItem('token');
  const API_BASE = `${window.location.origin}/api`;

  if (!usuarioLogado || !token) {
    alert('Você precisa fazer login.');
    window.location.href = 'login.html';
    return;
  }

  // -------------------------------
  // Carregar dados do perfil
  // -------------------------------
  async function carregarPerfil() {
    try {
      const response = await fetch(`${API_BASE}/perfil`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`Status: ${response.status}`);

      const usuario = await response.json();

      nomeUsuario.textContent = usuario.nome || '';
      emailUsuario.textContent = usuario.email || '';
      telefoneUsuario.textContent = usuario.telefone || 'Não informado';

      if (usuario.cpf) {
        tipoUsuario.textContent = 'Produtor';
        extraInfo.textContent = usuario.cpf;
      } else if (usuario.cnpj) {
        tipoUsuario.textContent = 'Empresário';
        extraInfo.textContent = usuario.cnpj;
      } else {
        tipoUsuario.textContent = '';
        extraInfo.textContent = '';
      }

      fotoPerfil.src = usuario.foto ? `/imagens/${usuario.foto}` : '/imagens/perfil.png';

      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      alert('Erro ao carregar perfil. Verifique sua conexão ou faça login novamente.');
    }
  }

  // -------------------------------
  // Alterar foto de perfil
  // -------------------------------
  btnAlterarFoto.addEventListener('click', () => {
    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = 'image/*';

    inputFile.onchange = async () => {
      if (!inputFile.files || inputFile.files.length === 0) return;

      const formData = new FormData();
      formData.append('foto', inputFile.files[0]);

      try {
        const response = await fetch(`${API_BASE}/perfil`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Falha ao atualizar foto');

        fotoPerfil.src = `/imagens/${data.usuario.foto}`;
        localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
        alert('Foto de perfil atualizada com sucesso!');
      } catch (error) {
        console.error('Erro ao enviar foto:', error);
        alert('Erro ao atualizar foto.');
      }
    };

    inputFile.click();
  });

  // -------------------------------
  // Logout
  // -------------------------------
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });

  // Inicializa
  carregarPerfil();
});
