const PaymentType = require('../models/paymetType');
const AllocationType = require('../models/allocationType');
const PriorityType = require('../models/priorityType');
const StatusType = require('../models/statusType');
const RoleType = require('../models/roleType');
const DesignationType = require('../models/designationType');
module.exports = async (v, type) => {
    switch (type) {
        case "payment": return !!await PaymentType.findOne({ value: v})            
        case "allocation": return !!await AllocationType.findOne({ value: v})            
        case "priority": return !!await PriorityType.findOne({ value: v})            
        case "status": return !!await StatusType.findOne({ value: v})            
        case "role": return !!await RoleType.findOne({ value: v})            
        case "designation": return !!await DesignationType.findOne({ value: v})            
        default:
            console.log(`Single Value validator failed for ${type}`)
    }
    return false;
}
