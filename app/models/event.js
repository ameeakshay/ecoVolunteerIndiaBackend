
module.exports = function(sequelize, Sequelize) {
 
    var Event = sequelize.define('event', {
 
        eventId: {
            primaryKey: true,
            type: Sequelize.STRING
        },
 
        eventName: {
            type: Sequelize.STRING,
            unique: true
        },
 
        eventDate: {
            type: Sequelize.DATE,
            allowNull: true
        },

        eventDescription: {
            type: Sequelize.STRING,
            allowNull: false
        },

        noOfVolsReq: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        noOfVolsReg: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        eventStatus: {
            type: Sequelize.STRING,
            allowNull: false
        }
 
    });
 
    return Event;
 
}