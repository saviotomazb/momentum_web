# Momentum Web

![GitHub repo size](https://img.shields.io/github/repo-size/saviotomazb/momentum_web?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/saviotomazb/momentum_web?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/saviotomazb/momentum_web?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/saviotomazb/momentum_web?style=for-the-badge)
![GitHub pull requests](https://img.shields.io/github/issues-pr/saviotomazb/momentum_web?style=for-the-badge)

> Frontend web do Momentum, uma aplicação para acompanhar hábitos, tarefas e progresso pessoal.
> O projeto usa Angular com componentes standalone, rotas protegidas por autenticação JWT e uma interface responsiva para dashboard, hábitos e tarefas.

## Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas para as seguintes tarefas:

- [x] Criar base do frontend em Angular
- [x] Implementar login e cadastro
- [x] Proteger rotas autenticadas
- [x] Criar layout principal com navegação
- [x] Montar telas de dashboard, hábitos e tarefas
- [ ] Integrar hábitos e tarefas com dados reais da API
- [ ] Adicionar criação, edição e conclusão de hábitos
- [ ] Expandir o módulo de tarefas
- [ ] Melhorar cobertura de testes

## Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Você instalou o [Node.js](https://nodejs.org/) em uma versão compatível com Angular 21.
- Você instalou o npm. Este projeto foi configurado com `npm@10.8.2`.
- Você tem uma API backend disponível em `http://localhost:5271`.
- Você tem uma máquina Windows, Linux ou macOS com terminal e Git instalados.

## Instalando Momentum Web

Para instalar o Momentum Web, siga estas etapas:

```bash
git clone https://github.com/saviotomazb/momentum_web.git
cd momentum_web
npm install
```

## Usando Momentum Web

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm start
```

Depois, acesse:

```text
http://localhost:4200
```

Rotas principais da aplicação:

- `/auth/login`: login de usuário
- `/auth/register`: cadastro de usuário
- `/dashboard`: resumo dos hábitos e progresso semanal
- `/habits`: formulário e acompanhamento de hábitos
- `/tasks`: módulo inicial de tarefas

## Scripts disponíveis

```bash
npm start
```

Inicia a aplicação em modo de desenvolvimento.

```bash
npm run build
```

Gera a versão de produção em `dist/`.

```bash
npm run watch
```

Executa o build em modo observação para desenvolvimento.

```bash
npm test
```

Executa os testes unitários configurados no Angular.

## Tecnologias utilizadas

- Angular 21
- TypeScript
- Angular Router
- Angular Forms
- Angular Material/CDK
- Tailwind CSS
- RxJS
- Chart.js
- Lucide Angular

## Estrutura do projeto

```text
src/
  app/
    core/
      constants/
      guards/
      interceptors/
      services/
    features/
      auth/
      dashboard/
      habits/
      tasks/
    layout/
      components/
```

## Contribuindo para Momentum Web

Para contribuir com Momentum Web, siga estas etapas:

1. Bifurque este repositório.
2. Crie um branch: `git checkout -b minha-feature`.
3. Faça suas alterações e confirme-as: `git commit -m "Minha feature"`.
4. Envie para o branch remoto: `git push origin minha-feature`.
5. Abra uma pull request.

Como alternativa, consulte a documentação do GitHub sobre [como criar uma pull request](https://docs.github.com/pt/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

## Colaboradores

Agradecemos as seguintes pessoas que contribuiram para este projeto:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/saviotomazb" title="Perfil de Sávio Tomaz no GitHub">
        <img src="https://avatars.githubusercontent.com/saviotomazb" width="100px;" alt="Foto de Sávio Tomaz no GitHub"/><br>
        <sub>
          <b>Sávio Tomaz</b>
        </sub>
      </a>
    </td>
  </tr>
</table>
