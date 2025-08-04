# 📋 Instruções de Instalação - PDF para ZPL Converter

## 🚀 Instalação Rápida

### 1. Pré-requisitos
- **Node.js 18.x ou superior** (obrigatório)
- **Windows 10/11** (testado)

### 2. Instalação do Node.js
1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS** (recomendado)
3. Execute o instalador
4. Reinicie o computador após a instalação

### 3. Execução da Aplicação

#### Opção A: Script Automático (Recomendado)
1. **Duplo clique** em `fix-and-run.bat`
2. Aguarde a instalação automática
3. A aplicação abrirá em http://localhost:5173

#### Opção B: PowerShell (Alternativo)
1. **Clique direito** em `fix-and-run.ps1`
2. Selecione "Executar com PowerShell"
3. Se der erro, execute no PowerShell:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

#### Opção C: Manual (Avançado)
```bash
# Abra o CMD na pasta do projeto
npm install
npm run dev
```

## 🔧 Solução de Problemas

### Erro: "crypto.hash is not a function"
**Causa**: Versão antiga do Node.js
**Solução**: 
1. Desinstale o Node.js atual
2. Baixe a versão 18.x ou superior
3. Execute `fix-and-run.bat`

### Erro: "npm não é reconhecido"
**Causa**: Node.js não instalado corretamente
**Solução**:
1. Reinstale o Node.js
2. Reinicie o computador
3. Abra novo CMD e teste: `node --version`

### Erro: "Arquivo .env não encontrado"
**Solução**:
1. O script criará automaticamente
2. Edite o arquivo `.env` e adicione sua API key
3. Exemplo: `VITE_API_KEY=sua_chave_aqui`

### Erro: "Porta 5173 já em uso"
**Solução**:
1. Feche outros navegadores/aplicações
2. Ou aguarde alguns segundos
3. Acesse: http://localhost:5173 manualmente

## 📁 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `fix-and-run.bat` | **Script principal** - Use este! |
| `fix-and-run.ps1` | Script PowerShell alternativo |
| `.env` | Configuração da API key |
| `INSTRUCOES_INSTALACAO.md` | Este arquivo |

## 🆘 Suporte

### Se nada funcionar:
1. **Verifique a versão do Node.js**: `node --version`
2. **Reinstale o Node.js** se for versão < 18
3. **Execute como administrador** os scripts
4. **Desative antivírus** temporariamente
5. **Verifique firewall** do Windows

### Logs de Erro
Se houver erro, copie a mensagem completa e envie para suporte.

## ✅ Checklist de Instalação

- [ ] Node.js 18.x+ instalado
- [ ] Arquivo `.env` criado com API key
- [ ] Script `fix-and-run.bat` executado
- [ ] Aplicação abriu em http://localhost:5173
- [ ] Upload de arquivo funcionando
- [ ] Conversão funcionando

## 🎯 Pronto!

Após seguir estas instruções, você terá:
- ✅ Aplicação funcionando
- ✅ Conversão PDF/PNG → ZPL
- ✅ Conversão em lote
- ✅ Download automático
- ✅ Interface moderna

**Divirta-se usando a aplicação! 🚀** 