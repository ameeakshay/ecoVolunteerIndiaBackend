
module.exports = function(sequelize, Sequelize) {
 
    var VolEventMap = sequelize.define('volEventMap', {
 
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true
        }
 
    });
 
    return VolEventMap;
 
}