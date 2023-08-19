module.exports = (sequelize, DataTypes) => {
  const DetailDiag = sequelize.define(
    "DetailDiag",
    {
      detail: {
        type: DataTypes.TEXT,
      },
    },
    { underscored: true }
  );

  DetailDiag.asssociate = (db) => {
    //asso caseId : Mandatory
    DetailDiag.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  };
  return DetailDiag;
};
