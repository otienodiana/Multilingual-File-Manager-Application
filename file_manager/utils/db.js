import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
});

const dbClient = {
  isAlive: () => sequelize.authenticate().then(() => true).catch(() => false),
  nbUsers: async () => {
    // Replace with actual query
    const [results] = await sequelize.query('SELECT COUNT(*) AS count FROM users');
    return results[0].count;
  },
  nbFiles: async () => {
    // Replace with actual query
    const [results] = await sequelize.query('SELECT COUNT(*) AS count FROM files');
    return results[0].count;
  },
};

export default dbClient;
