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
      type: DataTypes.STRING,
    },
  });
  FollowUp.associate = (db) => {
    //asso caseId : Mandatory
    FollowUp.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  };
  return FollowUp;
};
