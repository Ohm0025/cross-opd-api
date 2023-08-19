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
    Treatment.belongsTo(db.Diagnosis, {
      foreignKey: {
        name: "diagId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  };
  return Treatment;
};
