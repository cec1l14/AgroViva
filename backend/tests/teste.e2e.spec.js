// tests/e2e.test.js
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

const PRODUTOR_VALIDO = {
  email: 'produtor1@agroviva.com',
  senha: 'senha123',
  nome: 'Patricio'
};

const PRODUTOR_INVALIDO = {
  email: 'invalido@agroviva.com',
  senha: 'senhaErrada'
};

test.describe('AgroViva - Testes de Interface/E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login.html`);
    await page.evaluate(() => localStorage.clear());
  });

  // ---------------------
  // Cenário de Sucesso
  // ---------------------
  test('Login válido redireciona e salva dados no localStorage', async ({ page }) => {
    await page.fill('#email', PRODUTOR_VALIDO.email);
    await page.fill('#senha', PRODUTOR_VALIDO.senha);
    await page.click('button.login');

    await page.waitForLoadState('networkidle');

    // Verifica se foi redirecionado para a home
    const homeHeading = page.locator('.h1-home');
    await expect(homeHeading).toBeVisible();

    // Verifica localStorage
    const usuarioLogado = await page.evaluate(() => localStorage.getItem('usuarioLogado'));
    const token = await page.evaluate(() => localStorage.getItem('token'));

    expect(usuarioLogado).not.toBeNull();
    expect(token).not.toBeNull();

    const usuarioObj = JSON.parse(usuarioLogado);
    expect(usuarioObj.nome).toBe(PRODUTOR_VALIDO.nome);
  });

  // ---------------------
  // Cenário de Erro
  // ---------------------
  test('Login inválido mostra alerta e não salva dados', async ({ page }) => {
    let alertFired = false;
    page.on('dialog', dialog => {
      alertFired = true;
      expect(dialog.message()).toContain('Erro');
      dialog.accept();
    });

    await page.fill('#email', PRODUTOR_INVALIDO.email);
    await page.fill('#senha', PRODUTOR_INVALIDO.senha);
    await page.click('button.login');

    await page.waitForTimeout(500); // espera o alert

    const usuarioLogado = await page.evaluate(() => localStorage.getItem('usuarioLogado'));
    const token = await page.evaluate(() => localStorage.getItem('token'));

    expect(alertFired).toBe(true);
    expect(usuarioLogado).toBeNull();
    expect(token).toBeNull();
  });

});
