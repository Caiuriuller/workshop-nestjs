# Express vs TypeScript vs NestJS

Uma comparação direta de como o mesmo endpoint de listagem de usuários é implementado em cada abordagem.

---

## Express (Node.js puro)

Sem estrutura definida — roteamento, injeção de dependência e tratamento de erros são responsabilidade do desenvolvedor.

```typescript
app.get('/users', async (req, res) => {
  try { 
    const users = await db.query('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const db = new Database();
const usersRepository = new UsersRepository(db);
```

---

## TypeScript (sem framework)

Tipagem e orientação a objetos, mas o roteamento e a instanciação de dependências ainda são manuais.

```typescript
class UsersController {
  constructor(private readonly usersService: UsersService) {}

  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}

const usersService = new UsersService();
const usersController = new UsersController(usersService);
```

---

## NestJS

Decorators, injeção de dependência e roteamento gerenciados pelo framework — o código expressa só a intenção.

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }
}
```

> O container IoC do NestJS instancia e injeta `UsersService` automaticamente — zero configuração manual.
