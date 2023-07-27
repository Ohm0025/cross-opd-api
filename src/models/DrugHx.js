module.exports = (sequelize, DataTypes) => {
  const DrugHx = sequelize.define(
    "DrugHx",
    {
      drugName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      drugSize: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      drugUse: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      diagnosis: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      type: {
        type: DataTypes.ENUM("regular", "underlying"),
        allowNull: false,
      },
    },
    { underscored: true }
  );

  DrugHx.associate = (db) => {
    DrugHx.belongsTo(db.UserPatient, {
      foreignKey: { name: "patientId" },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    DrugHx.belongsTo(db.CaseOrder, {
      foreignKey: { name: "caseId" },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return DrugHx;
};
