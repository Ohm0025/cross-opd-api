module.exports = (sequelize, DataTypes) => {
  const Diagnosis = sequelize.define(
    "Diagnosis",
    {
      diagName: {
        type: DataTypes.STRING,
      },
    },
    { underscored: true }
  );
  Diagnosis.associate = (db) => {
    Diagnosis.hasOne(db.CaseOrder, {
      foreignKey: {
        name: "diagId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Diagnosis.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Diagnosis.belongsTo(db.Treatment, {
      foreignKey: {
        name: "txId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return Diagnosis;
};
