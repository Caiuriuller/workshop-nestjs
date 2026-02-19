# `@Module` no NestJS

## O que é um Module?

O `@Module` é o decorator central de organização do NestJS. Ele transforma uma classe TypeScript em um **módulo**, que é a unidade básica de encapsulamento da aplicação.

Pense no módulo como uma **caixa fechada** que declara:
- O que ela oferece para o mundo externo
- O que ela precisa do mundo externo
- Quem são seus controllers e providers internos

> Inspirado diretamente no `@NgModule` do Angular, o sistema de módulos do NestJS resolve o problema de organização em projetos grandes: **sem módulos, tudo acessa tudo e o código vira caos**.

---

## Anatomia do `@Module`

```typescript
@Module({
  imports: [],    // módulos externos que este módulo precisa
  controllers: [], // quem recebe as requisições HTTP
  providers: [],  // services, repositories, guards, etc.
  exports: [],    // o que este módulo expõe para outros
})
export class UserModule {}
```

### Cada propriedade em detalhe

| Propriedade | O que declara | Obrigatório |
|---|---|---|
| `imports` | Módulos externos cujos exports este módulo precisa | Não |
| `controllers` | Classes com `@Controller` que pertencem a este módulo | Não |
| `providers` | Classes com `@Injectable` (services, guards, pipes...) | Não |
| `exports` | Subset de `providers` que outros módulos podem usar | Não |

---

## Exemplo 1 — Módulo Simples

O caso mais básico: um módulo com um controller e um service.

```typescript
// users/users.service.ts
@Injectable()
export class UsersService {
  private users = [{ id: 1, name: 'Caiuri' }];

  findAll() {
    return this.users;
  }
}
```

```typescript
// users/users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
```

```typescript
// users/users.module.ts
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

> `UsersService` está declarado em `providers`, então o NestJS sabe que precisa criá-lo e injetá-lo onde for solicitado — dentro deste módulo.

---

## Exemplo 2 — Importando outro Módulo

`UsersModule` precisa enviar e-mail ao criar um usuário. `EmailService` vive no `EmailModule`. Para usar, é preciso **importar o módulo** e **exportar o service**.

```typescript
// email/email.service.ts
@Injectable()
export class EmailService {
  send(to: string, subject: string) {
    console.log(`Enviando e-mail para ${to}: ${subject}`);
  }
}
```

```typescript
// email/email.module.ts
@Module({
  providers: [EmailService],
  exports: [EmailService], // ← torna disponível para quem importar este módulo
})
export class EmailModule {}
```

```typescript
// users/users.module.ts
@Module({
  imports: [EmailModule], // ← importa o módulo
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

```typescript
// users/users.service.ts
@Injectable()
export class UsersService {
  constructor(
    private readonly emailService: EmailService, // ← funciona porque EmailModule foi importado
  ) {}

  create(dto: CreateUserDto) {
    // lógica de criação...
    this.emailService.send(dto.email, 'Bem-vindo!');
  }
}
```

> **Regra importante:** se `EmailModule` não exportasse `EmailService`, o NestJS lançaria um erro na inicialização: `Nest can't resolve dependencies of UsersService`. O encapsulamento é real.

---

## Exemplo 3 — AppModule (Módulo Raiz)

Todo projeto NestJS tem um módulo raiz que é o ponto de entrada. Ele normalmente apenas **agrega os outros módulos**.

```typescript
// app.module.ts
@Module({
  imports: [
    UsersModule,
    EmailModule,
    AuthModule,
    DatabaseModule,
  ],
})
export class AppModule {}
```

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

> O `AppModule` raramente tem `providers` ou `controllers` próprios. Ele é o **orquestrador** — conhece todos os módulos da aplicação e deixa o NestJS montar o grafo de dependências.

---

## Exemplo 4 — Módulo Global

Alguns providers precisam estar disponíveis em toda a aplicação sem precisar importar o módulo em todo lugar — como configuração, logger ou banco de dados.

```typescript
// database/database.module.ts
@Global() // ← torna o módulo global
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
```

```typescript
// app.module.ts — importa UMA VEZ só aqui
@Module({
  imports: [DatabaseModule, UsersModule, OrdersModule],
})
export class AppModule {}
```

```typescript
// orders/orders.service.ts
@Injectable()
export class OrdersService {
  constructor(
    private readonly db: DatabaseService, // ← funciona sem importar DatabaseModule
  ) {}
}
```

> Use `@Global()` com moderação. Facilita o acesso, mas reduz a visibilidade de onde as dependências vêm. Bons candidatos: `ConfigModule`, `DatabaseModule`, `LoggerModule`.

---

## Exemplo 5 — Módulo Dinâmico

Quando o módulo precisa ser configurado com valores externos (ex: credenciais, URLs), usa-se o padrão de módulo dinâmico com `forRoot()` ou `register()`.

```typescript
// mailer/mailer.module.ts
@Module({})
export class MailerModule {
  static forRoot(options: MailerOptions): DynamicModule {
    return {
      module: MailerModule,
      providers: [
        {
          provide: 'MAILER_OPTIONS',
          useValue: options,
        },
        MailerService,
      ],
      exports: [MailerService],
    };
  }
}
```

```typescript
// app.module.ts
@Module({
  imports: [
    MailerModule.forRoot({
      host: 'smtp.gmail.com',
      port: 587,
      user: process.env.MAIL_USER,
    }),
  ],
})
export class AppModule {}
```

> Este padrão é exatamente o que bibliotecas como `@nestjs/typeorm`, `@nestjs/jwt` e `@nestjs/config` usam. Quando você escreve `TypeOrmModule.forRoot({ ... })`, é um módulo dinâmico por baixo.

---

## Fluxo Visual: Como os Módulos se Conectam

```
AppModule
├── imports: [UsersModule, OrdersModule, DatabaseModule*]
│
├── UsersModule
│   ├── imports: [EmailModule]
│   ├── controllers: [UsersController]
│   └── providers: [UsersService]
│
├── OrdersModule
│   ├── controllers: [OrdersController]
│   └── providers: [OrdersService]
│
├── EmailModule
│   ├── providers: [EmailService]
│   └── exports: [EmailService]  ← disponível para UsersModule
│
└── DatabaseModule (@Global)
    ├── providers: [DatabaseService]
    └── exports: [DatabaseService]  ← disponível para TODOS
```

---

## Boas Práticas

**Organize por domínio, não por tipo**

```
// ❌ organização por tipo — difícil de escalar
src/
  controllers/
    users.controller.ts
    orders.controller.ts
  services/
    users.service.ts
    orders.service.ts

// ✅ organização por domínio — módulos coesos
src/
  users/
    users.module.ts
    users.controller.ts
    users.service.ts
  orders/
    orders.module.ts
    orders.controller.ts
    orders.service.ts
```

**Exporte apenas o necessário**

Um módulo não precisa exportar tudo que declara como provider. Exporte somente o que outros módulos realmente precisam — isso mantém o encapsulamento.

**Use `nest generate module` para criar módulos**

```bash
nest g module users
nest g controller users
nest g service users
```

O CLI cria a estrutura e já registra automaticamente o módulo no `AppModule`.

---

## Resumo

O `@Module` resolve um problema fundamental de qualquer sistema que cresce: **como delimitar fronteiras entre partes do código**. Com `imports`, `exports`, `providers` e `controllers`, cada módulo comunica explicitamente suas dependências e o que oferece — tornando o sistema previsível, testável e fácil de navegar independente do tamanho do time.