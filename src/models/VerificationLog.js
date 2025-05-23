'use strict';

module.exports = (sequelize, DataTypes) => {
  const VerificationLog = sequelize.define('VerificationLog', {
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {});
  
  VerificationLog.associate = function(models) {
    // A verification log belongs to a product
    VerificationLog.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
    
    // A verification log can be associated with a verification code
    VerificationLog.belongsTo(models.VerificationCode, {
      foreignKey: 'verificationCodeId',
      as: 'verificationCode'
    });
  };
  
  return VerificationLog;
};