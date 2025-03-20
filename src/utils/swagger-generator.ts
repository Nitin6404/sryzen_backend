import { Schema } from 'joi';
import j2s from 'joi-to-swagger';

export enum SwaggerMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}

export interface SwaggerConfigOptions {
  title: string;
  description: string;
  version: string;
  basePath: string;
}

export class SwaggerGenerator {
  private static document: any = {
    openapi: '3.0.0',
    info: {
      title: '',
      description: '',
      version: '',
    },
    servers: [],
    paths: {},
    components: {
      schemas: {},
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  };

  static initialize(options: SwaggerConfigOptions) {
    this.document.info = {
      title: options.title,
      description: options.description,
      version: options.version,
    };
    this.document.servers = [
      {
        url: options.basePath,
        description: 'API Server',
      },
    ];
  }

  static addRoute(
    path: string,
    method: SwaggerMethod,
    {
      tags,
      summary,
      description,
      requestSchema,
      responseSchema,
      security = true,
    }: {
      tags: string[];
      summary: string;
      description: string;
      requestSchema?: Schema;
      responseSchema?: Schema;
      security?: boolean;
    },
  ) {
    const pathKey = path.replace(/:(\w+)/g, '{$1}');

    if (!this.document.paths[pathKey]) {
      this.document.paths[pathKey] = {};
    }

    const routeDoc: any = {
      tags,
      summary,
      description,
      responses: {
        '200': {
          description: 'Successful operation',
        },
      },
    };

    if (security) {
      routeDoc.security = [{ bearerAuth: [] }];
    }

    if (requestSchema) {
      const { swagger } = j2s(requestSchema);
      routeDoc.requestBody = {
        content: {
          'application/json': {
            schema: swagger,
          },
        },
      };
    }

    if (responseSchema) {
      const { swagger } = j2s(responseSchema);
      routeDoc.responses['200'].content = {
        'application/json': {
          schema: swagger,
        },
      };
    }

    this.document.paths[pathKey][method] = routeDoc;
  }

  static getDocument() {
    return this.document;
  }
}
