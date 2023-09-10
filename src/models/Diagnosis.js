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
    //asso caseId : Mandatory
    Diagnosis.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  };
  return Diagnosis;
};
