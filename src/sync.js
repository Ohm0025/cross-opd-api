const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("database_crossOpd", "root", "Resident41", {
  host: "127.0.0.1",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

const UserDoctor = sequelize.define(
  "UserDoctor",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    mdId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
  },
  { underscored: true }
);

sequelize
  .sync()
  .then(() => {
    console.log("Book table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });
