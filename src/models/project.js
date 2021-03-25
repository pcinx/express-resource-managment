const types = require('../enum');
const mongoose = require('mongoose')
const SingleValueValidator = require('../validators/SingleValueValidator');
const Schema = mongoose.Schema
const projectSchema = new Schema({    
    name:{type: String, required: true},
    paymentType: { type: String, default: "Not Assigned", validate: (v) => SingleValueValidator(v, 'payment') ,required: true },    
    amount: {type: Number, required: true},
    allocation :  { type: String, default: "Not Assigned", validate: (v) => SingleValueValidator(v, 'allocation') ,required: true },    
    teamLead: { type: 'ObjectId', ref: 'employee' },
    reviewer: { type: 'ObjectId', ref: 'employee' },
    priority: { type: String, default: "Not Assigned", validate: (v) => SingleValueValidator(v, 'priority') ,required: true },  
    status : { type: String, default: "Not Assigned", validate: (v) => SingleValueValidator(v, 'status') ,required: true },
    tech: [{ type: 'ObjectId', ref: 'technologyType' }],
    clientList:[{ type: 'ObjectId', ref: 'client' }]
})

module.exports = mongoose.model('project',projectSchema,'projects')