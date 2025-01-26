# Trabalho de Computação Gráfica

## Descrição

Este projeto consiste em desenvolver um programa em WebGL que permita ao usuário realizar interações e aplicar transformações geométricas em um objeto bidimensional.

## Funcionalidades

### Translação 
- O usuário poderá clicar e arrastar dentro da área interna do objeto para movê-lo.

### Rotação 
- Permitir que o usuário rotacione o objeto em torno do seu baricentro.

### Redimensionamento 
- Permitir que o objeto seja escalado (aumentado ou reduzido) com relação ao seu baricentro.

## Estrutura do Projeto

- `Common/`: Contém arquivos comuns utilizados no projeto.
  - `initShaders.js`: Funções para inicializar shaders no arquivo HTML.
  - `initShaders2.js`: Funções para inicializar shaders que estão em arquivos separados.
  - `MV.js`: Pacote de matrizes e vetores.
  - `webgl-utils.js`: Utilitários padrão do Google para configurar um contexto WebGL.

- `cubo_aula/`: Contém os arquivos específicos do projeto.
  - `cubo_aula.css`: Estilos CSS para o projeto.
  - `cubo_aula.html`: Arquivo HTML principal.
  - `cubo_aula.js`: Lógica JavaScript para interações e transformações do objeto.

## Como Executar

1. Clone o repositório.
2. Abra o arquivo `cubo_aula/cubo_aula.html` em um navegador que suporte WebGL.
3. Utilize os controles na página para interagir com o objeto.

## Controles

- **Mudar sentido**: Inverte o sentido de rotação.
- **Parar/Retomar Rotação**: Alterna entre parar e retomar a rotação.
- **Alternar Modo (Mover/Girar)**: Alterna entre mover e girar o objeto.
- **Sliders de Rotação**: Ajustam a velocidade de rotação nos eixos X, Y e Z.
- **Slider de Escala**: Ajusta o fator de escala do objeto.

## Dependências

- Navegador com suporte a WebGL.
- [WebGLUtils](Common/webgl-utils.js)
- [MV.js](Common/MV.js)
- [initShaders.js](Common/initShaders.js)