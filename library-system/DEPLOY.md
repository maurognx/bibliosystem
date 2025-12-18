# Guia de Deploy em Produção

Para rodar o sistema de forma otimizada e definitiva (sem precisar do terminal de desenvolvimento `npm run dev`), siga os passos abaixo:

## 1. Gerar os Arquivos Estáticos (Build)

O Frontend (React) precisa ser "compilado" em arquivos HTML/CSS/JS estáticos.

1.  Abra um terminal na pasta `client`:
    ```powershell
    cd client
    npm run build
    ```
    *Isso criará uma pasta `dist` dentro de `client`.*

## 2. Preparar o Backend

O Backend já foi configurado para servir esses arquivos estáticos automaticamente.

1.  Certifique-se de que o backend está atualizado:
    ```powershell
    pm2 restart library-api
    ```

## 3. Testar

Agora, o seu servidor backend (porta 3000) serve **TUDO** (API + Site).

1.  Acesse `http://localhost:3000` (ou o IP do servidor:3000).
2.  Você deve ver a aplicação completa funcionando.

## 4. (Opcional) Configurar Inicialização Automática

Para que o servidor inicie sozinho se o Windows/Linux reiniciar:

```powershell
pm2 startup
pm2 save
```

---
**Observação**: O comando `npm run dev` no frontend não é mais necessário em produção. Apenas o `pm2` rodando o backend é suficiente.
