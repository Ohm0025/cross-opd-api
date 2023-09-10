module.exports = (sequelize, DataTypes) => {
  const Treatment = sequelize.define(
    "Treatment",
    {
      //{diag1:{title:"" , type:" " , detail:" " , diagName:" "} , diag2:{title:"" , type:" " , detail:" " , diagName:" "}}
      txList: {
        type: DataTypes.TEXT,
      },
    },
    { underscored: true }
  );
  Treatment.associate = (db) => {
    //asso caseId : Mandatory
    Treatment.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  };
  return Treatment;
};
