module.exports = (sequelize, DataTypes) => {
  const LabOrder = sequelize.define(
    "LabOrder",
    {
      labArray: {
        type: DataTypes.TEXT,
      },
    },
    { underscored: true }
  );

  LabOrder.associate = (db) => {
    //asso caseId : mandatory
    LabOrder.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  };
  return LabOrder;
};
