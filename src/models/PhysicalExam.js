module.exports = (sequelize, DataTypes) => {
  const PhysicalExam = sequelize.define(
    "PhysicalExam",
    {
      examManual: {
        type: DataTypes.TEXT,
      },
      examTemplate: {
        type: DataTypes.TEXT,
      },
      examImg: {
        type: DataTypes.STRING,
      },
    },
    { underscored: true }
  );
  PhysicalExam.associate = (db) => {
    PhysicalExam.hasOne(db.CaseOrder, {
      foreignKey: {
        name: "physicalExamId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    PhysicalExam.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return PhysicalExam;
};
