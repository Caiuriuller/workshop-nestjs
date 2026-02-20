**Express (Node.js puro):**

```typescript
// Sem estrutura definida, tudo manual
app.get('/users', async (req, res) => {
  try { 
    const users = await db.query('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    res.status(505).json({ error: error.message });
  }
});

const db = new Database();
const usersRepository = new UsersRepository(db);
```

**Typescript**


```typescript
class UsersController {
  constructor(private readonly usersService: UsersService) {}

  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}

// Roteamento manual
const usersService = new UsersService();
const usersController = new UsersController(usersService);
```

**NestJS:**

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