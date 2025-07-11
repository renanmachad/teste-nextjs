## Desafio Prático para Desenvolvedores com foco em Next.
Seu objetivo é construir uma aplicação que replique algumas páginas do portal da CNN Brasil. 

---

### Funcionalidades Essenciais

1.  **Página Inicial (Home):**
    * Exibe as matérias mais recentes da CNN Brasil, com duas opções de layout que poderão ser definidas na administração da aplicação.

2.  **Página de Matéria:**
    * Exibir o conteúdo completo de uma matéria
    * O layout deve ser o mesmo que o layout do portal atual
    * Na lateral da página (sidebar), deve-se exibir as matérias mais recentes da categoria dessa matéria

3.  **Página de Busca:**
    * Um campo de busca global na navegação.
    * A página de resultados da busca deve exibir os artigos relevantes com paginação.
    * A paginação pode ser feita usando scroll infinito, ou paginação por números de páginas

4.  **Painel Administrativo:**
    * Uma rota protegida por login e senha (`/admin`). Não é necessário implementar autenticação complexa, apenas um controle de acesso básico (ex: um token simples no `localStorage` ou cookie para verificar a autenticação).
    * A única funcionalidade do painel administrativo é definir o layout da página inicial (Layout A ou Layout B)

---

### Criação das páginas

* Os layouts da **página inicial** devem replicar o layout das seguintes páginas:
  * Layout A: https://www.cnnbrasil.com.br/politica/
  * Layout B: https://www.cnnbrasil.com.br/economia/

* O layout da **página de matéria** deve replicar o seguinte layout:
  * Layout: https://www.cnnbrasil.com.br/auto/carro-sustentavel-tera-ipi-zero-veja-modelos-que-podem-ser-beneficiados/

* O layout da **página de busca** deve replicar o seguinte layout:
    * Layout: https://www.cnnbrasil.com.br/?search=carro
 
Para a criação do layout, recomendamos fortemente o uso de `TailwindCSS`.

---

### APIs e consumo de conteúdos

Todas as informações relacionadas a matérias podem ser consumidas utilizando duas APIs:
* Para a página inicial e listagem: https://admin.cnnbrasil.com.br/wp-json/content/v1/posts
* Para a página da matéria: https://admin.cnnbrasil.com.br/wp-json/content/v1/posts/:SLUG

Para a listagem, a API aceita os seguintes `query parameters`:
* `per_page`: O número da página que deseja buscar. Por exemplo `2`
* `category`: O **slug** de uma categoria. O slug da categoria de uma matéria pode ser encontrado em `slug` dentro do objeto `category` na API. Por exemplo `economia`
* `tags`: Uma ou várias tags separadas por virgula. Por exemplo `carro,aviao`
* `search`: Um termo para busca. Por exemplo `passeio de carro`

Para a página de matéria, a API aceita apenas um `route parameter`:
* `slug`: O slug da matéria. O slug pode ser visto dentro de `slug` no objeto de matéria na API

Ambas rotas possuem a mesma tipagem, com a única diferença sendo que a API de listagem é uma array de objetos de matéria.

---

### Criação das rotas no Next.js

O caminho das páginas na sua aplicação deve replicar o mesmo que portal da CNN Brasil:
* A página inicial será na raiz da aplicação (seusite.com/)
* A página de busca terá o parâmetro `search` na URL (seusite.com/?search=)
* A página de matéria deve seguir o padrão `categoria-principal/categoria-secundaria/slug-da-materia`. Alguns exemplos:
  * A matéria `cnnbrasil.com.br/esportes/futebol/brasileirao/slug-da-materia` ficará como `seusite.com/esportes/futebol/brasileirao/slug-da-materia`
  * A matéria `cnnbrasil.com.br/auto/slug-da-materia` ficará como `seusite.com/auto/slug-da-materia`

---

### Área administrativa

O objetivo da área administrativa é definir o layout da página inicial da aplicação. Nessa área administrativa podemos escolher duas opções de layout (Layout A ou Layout B).
* Ao escolher um dos dois layouts e salvar, o dado deve ser armazenado em um cookie, localstorage, ou um banco de dados isolado
* Não existem requisitos especíicos para como a área administrativa deve se parecer.
* Não é necesário ter uma tabela ou lista de usários em banco de dados. Fazer uma validação de um único usuário e senha via back-end é o suficiente.
* O endereço da área administrativa deve ser `seusite.com/admin`, podendo somente usuários logados acessarem.

---

### O que esperamos ver em seu repositório (Entrega no GitHub)

Você deverá criar um **repositório privado no GitHub** e conceder acesso ao usuário que foi enviado à você.

Neste repositório, esperamos encontrar a seguinte estrutura e conteúdo:

1.  **Código-fonte da Aplicação Next.js:**
    * Implementação das funcionalidades descritas acima.
    * **Estrutura de Projeto:** Organização lógica do código (ex: componentes, serviços, rotas e lógica bem definidas).
    * **Boas Práticas:** Demonstração de código limpo, reusabilidade, legibilidade e manutenibilidade.
    * **Tratamento de Erros:** Tratamento de erros mínimo.
    * **Desempenho:** Atenção a otimizações de performance (ex: carregamento de imagens, lazy loading, otimização de requisições, caching e tempo de build).

2.  **Documentação (`README.md`):**
    * **Visão Geral:** Uma breve descrição do projeto e como ele atende aos requisitos.
    * **Instalação e Execução:** Instruções claras e passo a passo para configurar e rodar a aplicação localmente.
    * **Decisões de Design:** Explique as principais escolhas técnicas, incluindo:
        * Como você utilizou e justificou as diferentes estratégias de renderização do Next.js (SSR, SSG, ISR).
        * Quais padrões de projeto (ex: component-based architecture, atomic design, DDD) foram aplicados.
        * Qualquer biblioteca ou ferramenta adicional que você utilizou e por quê.
    * **Desafios Enfrentados:** Compartilhe quaisquer dificuldades encontradas e como você as superou (ou tentou superar).
    * **Melhorias Futuras:** Sugestões de como o projeto poderia ser expandido ou melhorado.

---

### Dicas e Considerações Finais

* Dê preferencia pelo uso de SSR, SSG ou ISR. Use o mínimo possível de *client components* ou *use client* no proejto.
* Busque utilizar mínimo de dependências externas. Bibliotecas e ferramentas como Axios, Styled Components e Shadcn\ui **não são permitidas**. O objetivo é demonstrar sua capacidade e conhecimento em desenvolvimento de software.
* O objetivo principal é avaliar sua **capacidade de projetar e implementar uma solução Full-Stack robusta com Next.js**, demonstrando um entendimento profundo de seus recursos avançados.
* A **qualidade do seu código**, a **clareza da sua documentação** e a **justificativa das suas escolhas técnicas** serão pontos cruciais de avaliação.
* Não se preocupe em construir uma interface de usuário complexa e idêntica ao portal; o foco está na **funcionalidade e na arquitetura**.
