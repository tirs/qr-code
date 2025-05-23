'use strict';

module.exports = (sequelize, DataTypes) => {
  const VerificationCode = sequelize.define('VerificationCode', {
    code: {
      type: DataTypes.STRING(16),
      allowNull: false,
      validate: {
        len: [16, 16],
        isAlphanumeric: true
      }
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    usedBy: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {});
  
  VerificationCode.associate = function(models) {
    // A verification code belongs to a product
    VerificationCode.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
    
    // A verification code has many verification logs
    VerificationCode.hasMany(models.VerificationLog, {
      foreignKey: 'verificationCodeId',
      as: 'verificationLogs'
    });
  };
  
  // Class method to verify a code by its last 4 digits
  VerificationCode.verifyByLastFourDigits = async function(productId, lastFourDigits) {
    const code = await this.findOne({
      where: {
        productId,
        code: {
          [sequelize.Op.like]: `%${lastFourDigits}`
        },
        isUsed: false
      }
    });
    
    return code;
  };
  
  return VerificationCode;
};