module.exports = (sequelize, DataTypes) => {
  const ChiefComplaint = sequelize.define(
    "ChiefComplaint",
    {
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true },
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
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return ChiefComplaint;
};
