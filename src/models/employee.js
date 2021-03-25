const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SingleValueValidator = require('../validators/SingleValueValidator');
const employeeSchema = new Schema({    
    firstName:{type: String, required: true},
    lastName:{type: String, required: true},    
    userName: {type: String, required: true},
    email: {type: String, required: true},    
    password: {type: String, required: true},
    contactNumber: {type: String, required: true},
    address: {type: String, required: true},
    designation: { type: String, default: "Not Assigned", validate: (v) => SingleValueValidator(v, 'designation') ,required: true },
    technology: [{ type: 'ObjectId', ref: 'technologyType' }]
})

module.exports = mongoose.model('employee',employeeSchema,'employees')