# Momentum Web

<p align="center">
  <img src="public/logo/logo-wordmark.webp" alt="Momentum Wordmark" width="700">
</p>

Frontend da aplicação **Momentum**, desenvolvido com **Angular**, responsável por fornecer uma interface moderna, intuitiva e responsiva para o gerenciamento de hábitos, tarefas e acompanhamento da evolução do usuário.

---

## 📖 Sobre o Projeto

O **Momentum Web** é a aplicação frontend do ecossistema **Momentum**.

Seu objetivo é oferecer uma experiência intuitiva e agradável para que os usuários possam gerenciar seus hábitos, tarefas e finanças, acompanhar sua evolução e utilizar os recursos disponibilizados pela **Momentum API**.

A aplicação foi desenvolvida utilizando as tecnologias mais recentes do ecossistema Angular, seguindo boas práticas de organização, componentização e escalabilidade.

---

## ✨ Funcionalidades

### ✅ Implementadas

* 🔐 Autenticação e gerenciamento de usuários
* 📊 Dashboard com indicadores e visão geral da evolução
* ✅ Gerenciamento de hábitos
* 📈 Acompanhamento do progresso do usuário
* 📱 Interface responsiva para diferentes dispositivos
* 🔄 Integração com a **Momentum API**

### 🚧 Em desenvolvimento

* 📋 Gerenciamento de tarefas
* 💰 Gerenciamento financeiro

---

## 🛠️ Stack

### Framework

* Angular 21

### Linguagem

* TypeScript 5

### Interface do Usuário

* Angular Material
* Angular CDK
* Lucide Angular

### Estilização

* Tailwind CSS 4
* PostCSS
* Autoprefixer

### Comunicação e Programação Reativa

* Angular Router
* Angular Forms
* RxJS

### Visualização de Dados

* Chart.js

### Testes

* Vitest
* JSDOM

### Qualidade de Código

* Prettier

---

## 📁 Estrutura do Projeto

```text
src/
├── app/
├── assets/
├── environments/
└── styles/
```

> A organização das pastas segue uma arquitetura modular, visando facilitar a manutenção, escalabilidade e reutilização dos componentes.

---

## 🚀 Como Executar

### Pré-requisitos

* Node.js
* npm
* Angular CLI

### Clonar o repositório

```bash
git clone https://github.com/saviotomazb/momentum_web.git

cd momentum_web
```

### Instalar as dependências

```bash
npm install
```

### Executar a aplicação

```bash
npm start
```

ou

```bash
ng serve
```

A aplicação estará disponível em:

```text
http://localhost:4200
```

---

## ⚙️ Configuração

Antes de iniciar a aplicação, configure a URL da API no arquivo de ambiente correspondente.

Exemplo:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api'
};
```

---

## 📜 Scripts Disponíveis

| Comando          | Descrição                                                 |
| ---------------- | --------------------------------------------------------- |
| `npm start`      | Executa a aplicação em modo de desenvolvimento            |
| `npm run build`  | Gera a build de produção                                  |
| `npm run watch`  | Gera a build em modo *watch*                              |
| `npm test`       | Executa os testes automatizados                           |
| `npm run format` | Formata o código utilizando Prettier *(caso configurado)* |

---

## 🔗 Projetos Relacionados

- **[Momentum API](https://github.com/saviotomazb/momentum_api.git)** — Backend responsável pelas regras de negócio, autenticação, persistência dos dados e disponibilização da API REST.

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas.

Caso encontre algum problema ou tenha sugestões de melhoria, fique à vontade para abrir uma **Issue** ou enviar uma **Pull Request**, siga estas etapas:

1. Bifurque este repositório.
2. Crie um branch: `git checkout -b minha-feature`.
3. Faça suas alterações e confirme-as: `git commit -m "Minha feature"`.
4. Envie para o branch remoto: `git push origin minha-feature`.
5. Abra uma pull request.

Antes de contribuir, certifique-se de:

* Manter o código padronizado.
* Escrever código legível e reutilizável.
* Executar os testes antes de enviar alterações.