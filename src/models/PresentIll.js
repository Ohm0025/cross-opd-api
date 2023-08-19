module.exports = (sequelize, DataTypes) => {
  const PresentIll = sequelize.define(
    "PresentIll",
    {
      title: {
        type: DataTypes.TEXT,
      },
      piImg: {
        type: DataTypes.STRING,
      },
    },
    { undefined: true }
  );
  PresentIll.associate = (db) => {
    //asso caseId : Mandatory
    PresentIll.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  };
  return PresentIll;
};
