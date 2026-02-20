import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

/*
  Reflect Metadata example:

  Guardar
  Reflect.defineMetadata('chave', 'valor', MinhaClasse);

  Ler
  Reflect.getMetadata('chave', MinhaClasse); 
*/

/**
 * 
  Tudo manual, sem metadados
  class UserController {
    getUser(req: Request, res: Response) {
      res.json({ id: req.params.id });
    }
  }

  Registro manual da rota
  app.get('/users/:id', (req, res) => new UserController().getUser(req, res));
*/

//Decorator  →  escreve metadados via Reflect.defineMetadata()
//NestJS     →  lê esses metadados via Reflect.getMetadata() na inicialização
