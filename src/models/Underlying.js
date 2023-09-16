module.exports = (sequelize, DataTypes) => {
  const Underlying = sequelize.define(
    "Underlying",
    {
      detail: {
        type: DataTypes.TEXT,
      },
      diseaseName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      treatmentList: {
        type: DataTypes.TEXT,
      },
      followUp: {
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
    }
  );

  Underlying.associate = (db) => {
    Underlying.belongsTo(db.UserPatient, {
      foreignKey: { name: "patientId", allowNull: false },
      onDelete: "CASCADE",
    });
    Underlying.belongsTo(db.UserDoctor, {
      foreignKey: { name: "doctorId", allowNull: false },
      onDelete: "CASCADE",
    });
  };
  return Underlying;
};
