const path = require('path');
const cors = require('cors');



const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');



const app = express();
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// db.execute("SELECT * FROM  products").then(res=>{
//     console.log(res);
// }).catch(err=>{}
//     console.log(err);
// })

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
sequelize.sync().then(res=>{
    console.log("Db Connected");
    app.listen(4000);

})
.catch(err=>{
    console.log("Db Error");
})
