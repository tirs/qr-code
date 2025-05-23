'use strict';

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    }
  }, {});
  
  Product.associate = function(models) {
    // A product has many verification codes
    Product.hasMany(models.VerificationCode, {
      foreignKey: 'productId',
      as: 'verificationCodes',
      onDelete: 'CASCADE'
    });
  };
  
  return Product;
};