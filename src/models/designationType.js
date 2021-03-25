const mongoose = require('mongoose')

const Schema = mongoose.Schema

const designationTypeSchema = new Schema({    
    value: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: Boolean, default: true, required: true}
})

module.exports = mongoose.model('designationType',designationTypeSchema,'designationTypes')