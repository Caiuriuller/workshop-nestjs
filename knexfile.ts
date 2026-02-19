import type { Knex } from 'knex';

const config: Record<string, Knex.Config> = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: './dev.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/database/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/database/seeds',
      extension: 'ts',
    },
  },

  test: {
    client: 'better-sqlite3',
    connection: {
      filename: ':memory:',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/database/migrations',
      extension: 'ts',
    },
  },

  production: {
    client: 'better-sqlite3',
    connection: {
      filename: './prod.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './dist/database/migrations',
    },
  },
};

export default config;
