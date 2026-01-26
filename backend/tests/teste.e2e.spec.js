// tests/teste.e2e.spec.js
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000'; // ajuste se sua porta for diferente

// Usuário de teste (produtor real do seu JSON)
const PRODUTOR_VALIDO = {
  email: 'produtor1@agroviva.com',
  senha: 'senha123',
  nome: 'Patricio'
};

// Usuário inválido
const PRODUTOR_INVALIDO = {
  email: 'invalido@agroviva.com',
  senha: 'senhaErrada'
};

test.describe('AgroViva - Login e fluxo produtor', () => {

  test.beforeEach(async ({ page }) => {
    // Navega para o login e limpa localStorage antes de cada teste
    await page.goto(`${BASE_URL}/login.html`);
    await page.evaluate(() => localStorage.clear());
  });

  test('login válido salva localStorage e redireciona', async ({ page }) => {
    // Preenche email e senha válidos
    await page.fill('#email', PRODUTOR_VALIDO.email);
    await page.fill('#senha', PRODUTOR_VALIDO.senha);

    // Clica no botão de login
    await page.click('button.login');

    // Aguarda a página home carregar (ou qualquer elemento visível da home)
    await page.waitForLoadState('networkidle');
    const homeHeading = page.locator('.h1-home'); // h1 com "AgroViva" no home.html
    await expect(homeHeading).toBeVisible({ timeout: 10000 });

    // Verifica se localStorage recebeu os dados do usuário
    const usuarioLogado = await page.evaluate(() => localStorage.getItem('usuarioLogado'));
    const token = await page.evaluate(() => localStorage.getItem('token'));

    expect(usuarioLogado).not.toBeNull();
    expect(token).not.toBeNull();

    const usuarioObj = JSON.parse(usuarioLogado);
    expect(usuarioObj.nome).toBe(PRODUTOR_VALIDO.nome);
    expect(usuarioObj.tipo).toBe('produtor');
  });

  test('login inválido mostra alerta', async ({ page }) => {
    // Captura o alert de erro
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('Erro');
      dialog.accept();
    });

    // Preenche email e senha inválidos
    await page.fill('#email', PRODUTOR_INVALIDO.email);
    await page.fill('#senha', PRODUTOR_INVALIDO.senha);

    // Clica no botão de login
    await page.click('button.login');

    // Aguarda networkidle para garantir que o alert foi disparado
    await page.waitForLoadState('networkidle');

    // Verifica se localStorage continua vazio
    const usuarioLogado = await page.evaluate(() => localStorage.getItem('usuarioLogado'));
    const token = await page.evaluate(() => localStorage.getItem('token'));

    expect(usuarioLogado).toBeNull();
    expect(token).toBeNull();
  });

});
