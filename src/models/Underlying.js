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
    },
    {
      underscored: true,
    }
  );

  Underlying.associate = (db) => {
    Underlying.belongsTo(db.UserPatient, {
      foreignKey: { name: "patientId" },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Underlying.belongsTo(db.CaseOrder, {
      foreignKey: { name: "caseId" },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return Underlying;
};
