module.exports = (sequelize, DataTypes) => {
  const WaitCase = sequelize.define(
    "WaitCase",
    {
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.ENUM("waiting", "inprogress"),
        allowNull: false,
        defaultValue: "waiting",
      },
      chiefComplaintFirst: {
        type: DataTypes.TEXT,
      },
      presentIllnessFirst: {
        type: DataTypes.TEXT,
      },
    },
    { underscored: true }
  );

  WaitCase.associate = (db) => {
    WaitCase.belongsTo(db.UserPatient, {
      foreignKey: {
        name: "patientId",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return WaitCase;
};