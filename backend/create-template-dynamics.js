const fs = require('fs');
const path = require('path');

const projectName = process.argv[2];
console.log(projectName);

if (!projectName) {
    console.error('Usage: node create-template.js <project-name>');
    process.exit(1);
}

const baseDir = path.join(__dirname, "apps", projectName);


const firstLetterUpperCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const files = {
    '/src/main.ts': `
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ['nats://nats:4222'],
      },
    },
  );

  await app.listen();
  Logger.log(\`🚀 ${projectName} Service is running....\`);
}

bootstrap();

`,
    '.dockerignore': `
# Node modules and dependencies
node_modules
**/node_modules

# Local environment and configuration files
.env
.env.* 

# Logs
logs
*.log

# Build outputs
dist
**/dist

# Debug and IDE settings
.vscode
.idea

# System files
.DS_Store
Thumbs.db

# Test files and coverage
coverage
*.test.ts
*.spec.ts
jest.*
tests/

# Temporary files
*.swp
*.tmp
*.bak

# Docker files themselves
Dockerfile
.dockerignore

`,
    'Dockerfile': `
# Use Node.js base image
FROM node:20

# Set the working directory
WORKDIR /var/www

# Increase max-old-space-size to improve memory handling
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy only package.json and package-lock.json to leverage Docker caching
COPY package*.json ./

# Install root-level dependencies
RUN npm install

# Copy the entire workspace into the container
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application using nodemon with npx
CMD ["sh", "-c", "sleep 3 && npx nodemon --config apps/sample/nodemon.json"]

`,
    'eslint.config.js': `
const baseConfig = require('../../eslint.config.mjs');

module.exports = [...baseConfig];

`,
    'nodemon.json': `
{
  "watch": [
    "apps/${projectName}/src",
    "libs/dtos/src",
    "libs/entities/src",
    "libs/utils/src",
    "libs/validators/src",
    "libs/guards/src",
    "libs/types/src",
    "libs/config/src"
  ],
  "ext": "ts,json",
  "exec": "ts-node -r tsconfig-paths/register apps/${projectName}/src/main.ts",
  "legacyWatch": true,
  "ignore": [
    "dist/*",
    "node_modules/*",
    "logs/*",
    "*.log"
  ],
  "polling": true,
  "verbose": true
}

`,
    'tsconfig.app.json': `
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "declaration": false,
    "outDir": "../../dist/apps/${projectName}"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
}

`,
    'src/app/app.controller.ts': `
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ${firstLetterUpperCase(projectName)}Service } from './services/${projectName}.service';

@Controller()
export class AppController {
  constructor(private readonly ${projectName}Service: ${firstLetterUpperCase(projectName)}Service) {}

  @MessagePattern({ cmd: 'sample_test' })
  test(): string {
    return this.${projectName}Service.test();
  }
}


`,
    'src/app/app.module.ts': `
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ${firstLetterUpperCase(projectName)}Service } from './services/${projectName}.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [${firstLetterUpperCase(projectName)}Service],
})
export class AppModule {}


`,
    [`src/app/services/${projectName}.service.ts`]: `
export class ${firstLetterUpperCase(projectName)}Service{
  constructor() {}
  test(): string {
    return 'Hello World!';
  }
}

`,
};

for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(baseDir, filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content);
}

console.log(`✅ Project '${projectName}' template created.`);