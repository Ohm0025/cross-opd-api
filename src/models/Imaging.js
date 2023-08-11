module.exports = (sequelize, DataTypes) => {
  const Imaging = sequelize.define(
    "Imaging",
    {
      imgName: {
        type: DataTypes.STRING,
      },
      imgStatus: {
        type: DataTypes.ENUM("pending", "complete"),
      },
      imgImg: {
        type: DataTypes.STRING,
      },
      imgDescript: {
        type: DataTypes.TEXT,
      },
    },
    { underscored: true }
  );
  Imaging.associate = (db) => {
    Imaging.hasOne(db.CaseOrder, {
      foreignKey: {
        name: "imgOrderId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Imaging.belongsTo(db.CaseOrder, {
      foreignKey: {
        name: "caseId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return Imaging;
};
