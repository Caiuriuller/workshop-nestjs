# Decorators no NestJS

## O que é um Decorator?

Um decorator é uma **função que envolve outra função, método, classe ou propriedade** para adicionar comportamento ou metadados a ela — sem modificar o código original.

No TypeScript, decorators são identificados pelo `@` antes do nome:

```typescript
@Injectable()
export class UsersService {}
```

> Analogia simples: um decorator é como uma **etiqueta**. Você cola a etiqueta `@Injectable` numa classe, e o NestJS sabe que ela pode ser injetada em outros lugares. A classe em si não muda — a etiqueta é que comunica a intenção.

---

## Como funciona por baixo

O TypeScript compila decorators usando a API de **`Reflect.metadata`** — uma forma de gravar e ler metadados em classes e métodos em tempo de execução.

```typescript
// o que você escreve
@Controller('users')
export class UsersController {}

// o que acontece por baixo (simplificado)
Reflect.defineMetadata('path', 'users', UsersController);
```

Quando a aplicação sobe, o NestJS **lê todos esses metadados** e usa para:
- Saber quais classes são controllers, providers ou módulos
- Mapear rotas HTTP para métodos
- Montar o grafo de dependências para injeção

---

## Os principais decorators do NestJS

### De classe

```typescript
@Module({ ... })       // define um módulo
@Controller('rota')    // define um controller e seu prefixo de rota
@Injectable()          // marca a classe como injetável (service, guard, pipe...)
```

### De método (dentro de controllers)

```typescript
@Get(':id')            // mapeia GET /rota/:id
@Post()                // mapeia POST /rota
@Put(':id')            // mapeia PUT /rota/:id
@Delete(':id')         // mapeia DELETE /rota/:id
@Patch(':id')          // mapeia PATCH /rota/:id
```

### De parâmetro (argumentos do método)

```typescript
@Param('id')           // extrai parâmetro da URL  → /users/42
@Body()                // extrai o corpo da requisição
@Query('page')         // extrai query string       → ?page=1
@Headers('auth')       // extrai um header específico
```

### Exemplo completo

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query('page') page: string) {
    return this.usersService.findAll(+page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

---

## Como o NestJS interpreta na inicialização

```
1. NestFactory.create(AppModule)
        ↓
2. Lê @Module — descobre controllers e providers declarados
        ↓
3. Lê @Controller — registra o prefixo de rota da classe
        ↓
4. Lê @Get, @Post... — mapeia cada método a uma rota HTTP
        ↓
5. Lê @Injectable — registra o provider no container IoC
        ↓
6. Resolve dependências via construtores e injeta automaticamente
```

Tudo isso acontece **uma única vez no bootstrap** — depois disso a aplicação está pronta para receber requisições.

---

## Resumo

Decorators são a **linguagem declarativa do NestJS**. Em vez de configurar rotas, registrar serviços e mapear dependências de forma imperativa (como no Express), você declara a intenção com `@` e o framework faz o trabalho de orquestração. É o que torna o código NestJS tão legível e previsível.