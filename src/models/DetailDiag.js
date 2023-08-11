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
    DetailDiag.hasOne(db.CaseOrder, {
      foreignKey: {
        name: "detailDiagId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    DetailDiag.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return DetailDiag;
};
