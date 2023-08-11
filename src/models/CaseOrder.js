module.exports = (sequelize, DataTypes) => {
  const CaseOrder = sequelize.define(
    "CaseOrder",
    {
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.ENUM("pending", "finish"),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("followUp", "regular", "underly"),
        defaultValue: "regular",
      },
    },
    { underscored: true }
  );

  CaseOrder.associate = (db) => {
    CaseOrder.hasOne(db.ChiefComplaint, {
      foreignKey: { name: "caseId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    CaseOrder.belongsTo(db.ChiefComplaint, {
      foreignKey: { name: "chiefComplaintId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    CaseOrder.belongsTo(db.UserDoctor, {
      foreignKey: {
        name: "doctorId",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    CaseOrder.belongsTo(db.UserPatient, {
      foreignKey: {
        name: "patientId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    CaseOrder.hasMany(db.DrugHx, {
      foreignKey: { name: "caseId", allowNull: false },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return CaseOrder;
};
