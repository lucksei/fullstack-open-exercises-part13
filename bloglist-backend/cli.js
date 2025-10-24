require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL);

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established sucessfully.');
    const notes = await sequelize.query("SELECT * FROM blogs;", { type: sequelize.QueryTypes.SELECT })
    console.log(notes)
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

main();
