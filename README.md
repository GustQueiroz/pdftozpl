# PDF para ZPL Converter

Uma aplicação web moderna para converter arquivos PDF e PNG para código ZPL usando a API LabelZoom.

## 🚀 Funcionalidades

- **Conversão Individual**: Converte um arquivo PDF/PNG para ZPL
- **Conversão em Lote**: Processa múltiplos arquivos simultaneamente
- **Download Automático**: 
  - Arquivo .txt individual
  - Arquivo .zip com múltiplos arquivos em lote
- **Progresso em Tempo Real**: Visualização do progresso durante conversão em lote
- **Configurações Avançadas**: Controle sobre DPI, rotação, escala, modo de cor e mais
- **Interface Moderna**: Design responsivo e intuitivo

## 🛠️ Tecnologias Utilizadas

- **React 19** com TypeScript
- **Vite** para build e desenvolvimento
- **Axios** para requisições HTTP
- **CSS Grid e Flexbox** para layout responsivo
- **API LabelZoom** para conversão

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/GustQueiroz/pdftozpl
cd pdftozpl
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:5173](http://localhost:5173) no seu navegador

## 🔧 Como Usar

### 1. Upload de Arquivos
- Arraste e solte arquivos PDF ou PNG na área de upload
- Ou clique para selecionar múltiplos arquivos
- Tamanho máximo: 1MB por arquivo
- Suporte para conversão individual ou em lote

### 2. Configurações Avançadas (Opcional)
- **DPI**: Resolução da impressão (padrão: 203)
- **Rotação**: Rotacionar a imagem em graus
- **Escala**: Redimensionar em porcentagem
- **Modo de Cor**: Escala de cinza ou preto e branco
- **Escuridão**: Threshold para conversão de cor

### 3. Conversão
- **Individual**: Clique em "Converter para ZPL" para um arquivo
- **Em Lote**: Clique em "Converter X Arquivos" para múltiplos arquivos
- Aguarde o processamento com progresso em tempo real

### 4. Resultado
- **Individual**: Download automático do arquivo .txt
- **Em Lote**: Download automático do arquivo .zip com todos os arquivos
- **Progresso**: Visualização em tempo real do processamento
- **Resumo**: Estatísticas de sucesso e falhas

## 📋 Limitações da API

### Limitações Técnicas
- ✅ Tamanho máximo: 1MB
- ✅ Formatos: PDF e PNG
- ❌ Sem suporte a documentos multi-página
- ⚠️ Rate limiting aplicado

## 🎨 Interface

A aplicação possui uma interface moderna e responsiva com:

- **Design Gradiente**: Fundo com gradiente roxo/azul
- **Cards Elevados**: Interface em cards com sombras
- **Animações Suaves**: Transições e hover effects
- **Responsividade**: Funciona em desktop e mobile
- **Feedback Visual**: Estados de loading, erro e sucesso

## 🔌 API LabelZoom

Esta aplicação utiliza a [API LabelZoom](https://api.labelzoom.net/v2/api-docs) para conversão:

- **Base URL**: `https://api.labelzoom.net/v2`
- **Autenticação**: Bearer token (opcional)
- **Endpoints**:
  - `/convert/pdf-to-zpl`
  - `/convert/png-to-zpl`
  - `/convert/zpl-to-pdf`

## 🚀 Executáveis Rápidos

### 🎯 Script Principal (Recomendado)
- **`fix-and-run.bat`** - **Use este!** Corrige problemas e executa automaticamente

### 🔧 Scripts Alternativos
- **`fix-and-run.ps1`** - Versão PowerShell com verificações
- **`build-and-open.bat`** - Build completo + servidor de preview
- **`build-and-open-simple.bat`** - Build + arquivo HTML direto
- **`build-and-open.ps1`** - Script interativo com opções

### 📋 Como Usar
1. **Duplo clique** em `fix-and-run.bat` (recomendado)
2. Aguarde a instalação automática
3. A aplicação abrirá em http://localhost:5173

### 🔧 Solução de Problemas
Se der erro `crypto.hash is not a function`:
1. Execute `fix-and-run.bat` (corrige automaticamente)
2. Ou atualize o Node.js para versão 18.x+

> **Nota**: Para PowerShell, pode ser necessário executar: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── FileUpload.tsx      # Componente de upload
│   ├── AdvancedSettings.tsx # Configurações avançadas
│   └── ZplResult.tsx       # Exibição do resultado
├── services/
│   └── labelZoomApi.ts     # Serviço da API
├── types/
│   └── api.ts              # Tipos TypeScript
├── App.tsx                 # Componente principal
└── App.css                 # Estilos da aplicação
```

## 🚀 Build para Produção

```bash
npm run build
```

O build será gerado na pasta `dist/`.

## 📝 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature
3. Fazer commit das mudanças
4. Abrir um Pull Request

## 📞 Suporte

Para suporte com a API LabelZoom:
- [Documentação da API](https://api.labelzoom.net/v2/api-docs)
- [Portal de Suporte LabelZoom](https://labelzoom.net/support)

---

Desenvolvido com ❤️ usando React e TypeScript
