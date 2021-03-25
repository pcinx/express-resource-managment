const mongoose = require('mongoose')

const Schema = mongoose.Schema

const clientSchema = new Schema({    
    firstName:{type: String, required: true},
    lastName:{type: String, required: true},       
    email: {type: String, required: true},        
    contactNumber: {type: String, required: true},
    address: {type: String, required: true}
})

module.exports = mongoose.model('client',clientSchema,'clients')