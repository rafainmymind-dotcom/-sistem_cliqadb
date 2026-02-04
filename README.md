
# 🚀 CliqA Digital Agency Manager

Sistema completo de gestão para agências de Webdesign e Social Media.

## 🛠️ Procedimento para Subir no GitHub

1. **Crie um repositório vazio** no GitHub.
2. No terminal da pasta do projeto, execute:
   ```bash
   git init
   git add .
   git commit -m "feat: setup inicial v2.5"
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git push -u origin main
   ```

## 📦 Como gerar a versão de produção (Pasta 'dist')
Se você deseja gerar os arquivos finais para subir em uma hospedagem comum via FTP:
1. Instale as dependências: `npm install`
2. Gere o build: `npm run build`
3. O conteúdo da pasta `dist` é o seu site pronto.

## 🌐 Hospedagem Recomendada
Para este projeto, recomendamos:
- **Vercel** (Gratuito): Basta conectar seu GitHub. Ele detecta as configurações automaticamente.
- **Netlify** (Gratuito): Arraste a pasta `dist` para o painel deles e o site estará online.

## 🎨 Personalização Global
Não é necessário mexer no código para mudar a cara do sistema. 
Acesse o menu **Geral > Configurações** para alterar:
- Nome da Agência
- Cores de destaque (Botões e Ícones)
- Tipografia (Fontes)
- Credenciais do Administrador Master
