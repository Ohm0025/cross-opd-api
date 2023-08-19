module.exports = (sequelize, DataTypes) => {
  const UserPatient = sequelize.define(
    "UserPatient",
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
      citizenId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isThaiID(value) {
            if (value.length !== 13) {
              throw new Error("Invalid Thai citizen ID");
            }
          },
        },
      },
    },
    { underscored: true }
  );
  UserPatient.associate = (db) => {
    UserPatient.hasMany(db.CaseOrder, {
      foreignKey: {
        name: "patientId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });

    UserPatient.hasOne(db.WaitCase, {
      foreignKey: {
        name: "patientId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  };
  return UserPatient;
};
