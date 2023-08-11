// module.exports = (sequelize, DataTypes) => {
//   const Presentill = sequelize.define(
//     "Presentill",
//     {
//       title: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//         validate: { notEmpty: true },
//       },
//       piImg: {
//         type: DataTypes.STRING,
//       },
//     },
//     { underscored: true }
//   );
//   Presentill.associate = (db) => {
//     Presentill.hasOne(db.CaseOrder, {
//       foreignKey: {
//         name: "presentillid",
//         allowNull: false,
//       },
//       onDelete: "RESTRICT",
//       onUpdate: "RESTRICT",
//     });
//   };
//   return Presentill;
// };
