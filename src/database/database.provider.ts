import knex, { Knex } from 'knex';

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

export const databaseProvider = {
  provide: KNEX_CONNECTION,
  useFactory: (): Knex => {
    const env = process.env.NODE_ENV ?? 'development';

    const configs: Record<string, Knex.Config> = {
      development: {
        client: 'better-sqlite3',
        connection: { filename: './dev.sqlite3' },
        useNullAsDefault: true,
        migrations: { directory: './src/database/migrations' },
      },
      test: {
        client: 'better-sqlite3',
        connection: { filename: ':memory:' },
        useNullAsDefault: true,
        migrations: { directory: './src/database/migrations' },
      },
      production: {
        client: 'better-sqlite3',
        connection: { filename: './prod.sqlite3' },
        useNullAsDefault: true,
        migrations: { directory: './dist/database/migrations' },
      },
    };

    return knex(configs[env] ?? configs.development);
  },
};
