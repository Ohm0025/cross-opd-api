module.exports = (sequelize, DataTypes) => {
  const FollowUp = sequelize.define("FollowUp", {
    fuHos: {
      type: DataTypes.STRING,
    },
    fuOPD: {
      type: DataTypes.STRING,
    },
    fuDetail: {
      type: DataTypes.TEXT,
    },
    fuDate: {
      type: DataTypes.DATEONLY,
    },
  });
  FollowUp.associate = (db) => {
    FollowUp.hasOne(db.CaseOrder, {
      foreignKey: {
        name: "followUpId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    FollowUp.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return FollowUp;
};
