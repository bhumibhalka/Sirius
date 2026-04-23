module.exports={
  development: {
    username: root,
    password: 857249,
    database: Sirius,
    host: localhost,
    dialect: `postgres`,
    dialectOptions: {
      ssl: {
        // require: true,
        rejectUnauthorized: false,
      }
    }
  },
  test: {
    username: root,
    password: null,
    database: database_test,
    host: localhost,
    dialect: `postgres`,
    dialectOptions: {
      ssl: {
        // require: true,
        rejectUnauthorized: false,
      }
    }
  },
  production: {
    username: root,
    password: null,
    database: database_production,
    host: localhost,
    dialect: `postgres`,
    dialectOptions: {
      ssl: {
        // require: true,
        rejectUnauthorized: false,
      }
    }
  }
}

