module.exports = (sequelize, DataTypes) => {
  const Imaging = sequelize.define(
    "Imaging",
    {
      imgArray: {
        type: DataTypes.TEXT,
      },
    },
    { underscored: true }
  );
  Imaging.associate = (db) => {
    //asso caseId : Mandatory
    Imaging.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  };
  return Imaging;
};
