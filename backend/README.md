# 🚀 Setup: PM2 iniciando automaticamente no Windows

Este guia garante que a API Node gerenciada pelo PM2 inicie automaticamente ao ligar o PC.

---

## 1. Pré-requisitos

Confirme que o PM2 está instalado globalmente:

```bash
npm install -g pm2
```

Verifique a instalação:

```bash
pm2 -v
```

## 2. Buildar a API

Antes de iniciar a API com PM2, é crucial buildar o projeto para gerar os arquivos de produção. Geralmente, isso envolve um comando como:

```bash
npm run build
# ou
yarn build
```

Certifique-se de que este comando seja executado no diretório raiz do seu projeto e que ele gere os arquivos de saída (ex: `dist/main.js`) que serão usados pelo PM2.

## 3. Rodar a API com PM2 (modo base)

Dentro do projeto, utilize:

```bash
pm2 start ecosystem.config.cjs
```

ou diretamente:

```bash
pm2 start dist/main.js --name api
```

## 4. Salvar estado atual do PM2

Isso é **ESSENCIAL** para o `resurrect` funcionar:

```bash
pm2 save
```

Isso gera o arquivo:

`C:\Users\Usuario\.pm2\dump.pm2`

## 5. Criar tarefa no Windows (auto start no login)

Neste passo, você tem duas opções principais para criar a tarefa agendada, dependendo do nível de privilégio que deseja para o PM2. A escolha aqui afetará se você precisará de privilégios de Administrador para interagir com o PM2 (ex: `pm2 list`).

### Opção A: Rodar PM2 SEMPRE como Administrador (Com `pm2 list` exigindo Admin)

Esta opção é útil se suas aplicações Node.js precisam de privilégios elevados ou se você prefere sempre operar com o PM2 em modo Administrador. Com esta configuração, você precisará abrir o terminal como Administrador para executar comandos como `pm2 list`.

```bash
schtasks /create /tn "PM2 API" /tr "\"C:\Users\Usuario\AppData\Roaming\npm\pm2.cmd\" resurrect" /sc onlogon /rl highest
```

**Implicação:** O PM2 será iniciado com privilégios de Administrador. Para interagir com ele (ex: `pm2 list`, `pm2 stop`), você **sempre precisará abrir seu terminal como Administrador**.

### Opção B: Rodar PM2 como Usuário Comum (Com `pm2 list` funcionando sem Admin)

Esta é a opção mais comum e recomendada para a maioria das APIs, pois permite que você interaja com o PM2 a partir de um terminal normal, sem a necessidade de privilégios de Administrador. Para que isso funcione, o PM2 deve ser iniciado e salvo inicialmente como usuário comum.

**Primeiro, se você já criou a tarefa com `/rl highest`, remova-a:**

```bash
schtasks /delete /tn "PM2 API" /f
```

**Em seguida, crie a tarefa sem o parâmetro `/rl highest`:**

```bash
schtasks /create /tn "PM2 API" /tr "\"C:\Users\Usuario\AppData\Roaming\npm\pm2.cmd\" resurrect" /sc onlogon
```

**Importante:** Certifique-se de que o caminho `C:\Users\Usuario\AppData\Roaming\npm\pm2.cmd` está correto para a sua instalação do PM2. Você pode verificar com `where pm2`.

**Implicação:** O PM2 será iniciado com os privilégios do usuário logado. Para interagir com ele (ex: `pm2 list`, `pm2 stop`), você **poderá usar um terminal normal**, sem a necessidade de privilégios de Administrador. No entanto, o `pm2 start` e `pm2 save` iniciais também devem ser feitos como usuário comum para evitar conflitos.

## 6. Verificar se a task foi criada

```bash
schtasks /query /tn "PM2 API"
```

Status esperado:

`READY` (Pronto)

## 7. Teste manual (sem reiniciar PC)

Simule o comportamento de boot:

```bash
pm2 kill
```

Depois:

```bash
pm2 resurrect
pm2 list
```

Se aparecer a API `online` → está correto.

## 8. Fluxo real de funcionamento

Quando o Windows iniciar:

O Agendador de Tarefas (Task Scheduler) executa:

```bash
pm2 resurrect
```

O PM2 lê:

`C:\Users\Usuario\.pm2\dump.pm2`

Ele restaura todos os processos salvos.

## 9. Troubleshooting (se não iniciar)

Verificar se PM2 existe no `PATH`:

```bash
where pm2
```

Testar comando direto:

```bash
"C:\Users\Usuario\AppData\Roaming\npm\pm2.cmd" resurrect
```

Recriar estado salvo:

```bash
pm2 save
```

## 10. Comando de reset completo (se quebrar tudo)

```bash
pm2 kill
pm2 delete all
pm2 start ecosystem.config.cjs
pm2 save
```

### ✅ Resultado esperado

Após reiniciar o PC:

```bash
pm2 list
```

Saída esperada:

`api | online`
