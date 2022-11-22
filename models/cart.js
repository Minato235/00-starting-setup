const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const cart = sequelize.define("cart", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull:false,
    primaryKey:true
  }
},
{
  timestamps: false,
}
)
module.exports=cart;