const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SingleValueValidator = require('../validators/SingleValueValidator');
const responsibilitySchema = new Schema({    
    project: { type: 'ObjectId', ref: 'project' },
    employee: { type: 'ObjectId', ref: 'employee' },
    role: { type: String, default: "Not Assigned", validate: (v) => SingleValueValidator(v, 'role') ,required: true },
})
module.exports = mongoose.model('responsibility',responsibilitySchema,'responsibilities')