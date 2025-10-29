const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('reading_lists', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'blogs',
          key: 'id',
        },
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
    });
    await queryInterface.changeColumn('blogs', 'likes', {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('reading_lists');
    await queryInterface.changeColumn('blogs', 'likes', {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    });
  },
};