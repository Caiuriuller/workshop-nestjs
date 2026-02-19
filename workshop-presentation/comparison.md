**Express (Node.js puro):**

Quais problemas abaixo?

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
```

**NestJS:**

Quais vantagens abaixo?
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