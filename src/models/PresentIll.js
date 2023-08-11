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
    PresentIll.hasOne(db.CaseOrder, {
      foreignKey: {
        name: "presentillId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    PresentIll.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return PresentIll;
};
