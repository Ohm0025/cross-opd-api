module.exports = (sequelize, DataTypes) => {
  const ChiefComplaint = sequelize.define(
    "ChiefComplaint",
    {
      title: {
        type: DataTypes.TEXT,
      },
    },
    { underscored: true }
  );
  ChiefComplaint.associate = (db) => {
    ChiefComplaint.hasOne(db.CaseOrder, {
      foreignKey: {
        name: "chiefComplaintId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    ChiefComplaint.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return ChiefComplaint;
};