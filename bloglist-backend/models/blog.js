const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Blog extends Model { }
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  author: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: new Date().getFullYear(),
    validate: {
      isInt: {
        msg: 'year must be an integer'
      },
      min: {
        args: 1991,
        msg: 'year must be greater than or equal to 1991'
      },
      isLessThanCurrentYear(value) {
        const currentYear = new Date().getFullYear()
        if (value > currentYear) {
          throw new Error('year must be less than or equal to current year')
        }
      },
    },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'blog',
});

module.exports = Blog;