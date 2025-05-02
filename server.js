const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require('mongoose');
const studentRoutes = require("./routes/student.routes");
const adminRoutes = require("./routes/admin.routes");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;
const Student = require('./models/student.model')

// db-connection start =================================
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Mongoose connected!'))
.catch((error) => console.log('Mongoose connection error:', error));
// db-connection done! ==============================



// routes student login


app.get('/',(req,res)=>{
    res.json({msg:'Server working fine'})
})

app.use("/student", studentRoutes);
app.use('/admin', adminRoutes);



app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
