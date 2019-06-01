
module.exports = function(sequelize, Sequelize) {
 
    var Verification = sequelize.define('verification', {
 
      volunteerId: {
            primaryKey: true,
            type: Sequelize.STRING
        },
 
        verify_token : {
            type: Sequelize.STRING,
            allowNull: true
        },
 
        permalink: {
            type: Sequelize.STRING,
            allowNull: true
        },

        accountVerified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: true,
          set: function(value) {
            if (value === 'true') value = true;
            if (value === 'false') value = false;
            this.setDataValue('accountVerified', value);
          }
        },

        canPostTender: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: true,
          set: function(value) {
            if (value === 'true') value = true;
            if (value === 'false') value = false;
            this.setDataValue('canPostTender', value);
          }
        }
 
    });
 
    return Verification;
 
}