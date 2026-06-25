# Workshop NestJS

> Duração total: ~75 minutos · Multiplier · Fevereiro 2026

---

## Parte 1 — Teoria `20 min`

| Tópico | Referência |
|--------|------------|
| O que é? (Node e Nest) | — |
| Diferença: Node x Nest | — |
| Criação do framework | — |
| Inspiração no Angular (o que foi copiado) | — |
| Quais problemas ele resolve? | [problemas-resolvidos.md](./problemas-resolvidos.md) |
| Quando NestJS leva vantagem | — |
| Quando NestJS não leva vantagem | — |

---

## Parte 2 — Fundamentos `30 min`

| Tópico | Código |
|--------|--------|
| Reflect Metadata & Decorators | [app.controller.ts](../src/app.controller.ts) |
| Controllers | [app.controller.ts](../src/app.controller.ts) |
| Providers | [task.service.ts](../src/task/task.service.ts) |
| Modules | [app.module.ts](../src/app.module.ts) |
| Dependency Injection | [task.controller.ts](../src/task/task.controller.ts) |
| Express vs TypeScript vs NestJS | [comparison.md](./comparison.md) |
| Middleware | — |
| Guard | [auth.guard.ts](../src/auth/auth.guard.ts) |
| Interceptors | — |
| Pipe | [main.ts](../src/main.ts) |

---

## Parte 3 — Container IoC `5 min`

- Como funciona o container IoC — [main.ts](../src/main.ts)
- Analogias com outras tecnologias (Spring, Angular, .NET)
- É possível rodar um container IoC em Node.js puro?

---

## Parte 4 — Nice Stuff `5 min`

- Swagger integrado — setup em [main.ts](../src/main.ts) · uso em [task.controller.ts](../src/task/task.controller.ts)
- CLI (`@nestjs/cli`) — geração de módulos, controllers e services
- Suporte nativo a diferentes tecnologias (GraphQL, WebSockets, microserviços)

---

## Parte 5 — NestJS em 2026 `15 min`

- TypeScript + IA
- SDD (Schema-Driven Development)
