# SoloVivo - O Futuro do Agro Sustentável

## Descrição

O **SoloVivo** é uma plataforma educacional e interativa desenvolvida para demonstrar, na prática, como o agronegócio pode crescer de forma sustentável, equilibrando produtividade, inovação e preservação ambiental.

O projeto foi criado com base na temática **"Agro forte, futuro sustentável: equilíbrio entre produção e meio ambiente"**, proposta pelo Programa Agrinho.

Por meio de recursos interativos, gamificação, acessibilidade e visualização de dados, o usuário compreende os desafios enfrentados pelo produtor rural moderno e aprende como decisões sustentáveis podem gerar benefícios econômicos, sociais e ambientais.

O objetivo é mostrar que o futuro do campo depende da integração entre tecnologia, responsabilidade ambiental e desenvolvimento sustentável.

---

## Objetivos

* Conscientizar sobre a importância da sustentabilidade no agronegócio.
* Demonstrar como práticas agrícolas sustentáveis contribuem para a preservação ambiental.
* Incentivar o uso da tecnologia como ferramenta de transformação no campo.
* Apresentar informações de forma acessível e interativa.
* Promover a educação digital por meio de recursos modernos da Web.
* Relacionar desenvolvimento econômico e preservação dos recursos naturais.

---

## Tecnologias Utilizadas

O projeto foi desenvolvido utilizando exclusivamente as tecnologias fundamentais da Web.

### HTML5

Responsável pela estrutura semântica das páginas, organização do conteúdo e acessibilidade.

### CSS3

Utilizado para estilização visual, responsividade, animações, temas visuais e adaptação para diferentes dispositivos.

Recursos utilizados:

* Flexbox
* CSS Grid
* Media Queries
* Variáveis CSS
* Transições e animações

### JavaScript (Vanilla JS)

Responsável pela lógica do sistema, manipulação do DOM, interatividade e armazenamento de informações.

Recursos utilizados:

* Manipulação dinâmica de elementos HTML
* Eventos de usuário
* LocalStorage
* Web Speech API
* Geração dinâmica de conteúdo
* Atualização de informações em tempo real

### Biblioteca Externa

A única dependência externa utilizada é:

* html2canvas

Utilizada exclusivamente para a exportação do certificado gerado pelo usuário.

---

## Funcionalidades

### Simulador de Fazenda

Sistema de gamificação que permite ao usuário administrar uma propriedade rural sustentável.

O jogador possui um orçamento limitado e deve investir em melhorias ambientais e tecnológicas.

Cada decisão afeta indicadores como:

* Sustentabilidade
* Consumo de água
* Emissão de CO₂
* Biodiversidade
* Economia

### Dashboard de Dados

Painel de relatórios que apresenta visualmente os resultados obtidos pelo usuário durante a simulação.

### Comparador de Cenários

Ferramenta que compara:

* Fazenda tradicional
* Fazenda sustentável

Demonstrando os impactos ambientais e econômicos de cada modelo.

### Certificado Personalizado

Geração automática de certificado com base no desempenho alcançado pelo usuário.

### Sistema de Acessibilidade

O projeto possui recursos voltados à inclusão digital:

* Leitura de conteúdo por voz
* Controle de velocidade da fala
* Seleção de vozes disponíveis
* Aumento de fonte
* Redução de fonte
* Alto contraste
* Modo leitura
* Tema escuro
* Tema claro

### Responsividade

O site adapta-se automaticamente a:

* Smartphones
* Tablets
* Notebooks
* Computadores Desktop

---


## Estrutura do Projeto

```text
/
├── assets/
│   ├── VideoAnimacaoPalavras.mp4
│   └── VideoDrone.mp4
│
├── css/
│   ├── Style.css
│   ├── Simulador.css
│   ├── Dashboard.css
│   ├── Futuro.css
│   └── Certificado.css
│
├── imagens/
│   ├── Logo.png
│   ├── FazendaSustentavel.png
│   ├── NaoSustentavel.png
│   └── UpgradesSimulador/
│       ├── Inicio.png
│       ├── Upgrade1.png
│       ├── Upgrade2.png
│       ├── Upgrade3.png
│       ├── Upgrade4.png
│       ├── Upgrade5.png
│       ├── Upgrade6.png
│       ├── Upgrade7.png
│       └── Upgrade8.png
│
├── js/
│   ├── Acessibilidade.js
│   ├── Certificado.js
│   ├── Dashboard.js
│   ├── Futuro.js
│   ├── Main.js
│   └── Simulador.js
│
├── paginas/
│   ├── Certificado.html
│   ├── Dashboard.html
│   ├── Futuro.html
│   ├── Informacoes.html
│   ├── Simulador.html
│   └── Sobre.html
│
├── Index.html
└── README.md
```


## Organização do Código

O projeto foi estruturado seguindo boas práticas de desenvolvimento.

### HTML

* Estrutura semântica.
* Organização lógica do conteúdo.
* Uso adequado de elementos de navegação e interação.

### CSS

* Arquivos separados por responsabilidade.
* Uso de variáveis para facilitar manutenção.
* Layout responsivo.
* Temas visuais centralizados.

### JavaScript

* Código modularizado.
* Manipulação eficiente do DOM.
* Persistência de dados utilizando LocalStorage.
* Recursos avançados de acessibilidade.

---

## Recursos de Programação

### Manipulação do DOM

O JavaScript altera elementos da página dinamicamente em resposta às ações do usuário.

### Eventos

O sistema responde a:

* Cliques
* Navegação
* Alteração de configurações
* Interações do simulador

### Persistência de Dados

As informações do usuário permanecem armazenadas utilizando LocalStorage.

### Web Speech API

Utilizada para realizar leitura de conteúdo diretamente pelo navegador.

### Geração Dinâmica de Conteúdo

Diversas informações são atualizadas automaticamente sem necessidade de recarregar a página.

---

## Responsividade

A interface foi desenvolvida para funcionar corretamente em diferentes tamanhos de tela.

Foram utilizadas Media Queries, Flexbox e CSS Grid para garantir:

* Boa legibilidade
* Navegação intuitiva
* Organização visual consistente
* Adaptação automática dos componentes

---

## Sustentabilidade e Tema

O projeto busca demonstrar que o crescimento da produção agrícola e a preservação ambiental podem coexistir.

Durante a utilização da plataforma, o usuário aprende sobre práticas sustentáveis como:

* Reuso de água
* Irrigação inteligente
* Energia solar
* Controle biológico
* Preservação da biodiversidade
* Redução de impactos ambientais

O conteúdo reforça a importância do equilíbrio entre produção e conservação dos recursos naturais.

---

## Créditos e Referências

### Referências de Conteúdo

* Embrapa – Empresa Brasileira de Pesquisa Agropecuária
* FAO – Food and Agriculture Organization of the United Nations
* Programa Agrinho
* Cartilhas e materiais educativos sobre agricultura sustentável
* Conteúdos sobre preservação ambiental e uso consciente dos recursos naturais

### Referências Técnicas

* Documentação HTML5
* Documentação CSS3
* Documentação JavaScript
* MDN Web Docs
* Web Speech API
* LocalStorage API
* html2canvas

### Recursos Utilizados

* Google Fonts
* HTML5
* CSS3
* JavaScript
* html2canvas

### Recursos Visuais

* Imagens desenvolvidas para o projeto SoloVivo
* Vídeos utilizados para contextualização do tema agro e sustentabilidade


---

## Recursos de Inteligência Artificial

Ferramentas de inteligência artificial foram utilizadas como apoio durante o desenvolvimento para:

* Revisão de código
* Sugestões de acessibilidade
* Correções de CSS
* Organização estrutural
* Auxílio na documentação

### Prompt Utilizado

"Auxilie na revisão, organização e otimização do código HTML, CSS e JavaScript do projeto SoloVivo, mantendo compatibilidade com as regras do Programa Agrinho e utilizando apenas tecnologias permitidas."

---

## Instalação e Execução

### Executar Localmente

1. Clone o repositório:

```bash
git clone https://github.com/lucasmarquescordeiro16/Agrinho.git
```

2. Acesse a pasta do projeto.

3. Abra o arquivo:

```text
Index.html
```

ou utilize uma extensão como:

* Live Server

---

## Publicação

### Repositório GitHub

https://github.com/lucasmarquescordeiro16/Agrinho



### Tema do Concurso

Agro forte, futuro sustentável: equilíbrio entre produção e meio ambiente.


---

## Critérios da Rubrica Atendidos

### Complexidade dos Códigos

* HTML semântico.
* CSS responsivo.
* Manipulação do DOM.
* Uso de eventos.
* Persistência de dados.
* Integração entre páginas.
* Recursos avançados de acessibilidade.

### Usabilidade

* Navegação intuitiva.
* Feedback visual ao usuário.
* Responsividade.
* Recursos de acessibilidade.
* Interface organizada.

### Publicação

* Projeto hospedado em repositório GitHub.
* Estrutura organizada.
* Documentação completa.
* Arquivos separados por responsabilidade.

### Originalidade

O projeto apresenta uma abordagem própria para conscientização ambiental por meio de simulação interativa, combinando educação, tecnologia e sustentabilidade em uma única experiência digital.

## Autor

### Lucas Marques Cordeiro

Projeto desenvolvido para o Programa Agrinho utilizando HTML5, CSS3 e JavaScript, com foco em educação digital, sustentabilidade, acessibilidade e inovação tecnológica aplicada ao agronegócio. consegue arrumar colocando certo a parter da pasta das imagems? e as fontes que é as fontes saudas para as informaçoes

