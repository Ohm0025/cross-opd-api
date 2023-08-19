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
    //asso caseId : mandatory
    PhysicalExam.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  };
  return PhysicalExam;
};
