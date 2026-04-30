import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeName } from 'swagger-themes';

export class Swagger {
  static setup(app) {
    const defaultThemeSwagger = process.env.SWAGGER_THEME || 'dark';
    const theme = new SwaggerTheme();

    const config = new DocumentBuilder()
      .setTitle('Curupira')
      .setDescription('Api voltada para o sistema curupira.')
      .setVersion('1.0')
      .addTag('Aqui vamos gerenciar as rotas da aplicação.')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'access-token',
      )
      .build();

    const optionsTheme = {
      explorer: true,
      customCss: theme.getBuffer(defaultThemeSwagger as SwaggerThemeName),
      swaggerOptions: {
        persistAuthorization: true,
      }
    };

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, optionsTheme);
  }
}
