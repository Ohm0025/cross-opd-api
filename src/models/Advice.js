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
    Advice.hasOne(db.CaseOrder, {
      foreignKey: {
        name: "adviceId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Advice.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return Advice;
};
