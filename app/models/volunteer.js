
module.exports = function(sequelize, Sequelize) {
 
    var Volunteer = sequelize.define('volunteer', {
 
        volunteerId: {
            primaryKey: true,
            type: Sequelize.STRING
        },
 
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            },
            unique: true
        },
 
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },

        volunteerName: {
            type: Sequelize.STRING,
            allowNull: false
        },

        phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false
        },

        bio: {
            type: Sequelize.STRING,
            allowNull: false
        },

        occupation: {
            type: Sequelize.STRING,
            allowNull: false
        }
 
    });
 
    return Volunteer;
 
}