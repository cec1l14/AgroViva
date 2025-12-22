import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Fluxo de Login – AgroViva', () => {

  test('login válido redireciona para home', async ({ page }) => {
    await page.goto(`${BASE_URL}/login.html`);

    await page.fill('input[name="email"]', 'teste@email.com');
    await page.fill('input[name="senha"]', '123456');

    // Clica no submit e espera a navegação para home
    await Promise.all([
      page.waitForNavigation({ url: /home.html/, waitUntil: 'load', timeout: 15000 }),
      page.click('button[type="submit"]')
    ]);

    // Confirma que realmente foi para home
    await expect(page).toHaveURL(/home.html/);
  });

  test('login inválido mostra alerta', async ({ page }) => {
    await page.goto(`${BASE_URL}/login.html`);

    // Captura o alerta e verifica a mensagem
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('Erro');
      dialog.accept();
    });

    await page.fill('input[name="email"]', 'x@x.com');
    await page.fill('input[name="senha"]', 'errado');

    await page.click('button[type="submit"]');
  });

});
