module.exports = (sequelize, DataTypes) => {
  const LabOrder = sequelize.define(
    "LabOrder",
    {
      labName: {
        type: DataTypes.STRING,
      },
      labStatus: {
        type: DataTypes.ENUM("pending", "complete"),
      },
      labImg: {
        type: DataTypes.STRING,
      },
      labDescript: {
        type: DataTypes.TEXT,
      },
    },
    { underscored: true }
  );

  LabOrder.associate = (db) => {
    LabOrder.hasOne(db.CaseOrder, {
      foreignKey: {
        name: "labOrderId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    LabOrder.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return LabOrder;
};
