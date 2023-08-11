module.exports = (sequelize, DataTypes) => {
  const Treatment = sequelize.define(
    "Treatment",
    {
      txTitle: {
        type: DataTypes.STRING,
      },
      txType: {
        type: DataTypes.ENUM("drug", "proceduce", "other"),
      },
      txDetail: {
        type: DataTypes.STRING,
      },
    },
    { underscored: true }
  );
  Treatment.associate = (db) => {
    Treatment.hasOne(db.Diagnosis, {
      foreignKey: {
        name: "txId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return Treatment;
};
