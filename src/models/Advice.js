module.exports = (sequelize, DataTypes) => {
  const Advice = sequelize.define(
    "Advice",
    {
      detail: {
        type: DataTypes.TEXT,
      },
    },
    { underscored: true }
  );
  Advice.associate = (db) => {
    //asso caseId : mandatory
    Advice.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  };
  return Advice;
};
