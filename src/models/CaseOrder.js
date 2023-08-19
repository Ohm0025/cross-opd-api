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
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
    });

    //pi
    CaseOrder.hasOne(db.PresentIll, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
    });

    //pe
    CaseOrder.hasOne(db.PhysicalExam, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
    });

    //img
    CaseOrder.hasOne(db.Imaging, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
    });

    //lab
    CaseOrder.hasOne(db.LabOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
    });

    //diag : Mandatory
    CaseOrder.hasMany(db.Diagnosis, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
    });

    //detailDiag
    CaseOrder.hasOne(db.DetailDiag, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
    });

    //follow
    CaseOrder.hasOne(db.FollowUp, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
    });

    //advice
    CaseOrder.hasOne(db.Advice, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
    });

    //asso UserDoctor (fk in caseOrder) : Mandatory
    CaseOrder.belongsTo(db.UserDoctor, {
      foreignKey: {
        name: "doctorId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
    //asso UserPatient (fk in caseOrder) : Mandatory
    CaseOrder.belongsTo(db.UserPatient, {
      foreignKey: {
        name: "patientId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  };
  return CaseOrder;
};
