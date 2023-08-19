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
    //asso caseOrder : mandatory
    ChiefComplaint.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  };
  return ChiefComplaint;
};
