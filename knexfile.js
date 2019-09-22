// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    useNullAsDefault: true,
    connection: {
      host: '127.0.0.1',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    }
  },
  production: {
    client: 'pg',
    useNullAsDefault: true,
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/db/migrations',
    },
  },
  testing: {
    client: 'pg',
    useNullAsDefault: true,
    connection: {
      filename: '127.0.0.1',
      user: process.env.TEST_DB_USER,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_NAME,
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    }
  }
};
