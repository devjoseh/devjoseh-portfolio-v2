---
description: Gera mensagem de commit e descrição de pull request baseado nas mudanças do projeto
---

# Workflow: Commit e Pull Request

Este workflow analisa as mudanças no projeto e gera mensagens de commit e descrição de pull request formatadas.

## Passos

### 1. Análise das Mudanças

Primeiro, analise o estado atual do repositório para identificar as mudanças:

```bash
git status
git diff --staged
```

Se não houver mudanças staged, verifique as mudanças não staged:

```bash
git diff
```

### 2. Identificar Arquivos Alterados

Liste todos os arquivos que foram modificados, adicionados ou removidos:

```bash
git diff --name-status
```

Para ver as mudanças staged:

```bash
git diff --staged --name-status
```

### 3. Analisar o Contexto das Mudanças

Examine os arquivos alterados para entender:
- Qual funcionalidade foi modificada/adicionada/removida
- Se é uma correção de bug, nova feature, refatoração, etc.
- Quais componentes/módulos foram afetados

### 4. Gerar nome para nova branch

Faça isso apenas se o usuario não comentar que já existe uma branch criada. Com base na analise, crie um novo nome para uma nova branch que receberá o pull request. Algo como, por exemplo, dev/14

### 4. Gerar Mensagem de Commit

Com base na análise, crie uma mensagem de commit clara e concisa seguindo as convenções:
- Use verbos no imperativo (ex: "Add", "Fix", "Update", "Refactor")
- Seja específico sobre o que foi alterado
- Limite a primeira linha a ~50-72 caracteres
- Em inglês

**Formato:**
```
<tipo>: <descrição breve>
```

**Tipos comuns:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `refactor`: Refatoração de código
- `style`: Mudanças de estilo/formatação
- `docs`: Documentação
- `chore`: Tarefas de manutenção
- `test`: Testes

### 5. Gerar Descrição do Pull Request (em português)

Crie a descrição do pull request seguindo este template:

```bash
## Descrição
[Descrição detalhada do que foi alterado e por quê. Explique o contexto e a motivação para as mudanças.]

## Mudanças
- [Liste cada mudança significativa]
- [Use bullets para cada item]
- [Seja específico sobre arquivos e funcionalidades afetadas]

## Visual
[Aqui o usuário irá anexar screenshots do que foi feito]
```

**IMPORTANTE - Links para arquivos:**
- Ao referenciar arquivos do projeto na descrição do PR, SEMPRE use paths RELATIVOS do repositório
- Formato correto: `[nome-arquivo](caminho/relativo/arquivo.ext)` ou apenas `caminho/relativo/arquivo.ext`
- ❌ NUNCA use: `file:///caminho/absoluto/...` ou paths com `C:\Users\...`
- ✅ Exemplo correto: `[formatters.ts](src/content/utils/formatters.ts)`
- ✅ Exemplo correto: `src/content/components/CardComponent.tsx`
- Os links relativos funcionarão corretamente no GitHub para navegação no código

### 6. Adicionar Referência à Issue (Opcional)

Se o pull request estiver relacionado a uma issue específica, pergunte ao usuário:

**"Este PR está relacionado a alguma issue? Se sim, qual o número?"**

Se sim, adicione ao final da descrição do PR:

```bash
Closes #<número_da_issue>
```

### 7. Apresentar Resultado

Apresente ao usuário:

1. **Mensagem de Commit:**
```bash
git commit -m "mensagem gerada"
```

2. **Descrição do Pull Request:**
```bash
[Template completo preenchido]
```

### 9. Regras

- O commit e pr sempre será feito pelo proprio usuario

## Notas

- Sempre revise as mudanças antes de gerar as mensagens
- Adapte o nível de detalhe baseado na complexidade das mudanças
- Para múltiplas mudanças não relacionadas, sugira commits separados
- Lembre o usuário de adicionar screenshots na seção "Visual" do PR