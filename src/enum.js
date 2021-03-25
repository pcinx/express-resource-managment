// const paymentType = {hourly:'Hourly',fixed:'Fixed'};
// const allocationType =  {fullTime:'Full Time', onDemand:'On Demand',support:'Support'};
// const priorityType =  {high:'High', medium:'Medium', low:'Low'};
// const statusType =  {onTrack:'On Track', delayed:'Delayed', critical:'Critical'};
const status = [
    {
        value:'On Track',
        description: 'On Track'
    },
    {
        value:'Delayed',
        description: 'Delayed'
    },
    {
        value:'Critical',
        description: 'Critical'
    },
    {
        value:'Not Assigned',
        description: 'Not Assigned yet!'
    }
]
const priority = [
    {
        value:'High',
        description: 'High'
    },
    {
        value:'Medium',
        description: 'High'
    },
    {
        value:'Low',
        description: 'Low'
    },
    {
        value:'Not Assigned',
        description: 'Not Assigned yet!'
    }
]
const payment = [
    {
        value:'Hourly',
        description: 'Based on Total hour spend on project'
    },
    {
        value:'Fixed',
        description: 'A fixed amount'
    },
    {
        value:'Not Assigned',
        description: 'Not Assigned yet!'
    }
]
const allocation = [
    {
        value:'Full Time',
        description: 'Based on Total hour spend on project'
    },
    {
        value:'On Demand',
        description: 'On Demand'
    },
    {
        value:'Support',
        description: 'Support'
    },
    {
        value:'Not Assigned',
        description: 'Not Assigned yet!'
    }
]
const role = [
    {
        value:'Team Lead',
        description: 'Team Lead'
    },
    {
        value:'Reviewer',
        description: 'Reviewer'
    },
    {
        value:'Senior Developer',
        description: 'Senior Developer'
    },
    {
        value:'Developer',
        description: 'Developer'
    },    
    {
        value:'Not Assigned',
        description: 'Not Assigned yet!'
    }
]
const designation = [
    {
        value:'Mobile App Developer',
        description: 'Mobile App Developer'
    },
    {
        value:'Liferay Developer',
        description: 'Liferay Developer'
    },
    {
        value:'IOS App Developer',
        description: 'IOS App Developer'
    },
    {
        value:'Android App Developer',
        description: 'Android App Developer'
    },
    {
        value:'Java Developer',
        description: 'Java Developer'
    },
    {
        value:'Python Developer',
        description: 'Python Developer'
    },
    {
        value:'Angular Developer',
        description: 'Angular Developer'
    },
    {
        value:'Laravel Developer',
        description: 'Laravel Developer'
    },
    {
        value:'ReactJS Developer',
        description: 'ReactJS Developer'
    },
    {
        value:'NodeJS Developer',
        description: 'NodeJS Developer'
    },
    {
        value:'Full Stack Developer',
        description: 'Full Stack Developer'
    },
    {
        value:'Not Assigned',
        description: 'Not Assigned yet!'
    },
]
module.exports = {
    paymentTypes: payment,
    allocationTypes: allocation,
    priorityTypes: priority,
    statusTypes: status,
    roleTypes:role,
    designationTypes: designation
}