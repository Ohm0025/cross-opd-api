module.exports = (sequelize, DataTypes) => {
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
      gender: {
        type: DataTypes.ENUM("MALE", "FEMALE"),
        allowNull: false,
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      mdId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isNumeric: true,
        },
      },
    },
    { underscored: true }
  );

  UserDoctor.associate = (db) => {
    UserDoctor.hasMany(db.CaseOrder, {
      foreignKey: { name: "doctorId" },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return UserDoctor;
};
