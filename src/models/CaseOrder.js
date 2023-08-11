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
    //cc
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
    //pi
    CaseOrder.hasOne(db.PresentIll, {
      foreignKey: { name: "caseId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    CaseOrder.belongsTo(db.PresentIll, {
      foreignKey: { name: "presentillId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    //pe
    CaseOrder.hasOne(db.PhysicalExam, {
      foreignKey: { name: "caseId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    CaseOrder.belongsTo(db.PhysicalExam, {
      foreignKey: { name: "physicalExamId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    //img
    CaseOrder.hasOne(db.Imaging, {
      foreignKey: { name: "caseId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    CaseOrder.belongsTo(db.Imaging, {
      foreignKey: { name: "imgOrderId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    //lab
    CaseOrder.hasOne(db.LabOrder, {
      foreignKey: { name: "caseId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    CaseOrder.belongsTo(db.LabOrder, {
      foreignKey: { name: "labOrderId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    //treatment
    CaseOrder.hasOne(db.Treatment, {
      foreignKey: { name: "caseId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    CaseOrder.belongsTo(db.Treatment, {
      foreignKey: { name: "txId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    //diag
    CaseOrder.hasOne(db.Diagnosis, {
      foreignKey: { name: "caseId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    CaseOrder.belongsTo(db.Diagnosis, {
      foreignKey: { name: "diagId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    //detailDiag
    CaseOrder.hasOne(db.DetailDiag, {
      foreignKey: { name: "caseId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    CaseOrder.belongsTo(db.DetailDiag, {
      foreignKey: { name: "detailDiagId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    //follow
    CaseOrder.hasOne(db.FollowUp, {
      foreignKey: { name: "caseId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    CaseOrder.belongsTo(db.FollowUp, {
      foreignKey: { name: "followUpId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    //advice
    CaseOrder.hasOne(db.Advice, {
      foreignKey: { name: "caseId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    CaseOrder.belongsTo(db.Advice, {
      foreignKey: { name: "adviceId" },
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
