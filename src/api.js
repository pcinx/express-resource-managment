var express = require('express');
var cors = require('cors')
const jwt = require('jsonwebtoken');
const serverless = require('serverless-http');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Employee = require('./models/employee');
const Client = require('./models/client');
const Project = require('./models/project');
const TechnologyType = require('./models/technologyType');
const PaymentType = require('./models/paymetType');
const AllocationType = require('./models/allocationType');
const PriorityType = require('./models/priorityType');
const StatusType = require('./models/statusType');
const RoleType = require('./models/roleType');
const DesignationType = require('./models/designationType');
const Responsibility = require('./models/responsibility');
const utils = require('./util');
const enums = require('./enum');
const { technologies, firstNames, lastNames } = utils;
const { paymentTypes, allocationTypes, priorityTypes, statusTypes, roleTypes, designationTypes } = enums;
/* database configuration starts */
// var ObjectId = require('mongodb').ObjectId;
const init = () => {
    PaymentType.find({}, (err, paymenttypes) => {
        if (paymenttypes.length === 0) {
            paymentTypes.forEach(paymenttype => {
                let pt = new PaymentType(paymenttype);
                pt.save();
            })
        }
    })
    AllocationType.find({}, (err, allocationtypes) => {
        if (allocationtypes.length === 0) {
            allocationTypes.forEach(allocationtype => {
                let at = new AllocationType(allocationtype);
                at.save();
            })
        }
    })
    PriorityType.find({}, (err, prioritytypes) => {
        if (prioritytypes.length === 0) {
            priorityTypes.forEach(prioritytype => {
                let pt = new PriorityType(prioritytype);
                pt.save();
            })
        }
    })
    StatusType.find({}, (err, statustypes) => {
        if (statustypes.length === 0) {
            statusTypes.forEach(statustype => {
                let st = new StatusType(statustype);
                st.save();
            })
        }
    })
    RoleType.find({}, (err, roletypes) => {
        if (roletypes.length === 0) {
            roleTypes.forEach(roletype => {
                let rt = new RoleType(roletype);
                rt.save();
            })
        }
    })
    DesignationType.find({}, (err, designationtypes) => {
        if (designationtypes.length === 0) {
            designationTypes.forEach(designationtype => {
                let dt = new DesignationType(designationtype);
                dt.save();
            })
        }
    })
    TechnologyType.find({}, (err, technology) => {
        if (technology.length === 0) {
            technologies.forEach(tech => {
                let t = new TechnologyType({ value: tech.name, description: tech.description });
                t.save();
            });
        }
    })
    Employee.find({}, async (err, employees) => {
        if (employees.length === 0) {
            for (let index = 0; index < 50; index++) {
                let findex = Math.floor(Math.random() * firstNames.length);
                let lindex = Math.floor(Math.random() * lastNames.length);
                let techindex = Math.floor(Math.random() * 3 + 1);
                let uname = `${firstNames[findex][0]}${lastNames[lindex][0]}${Math.floor((Math.random() * 100) + 100)}`;
                let emp = new Employee({
                    firstName: firstNames[findex],
                    lastName: lastNames[lindex],
                    userName: uname,
                    email: `${uname}@gmail.com`,
                    password: "123",
                    contactNumber: "1234567890",
                    address: "India",
                    technology: (await TechnologyType.find({}).limit(3))
                });
                emp.save();
            }
        }
    }).then(() => {
        Project.find({}, (err, projects) => {
            if (projects.length === 0) {
                (async () => {
                    let techs = await TechnologyType.find({}).limit(5);
                    let clients = await Client.find({}).limit(10);
                    let emp = await Employee.findOne({});
                    // let revemp = await Employee.findOne({}).skip(1).limit(1)[0];
                    let paymenttype = await PaymentType.findOne({}).then(pt => pt.value);
                    let allocation = await AllocationType.findOne({}).then(at => at.value);
                    let status = await StatusType.findOne({}).then(st => st.value);
                    let priority = await PriorityType.findOne({}).then(pt => pt.value);
                    if (emp) {
                        let p = new Project({
                            name: "dummy-project",
                            amount: 1000000,
                            paymentType: paymenttype,
                            priority: priority,
                            allocation: allocation,
                            status: status,
                            teamLead: emp._id,
                            reviewer: emp._id,
                            tech: techs.map(t => t._id),
                            clientList: clients.map(c => c._id)
                        })
                        // console.log(p);
                        p.save();
                        let teamLeadResponsibility = new Responsibility({ project: p._id, employee: emp._id, role: 'Team Lead' });
                        teamLeadResponsibility.save();
                        let reviewerResponsibility = new Responsibility({ project: p._id, employee: emp._id, role: 'Reviewer' });
                        reviewerResponsibility.save();
                        Employee.find({}).limit(5).then((emps) => {
                            // console.log("list", e.length)
                            emps.forEach(async e => {
                                // let tech =await TechnologyType.find({}).limit(2).map(t=>t);
                                let responsibility = new Responsibility({
                                    project: p._id,
                                    employee: e._id,
                                    // technology:tech.map(t=>t.id)
                                });
                                // console.log(responsibility)
                                responsibility.save();
                            })
                        })
                    }
                })().catch(err => {
                    console.error(err);
                });
            }
        })
    })
    Client.find({}, (err, clients) => {
        if (clients.length === 0) {
            for (let index = 0; index < 50; index++) {
                let findex = Math.floor(Math.random() * firstNames.length);
                let lindex = Math.floor(Math.random() * lastNames.length);
                let uname = `${firstNames[findex][0]}${lastNames[lindex][0]}${Math.floor((Math.random() * 100) + 100)}`;
                let client = new Client({
                    firstName: firstNames[findex],
                    lastName: lastNames[lindex],
                    email: `${uname}.client@gmail.com`,
                    contactNumber: "1234567890",
                    address: "India"
                });
                client.save();
            }
        }
    })


};
// mongoose.connect(db, function (err) {
//     if (err) {
//         console.log(err)
//     }
//     else {
//         //for initializing database with dummy values.

//         console.log("Connected to MongoDB")
//     }
// })
const db = process.env.db ? process.env.db : 'mongodb://localhost:27017/resourceManagerDB';
const connectDB = async () => {
    console.log('process.env', process.env.db);
    await mongoose.connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    init();
    console.log("connected")
}
connectDB();
/* database configuration ends */

/* express app start */
var app = express();
const router = express.Router();
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
// Verify Token
function verifyTokenSuperUser(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, 'secretkey', (err, user) => {
        console.log('verifyTokenSuperUser user', user);
        if (err) return res.sendStatus(403);
        if (!user.user.isSuperUser) return res.sendStatus(403);
        req.user = user
        next()
    })
}
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, 'secretkey', (err, user) => {
        console.log('user', user);
        if (err) return res.sendStatus(403);
        req.user = user
        next()
    })
}
router.post('/login', async function (req, res) {
    console.log(req.body)
    try {
        let user = req.body.user;
        if (user.isSuperUser && user.username === user.password && user.username === 'admin') {
            jwt.sign({ user }, 'secretkey', { expiresIn: '1000s' }, (err, token) => {
                res.json({
                    token: token,
                    isSuperUser: true
                });
            });
        } else if (!user.isSuperUser) {
            Employee.findOne({ userName: user.username, password: user.password }).then(e => {
                if (e) {
                    jwt.sign({ user }, 'secretkey', { expiresIn: '1000s' }, (err, token) => {
                        res.json({
                            token: token,
                            isSuperUser: false
                        });
                    });
                } else throw new Error('User credentials are not valid!')
            }).catch(error => {
                res.status(400).json({
                    error: "User credentials are not valid!"
                });
            })
        } else {
            res.status(400).json({
                error: "User credentials are not valid!"
            });
        }
    } catch (error) {
        res.status(400).json({ error: 'cannot login' });
    }
})
router.get('/test', verifyToken, async function (req, res) {
    let projects = await Project.find({}).populate('tech').populate('teamLead').select({ "password": 0, "__v": 0 }).populate('reviewer').select({ "password": 0, "__v": 0 });
    let employees = await Employee.find({}).select({ "password": 0, "__v": 0 });
    let technologies = await TechnologyType.find({});
    let clients = await Client.find({}).select({ "__v": 0 });
    let payment = await PaymentType.find({}).select({ "__v": 0 });
    let allocation = await AllocationType.find({}).select({ "__v": 0 });
    let priority = await PriorityType.find({}).select({ "__v": 0 });
    let status = await StatusType.find({}).select({ "__v": 0 });
    let role = await RoleType.find({}).select({ "__v": 0 });
    let designation = await DesignationType.find({}).select({ "__v": 0 });
    let availableType = {
        payment: payment,
        allocation: allocation,
        priority: priority,
        status: status,
        role: role,
        designation: designation,
        technology: technologies
    }
    res.status(200).json({
        projects: projects,
        clients: clients,
        employees: employees,
        availableType: availableType
    });
})
router.post('/projects', verifyTokenSuperUser, async function (req, res) {
    let sameNameProject = await Project.findOne({ name: req.body.name });
    if (sameNameProject) {
        res.status(400).json({ error: `Project Name ${req.body.name} already exists!` });
    }
    else {
        try {
            let usedTech = await TechnologyType.find({ value: { "$in": req.body.technologies } }).select({ _id: 1 });
            let tech = [];
            usedTech.map(t => tech.push(t._id))
            let teamLead = await Employee.findOne({ userName: req.body.teamLead });
            let reviewer = await Employee.findOne({ userName: req.body.reviewer });
            let project = new Project({
                ...req.body,
                tech: tech,
                teamLead: teamLead ? teamLead._id : null,
                reviewer: reviewer ? reviewer._id : null
            });
            let teamLeadResponsibility = new Responsibility({ project: project.id, employee: teamLead.id, role: 'Team Lead' });
            teamLeadResponsibility.save();
            let reviewerResponsibility = new Responsibility({ project: project.id, employee: reviewer.id, role: 'Reviewer' });
            reviewerResponsibility.save();
            project.save().then(async () => {
                let projects = await Project.find({}).populate('tech').populate('teamLead').select({ "password": 0, "__v": 0 }).populate('reviewer').select({ "password": 0, "__v": 0 });
                if (!res.headersSent) res.status(200).json({ projects });
            });
        } catch (error) {
            res.status(400).json({ error });
        }
    }
})
router.post('/responsibility', verifyTokenSuperUser, async function (req, res) {
    let employee = await Employee.findOne({ userName: req.body.employee });
    let project = await Project.findById(req.body.project);
    let role = await RoleType.findOne({ value: req.body.role });
    if (!project) {
        res.status(400).json({ error: `Project ${req.body.project} doesn't exists!` });
    } else if (!employee) {
        res.status(400).json({ error: `Resource with username ${req.body.employee} doesn't exists!` });
    } else if (!role) {
        res.status(400).json({ error: `Role ${req.body.role} doesn't exists!` });
    }
    else {
        let sameResourceInProject = await Responsibility.findOne({ employee: employee.id, project: project.id });
        if (sameResourceInProject) {
            res.status(400).json({ error: `Resource ${employee.userName} already in the project!` });
        }
        else {
            try {
                // let usedTech = await TechnologyType.find({value:{"$in":req.body.technologies}}).select({_id:1});
                // let tech = [];
                // usedTech.map(t=>tech.push(t._id))
                let responsibility = new Responsibility({
                    project: project.id,
                    employee: employee.id,
                    // technology:tech,
                    role: role.value
                });
                // console.log(responsibility)
                responsibility.save().then(async () => {
                    let responsibilities = await Responsibility.find({ project: project.id }).populate("employee", { password: 0 }).populate("technology");
                    if (!res.headersSent) res.status(200).json({ responsibilities });
                });
            } catch (error) {
                res.status(400).json({ error });
            }
        }
    }
})

router.put('/responsibility/:id', verifyTokenSuperUser, function (req, res) {
    Responsibility.findById(req.params.id).populate("employee", { password: 0 }).populate("technology").then(async (responsibility) => {
        let role = await RoleType.findOne({ value: req.body.role });
        // let usedTech = await TechnologyType.find({value:{"$in":req.body.technologies}}).select({_id:1});
        // let tech = [];
        // usedTech.map(t=>tech.push(t._id));
        // if(!tech){
        //     res.status(400).json({error: `No Such Technology Exist!`});
        // }else if(tech.length==0){
        //     res.status(400).json({error: `No Technology Assigned!`});
        // }else
        if (!role) {
            res.status(400).json({ error: `No such role exist!` });
        } else {
            // responsibility.technology = tech;
            responsibility.role = role.value;
            responsibility.save();
            // let ret = (await responsibility.populate("technology").execPopulate());
            let ret = responsibility;
            res.status(200).json({ responsibility: ret });
        }
    }).catch(error => {
        console.log('error', error);
        res.status(400).json({ error })
    })
})
router.delete('/responsibility/:id', verifyTokenSuperUser, async function (req, res) {
    Responsibility.findById(req.params.id).then(resp => {
        console.log(resp);
        if (resp.role === "Team Lead" || resp.role === "Reviewer") {
            res.status(400).json({ error: `Cannot perform such action!` });
        } else {
            Responsibility.deleteOne({ _id: req.params.id }).then(async (stats) => {
                let responsibilities = (await Responsibility.find({ project: resp.project }).populate("employee", { password: 0 }).populate("technology"));
                res.status(200).json({ responsibilities: responsibilities, deletedCount: stats.deletedCount });
            }).catch(error => res.status(400).json({ error }));
        }
    })
})

router.delete('/projects/:id', verifyTokenSuperUser, function (req, res) {
    Project.deleteOne({ _id: req.params.id }).then(async (stats) => {
        let projects = await Project.find({}).populate('tech').populate('teamLead').select({ "password": 0, "__v": 0 }).populate('reviewer').select({ "password": 0, "__v": 0 });
        res.status(200).json({ projects: projects, deletedCount: stats.deletedCount });
    }).catch(error => res.status(400).json({ error }));
})
router.put('/projects/:id', verifyTokenSuperUser, async function (req, res) {
    Project.findById(req.params.id).exec(async function (err, project) {
        if (err) res.status(400).json(err);
        try {
            let usedTech = await TechnologyType.find({ value: { "$in": req.body.technologies } }).select({ _id: 1 });
            let tech = [];
            usedTech.map(t => tech.push(t._id))

            let teamLead = await Employee.findOne({ userName: req.body.teamLead });
            let reviewer = await Employee.findOne({ userName: req.body.reviewer });
            let teamLeadResponsibility = await Responsibility.findOne({ project: project.id, employee: project.teamLead, role: "Team Lead" });
            teamLeadResponsibility.employee = teamLead.id;
            teamLeadResponsibility.save();
            let reviewerResponsibility = await Responsibility.findOne({ project: project.id, employee: project.reviewer, role: 'Reviewer' });
            reviewerResponsibility.employee = reviewer.id;
            reviewerResponsibility.save();
            let sameNameProject = await Project.find({ name: req.body.name });
            if (sameNameProject.length > 0 && sameNameProject.some(p => p.id !== project.id)) {
                res.status(400).json({ error: `Project Name ${req.body.name} already exists!` });
            }

            project.name = req.body.name;
            project.paymentType = req.body.paymentType;
            project.amount = req.body.amount;
            project.allocation = req.body.allocation;
            project.teamLead = teamLead ? teamLead._id : null;
            project.reviewer = reviewer ? reviewer._id : null;
            project.priority = req.body.priority;
            project.status = req.body.status;
            // project.tech = usedTech;
            project.tech = tech;
            project.save().then(() => {
                Project.find({})
                    .populate('tech')
                    .populate('teamLead')
                    .select({ "password": 0, "__v": 0 })
                    .populate('reviewer')
                    .select({ "password": 0, "__v": 0 }).then(p => {
                        if (!res.headersSent)
                            res.status(200).json({ projects: p });
                    });
            });

        } catch (error) {
            res.status(400).json({ error });
        }
    })
    // let project = new Project({
    //     tech:tech,
    //     teamLead:teamLead._id,
    //     reviewer:reviewer._id
    // });
    // project.save();
    // let projects = await Project.find({}).populate('tech').populate('teamLead').populate('reviewer');
    // res.status(200).json({projects});
})
router.get('/projects/:id', verifyToken, function (req, res) {
    Project.findById(req.params.id)
        .populate('tech')
        .populate('teamLead')
        .select({ "password": 0 })
        .populate('reviewer')
        .select({ "password": 0 })
        .populate('clientList')
        .exec(async function (err, project) {
            // console.log(project.tech);
            if (err) res.status(404).send(err);
            else {
                res.status(200).json({
                    project: project,
                    responsibilities: (await Responsibility.find({ project: req.params.id }).populate("employee", { password: 0 }))
                })
            }
        })
});
router.put('/projects/clients/:id', verifyTokenSuperUser, function (req, res) {
    if (req.params.id === '') {
        res.status(400).json({ error: "No such client exist" });
    } else {
        Project.findById(req.params.id).then((project) => {
            Client.findById(req.body.clientId).then((client) => {
                if (project.clientList.filter(id => id.equals(client._id)).length == 0) {
                    project.clientList.push(client._id);
                    project.save();
                }
                else {
                    res.status(400).json({ error: "Client already exist" });
                }
            }).then(async () => {
                let projects = await Project.find({})
                    .populate('tech')
                    .populate('teamLead')
                    .select({ "password": 0, "__v": 0 })
                    .populate('reviewer')
                    .select({ "password": 0, "__v": 0 });
                if (!res.headersSent)
                    res.status(200).json({ projects: projects });
            }).catch(error => res.status(400).json({ error }))
        })
    }
});
router.delete('/projects/:projectId/clients/:clientId', verifyTokenSuperUser, function (req, res) {
    Project.findById(req.params.projectId).then(project => {
        if (project) {
            Client.findById(req.params.clientId).then((client) => {
                console.log('client', client)
                console.log('req.params.clientId', req.params.clientId)
                if (!client) {
                    res.status(400).json({ error: "Client does not exist" });
                }
                else if (project.clientList.some(id => id.equals(client._id))) {
                    project.clientList = project.clientList.map(id => id.equals(client._id) ? null : id).filter(id => id);
                    project.save();
                } else {
                    res.status(400).json({ error: "Client does not exist" });
                }
            }).then(async () => {
                let projects = await Project.find({})
                    .populate('tech')
                    .populate('teamLead')
                    .select({ "password": 0, "__v": 0 })
                    .populate('reviewer')
                    .select({ "password": 0, "__v": 0 });
                res.status(200).json({ projects: projects });
            })
        } else {
            res.status(400).json({ error: "Project does not exist" });
        }
    }).catch(error => res.status(400).json({ error }))
});
router.get('/resources/:id', verifyToken, function (req, res) {
    Employee.findById(req.params.id)
        .populate("technology")
        .exec(async function (err, resource) {
            // console.log(project.tech);
            let responsibilities = await Responsibility.find({ employee: resource.id });
            if (err) res.status(404).send(err);
            else {
                res.status(200).json({ resource: resource, responsibilities: responsibilities })
            }
        })
});
router.post('/resources', verifyTokenSuperUser, async function (req, res) {
    let usedTech = await TechnologyType.find({ value: { "$in": req.body.technology } }).select({ _id: 1 });
    let tech = [];
    usedTech.map(t => tech.push(t._id));
    let employee = new Employee({
        ...req.body,
        technology: tech
    });
    employee.save().then(async () => {
        let employees = await Employee.find({});
        res.status(200).json({ employees });
    }).catch(error => res.status(400).json({ error }));
})
router.post('/clients', verifyTokenSuperUser, async function (req, res) {
    let client = new Client({
        ...req.body,
    });
    client.save().then(async () => {
        let clients = await Client.find({});
        res.status(200).json({ clients });
    }).catch(error => res.status(400).json({ error }));
})
router.get('/clients/:id', async function (req, res) {
    Client.findById(req.params.id).select({ "__v": 0 }).exec(async function (err, client) {
        console.log(client)
        if (err) res.status(400).json({ error: err });
        try {
            let projects = await Project.find({ clientList: { $in: client.id } }).select({ "_id": 1 });
            res.status(200).json({ client: client, projects: projects ? projects : [] });
        } catch (error) {
            res.status(400).json({ error });
        }
    })
})
router.put('/clients/:id', verifyTokenSuperUser, async function (req, res) {
    Client.findById(req.params.id).select({ "__v": 0 }).exec(async function (err, client) {
        if (err) res.status(400).json({ error: err });
        try {
            client.firstName = req.body.firstName;
            client.lastName = req.body.lastName;
            client.email = req.body.email;
            client.contactNumber = req.body.contactNumber;
            client.address = req.body.address;
            client.save().then((c) => {
                res.status(200).json({ client: c });
            });

        } catch (error) {
            res.status(400).json({ error });
        }
    })
})
router.put('/resources/:id', verifyTokenSuperUser, async function (req, res) {
    Employee.findById(req.params.id).select({ "__v": 0 }).exec(async function (err, employee) {
        if (err) res.status(400).json({ error: err });
        try {
            employee.firstName = req.body.firstName;
            employee.lastName = req.body.lastName;
            employee.email = req.body.email;
            employee.contactNumber = req.body.contactNumber;
            employee.address = req.body.address;
            employee.designation = req.body.designation;
            if (req.body.technology) {
                let usedTech = await TechnologyType.find({ value: { "$in": req.body.technology } }).select({ _id: 1 });
                let tech = [];
                usedTech.map(t => tech.push(t._id))
                employee.technology = tech;
            }
            employee.save().then((e) => {
                res.status(200).json({
                    employee: {
                        address: e.address,
                        contactNumber: e.contactNumber,
                        designation: e.designation,
                        email: e.email,
                        firstName: e.firstName,
                        lastName: e.lastName,
                        technology: e.technology
                    }
                });
            });

        } catch (error) {
            res.status(400).json({ error });
        }
    })
})
router.delete('/resources/:id', verifyTokenSuperUser, async function (req, res) {
    try {
        let employee = await Employee.findById(req.params.id);
        if ((await Responsibility.findOne({ employee: employee.id }))) {
            res.status(400).json({ error: `Resource \`${employee.firstName} ${employee.lastName}\` already in use!` });
        } else {
            let stats = await Employee.deleteOne({ _id: req.params.id })
            await Project.updateMany({ teamLead: req.params.id }, { teamLead: null });
            await Project.updateMany({ reviewer: req.params.id }, { reviewer: null })
            let projects = await Project.find({})
                .populate('tech')
                .populate('teamLead')
                .select({ "password": 0, "__v": 0 })
                .populate('reviewer')
                .select({ "password": 0, "__v": 0 });
            res.status(200).json({ stats: stats, projects: projects });
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
})
router.delete('/clients/:id', verifyTokenSuperUser, async function (req, res) {
    try {
        let stats = await Client.deleteOne({ _id: req.params.id })
        let p = await Project.updateMany({ clientList: req.params.id }, { $pull: { clientList: req.params.id } });
        console.log(p)
        let projects = await Project.find({})
            .populate('tech')
            .populate('teamLead')
            .select({ "password": 0, "__v": 0 })
            .populate('reviewer')
            .select({ "password": 0, "__v": 0 });
        res.status(200).json({ stats: stats, projects: projects });

    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
})
router.post('/types/payment', verifyTokenSuperUser, async function (req, res) {
    let paymenttype = new PaymentType({
        ...req.body,
    });
    paymenttype.save().then(async () => {
        let payment = await PaymentType.find({});
        res.status(200).json({ payment });
    }).catch(error => res.status(400).json({ error }));
})
router.post('/types/allocation', verifyTokenSuperUser, async function (req, res) {
    let allocationtype = new AllocationType({
        ...req.body,
    });
    allocationtype.save().then(async () => {
        let allocation = await AllocationType.find({});
        res.status(200).json({ allocation });
    }).catch(error => res.status(400).json({ error }));
})
router.post('/types/priority', verifyTokenSuperUser, async function (req, res) {
    let prioritytype = new PriorityType({
        ...req.body,
    });
    prioritytype.save().then(async () => {
        let priority = await PriorityType.find({});
        res.status(200).json({ priority });
    }).catch(error => res.status(400).json({ error }));
})
router.post('/types/status', verifyTokenSuperUser, async function (req, res) {
    let statustype = new StatusType({
        ...req.body,
    });
    statustype.save().then(async () => {
        let status = await StatusType.find({});
        res.status(200).json({ status });
    }).catch(error => res.status(400).json({ error }));
})
router.post('/types/role', verifyTokenSuperUser, async function (req, res) {
    let roletype = new RoleType({
        ...req.body,
    });
    roletype.save().then(async () => {
        let role = await RoleType.find({});
        res.status(200).json({ role });
    }).catch(error => res.status(400).json({ error }));
})
router.post('/types/designation', verifyTokenSuperUser, async function (req, res) {
    let designationtype = new DesignationType({
        ...req.body,
    });
    designationtype.save().then(async () => {
        let designation = await DesignationType.find({});
        res.status(200).json({ designation });
    }).catch(error => res.status(400).json({ error }));
})
router.post('/types/technology', verifyTokenSuperUser, async function (req, res) {
    let technologytype = new TechnologyType({
        ...req.body,
    });
    technologytype.save().then(async () => {
        let technology = await TechnologyType.find({});
        res.status(200).json({ technology });
    }).catch(error => res.status(400).json({ error }));
})
router.delete('/types/status/:id', verifyTokenSuperUser, async function (req, res) {
    try {
        let status = await StatusType.findOne({ _id: req.params.id });
        let stats = await StatusType.deleteOne({ _id: req.params.id })
        let p = await Project.updateMany({ status: status.value }, { status: "Not Assigned" });
        // console.log(status);
        console.log(p);
        let projects = await Project.find({})
            .populate('tech')
            .populate('teamLead')
            .select({ "password": 0, "__v": 0 })
            .populate('reviewer')
            .select({ "password": 0, "__v": 0 });
        let newstatus = await StatusType.find({}).select({ "__v": 0 });
        res.status(200).json({ stats: stats, projects: projects, status: newstatus });

    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
})
router.delete('/types/priority/:id', verifyTokenSuperUser, async function (req, res) {
    try {
        let priority = await PriorityType.findOne({ _id: req.params.id });
        let stats = await PriorityType.deleteOne({ _id: req.params.id })
        let p = await Project.updateMany({ priority: priority.value }, { priority: "Not Assigned" });
        console.log(p);
        let projects = await Project.find({})
            .populate('tech')
            .populate('teamLead')
            .select({ "password": 0, "__v": 0 })
            .populate('reviewer')
            .select({ "password": 0, "__v": 0 });
        let newpriority = await PriorityType.find({}).select({ "__v": 0 });
        res.status(200).json({ stats: stats, projects: projects, priority: newpriority });

    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
});
router.delete('/types/payment/:id', verifyTokenSuperUser, async function (req, res) {
    try {
        let payment = await PaymentType.findOne({ _id: req.params.id });
        let stats = await PaymentType.deleteOne({ _id: req.params.id })
        let p = await Project.updateMany({ paymentType: payment.value }, { paymentType: "Not Assigned" });
        console.log(p);
        let projects = await Project.find({})
            .populate('tech')
            .populate('teamLead')
            .select({ "password": 0, "__v": 0 })
            .populate('reviewer')
            .select({ "password": 0, "__v": 0 });
        let newpayment = await PaymentType.find({}).select({ "__v": 0 });
        res.status(200).json({ stats: stats, projects: projects, payment: newpayment });

    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
});
router.delete('/types/allocation/:id', verifyTokenSuperUser, async function (req, res) {
    try {
        let allocation = await AllocationType.findOne({ _id: req.params.id });
        let stats = await AllocationType.deleteOne({ _id: req.params.id })
        let p = await Project.updateMany({ allocation: allocation.value }, { allocation: "Not Assigned" });
        console.log(p);
        let projects = await Project.find({})
            .populate('tech')
            .populate('teamLead')
            .select({ "password": 0, "__v": 0 })
            .populate('reviewer')
            .select({ "password": 0, "__v": 0 });
        let newallocation = await AllocationType.find({}).select({ "__v": 0 });
        res.status(200).json({ stats: stats, projects: projects, allocation: newallocation });

    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
});
router.delete('/types/role/:id', verifyTokenSuperUser, async function (req, res) {
    try {
        let role = await RoleType.findOne({ _id: req.params.id });
        if (await Responsibility.findOne({ role: role.value })) {
            res.status(400).json({ error: `Role of type \`${role.value}\` already in use!` });
        } else {
            let stats = await RoleType.deleteOne({ _id: req.params.id })
            // let r = await Responsibility.updateMany({role:role.value},{role:"Not Assigned"});        
            let newrole = await RoleType.find({}).select({ "__v": 0 });
            res.status(200).json({ stats: stats, role: newrole });
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
});
router.delete('/types/technology/:id', verifyTokenSuperUser, async function (req, res) {
    try {
        let technology = await TechnologyType.findOne({ _id: req.params.id });
        let projectUsingTech = await Project.findOne({ tech: { $in: technology.id } });
        let employeeUsingTech = await Employee.findOne({ technology: { $in: technology.id } });
        // res.status(200).json({technology:technology,projectUsingTech:projectUsingTech,responsibilityUsingTech:responsibilityUsingTech});
        if (employeeUsingTech || projectUsingTech) {
            res.status(400).json({ error: `Technology of type \`${technology.value}\` already in use!` });
        } else {
            let stats = await TechnologyType.deleteOne({ _id: req.params.id })
            // let r = await Responsibility.updateMany({role:role.value},{role:"Not Assigned"});        
            let newtech = await TechnologyType.find({}).select({ "__v": 0 });
            res.status(200).json({ stats: stats, technology: newtech });
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
});
router.delete('/types/designation/:id', verifyTokenSuperUser, async function (req, res) {
    try {
        let designation = await DesignationType.findOne({ _id: req.params.id });
        if (await Employee.findOne({ designation: designation.value })) {
            res.status(400).json({ error: `Designation of type \`${designation.value}\` already in use!` });
        } else {
            let stats = await DesignationType.deleteOne({ _id: req.params.id })
            // let r = await Responsibility.updateMany({role:role.value},{role:"Not Assigned"});        
            let newdesignation = await DesignationType.find({}).select({ "__v": 0 });
            res.status(200).json({ stats: stats, designation: newdesignation });
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
});
router.put('/types/status/:id', verifyTokenSuperUser, async function (req, res) {
    try {
        let status = await StatusType.findOne({ _id: req.params.id }).select({ "__v": 0 });
        let oldStatusValue = status.value;
        let alreadyInUseProject = await Project.findOne({ status: oldStatusValue });
        if (alreadyInUseProject && !req.body.status) {
            res.status(400).json({ error: `Status of type \`${oldStatusValue}\` already in use!` });
        } else {
            status.value = req.body.value;
            status.description = req.body.description;
            status.status = req.body.status;
            status.save().then(async () => {
                let p = null;
                if (req.body.status) {
                    p = await Project.updateMany({ status: oldStatusValue }, { status: status.value });
                } else {
                    p = await Project.updateMany({ status: oldStatusValue }, { status: "Not Assigned" });
                }
                let projects = await Project.find({})
                    .populate('tech')
                    .populate('teamLead')
                    .select({ "password": 0, "__v": 0 })
                    .populate('reviewer')
                    .select({ "password": 0, "__v": 0 });
                let newstatus = await StatusType.find({}).select({ "__v": 0 });
                res.status(200).json({ projects: projects, status: newstatus });
            }).catch(error => {
                console.log(error)
                res.status(400).json({ error });
            });
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
})
router.put('/types/priority/:id', verifyTokenSuperUser, async function (req, res) {
    try {
        let priority = await PriorityType.findOne({ _id: req.params.id }).select({ "__v": 0 });
        let oldPriorityValue = priority.value;
        let alreadyInUseProject = await Project.findOne({ priority: oldPriorityValue });
        if (alreadyInUseProject && !req.body.status) {
            res.status(400).json({ error: `Priority of type \`${oldPriorityValue}\` already in use!` });
        } else {
            priority.value = req.body.value;
            priority.description = req.body.description;
            priority.status = req.body.status;
            priority.save().then(async () => {
                let p = null;
                // console.log(status);
                if (req.body.status) {
                    p = await Project.updateMany({ priority: oldPriorityValue }, { priority: priority.value });
                } else {
                    p = await Project.updateMany({ priority: oldPriorityValue }, { priority: "Not Assigned" });
                }
                console.log(p);
                let projects = await Project.find({})
                    .populate('tech')
                    .populate('teamLead')
                    .select({ "password": 0, "__v": 0 })
                    .populate('reviewer')
                    .select({ "password": 0, "__v": 0 });
                let newpriority = await PriorityType.find({}).select({ "__v": 0 });
                res.status(200).json({ projects: projects, priority: newpriority });
            }).catch(error => {
                console.log(error)
                res.status(400).json({ error });
            });
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
})
router.put('/types/payment/:id', verifyTokenSuperUser, async function (req, res) {
    try {
        let payment = await PaymentType.findOne({ _id: req.params.id }).select({ "__v": 0 });
        let oldPaymentValue = payment.value;
        let alreadyInUseProject = await Project.findOne({ paymentType: oldPaymentValue });
        if (alreadyInUseProject && !req.body.status) {
            res.status(400).json({ error: `Payment of type \`${oldPaymentValue}\` already in use!` });
        } else {
            payment.value = req.body.value;
            payment.description = req.body.description;
            payment.status = req.body.status;
            payment.save().then(async () => {
                let p = null;
                // console.log(status);
                if (req.body.status) {
                    p = await Project.updateMany({ paymentType: oldPaymentValue }, { paymentType: payment.value });
                } else {
                    p = await Project.updateMany({ paymentType: oldPaymentValue }, { paymentType: "Not Assigned" });
                }
                console.log(p);
                let projects = await Project.find({})
                    .populate('tech')
                    .populate('teamLead')
                    .select({ "password": 0, "__v": 0 })
                    .populate('reviewer')
                    .select({ "password": 0, "__v": 0 });
                let newpayment = await PaymentType.find({}).select({ "__v": 0 });
                res.status(200).json({ projects: projects, payment: newpayment });
            }).catch(error => {
                console.log(error)
                res.status(400).json({ error });
            });
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
})
router.put('/types/allocation/:id', verifyTokenSuperUser, async function (req, res) {
    try {
        let allocation = await AllocationType.findOne({ _id: req.params.id }).select({ "__v": 0 });
        let oldAllocationValue = allocation.value;
        let alreadyInUseProject = await Project.findOne({ allocation: oldAllocationValue });
        if (alreadyInUseProject && !req.body.status) {
            res.status(400).json({ error: `Allocation of type \`${oldAllocationValue}\` already in use!` });
        } else {
            allocation.value = req.body.value;
            allocation.description = req.body.description;
            allocation.status = req.body.status;
            allocation.save().then(async () => {
                let p = null;
                // console.log(status);
                if (req.body.status) {
                    p = await Project.updateMany({ allocation: oldAllocationValue }, { allocation: allocation.value });
                } else {
                    p = await Project.updateMany({ allocation: oldAllocationValue }, { allocation: "Not Assigned" });
                }
                console.log(p);
                let projects = await Project.find({})
                    .populate('tech')
                    .populate('teamLead')
                    .select({ "password": 0, "__v": 0 })
                    .populate('reviewer')
                    .select({ "password": 0, "__v": 0 });
                let newallocation = await AllocationType.find({}).select({ "__v": 0 });
                res.status(200).json({ projects: projects, allocation: newallocation });
            }).catch(error => {
                console.log(error)
                res.status(400).json({ error });
            });
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
})
router.put('/types/role/:id', verifyTokenSuperUser, async function (req, res) {
    try {
        let role = await RoleType.findOne({ _id: req.params.id }).select({ "__v": 0 });
        let oldRoleValue = role.value;
        let alreadyInUseResponsibility = await Responsibility.findOne({ role: oldRoleValue });
        if (alreadyInUseResponsibility && !req.body.status) {
            res.status(400).json({ error: `Role of type \`${oldRoleValue}\` already in use!` });
        } else {
            role.value = req.body.value;
            role.description = req.body.description;
            role.status = req.body.status;
            role.save().then(async () => {
                let r = null;
                // console.log(status);
                if (req.body.status) {
                    r = await Responsibility.updateMany({ role: oldRoleValue }, { role: role.value });
                } else {
                    r = await Responsibility.updateMany({ role: oldRoleValue }, { role: "Not Assigned" });
                }
                console.log(r);
                let newrole = await RoleType.find({}).select({ "__v": 0 });
                res.status(200).json({ role: newrole });
            }).catch(error => {
                console.log(error)
                res.status(400).json({ error });
            });
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
})
router.put('/types/designation/:id', verifyTokenSuperUser, async function (req, res) {
    try {
        let designation = await DesignationType.findOne({ _id: req.params.id }).select({ "__v": 0 });
        let oldDesignationValue = designation.value;
        let alreadyInUseEmployee = await Employee.findOne({ designation: oldDesignationValue });
        if (alreadyInUseEmployee && !req.body.status) {
            res.status(400).json({ error: `Designation of type \`${oldDesignationValue}\` already in use!` });
        } else {
            designation.value = req.body.value;
            designation.description = req.body.description;
            designation.status = req.body.status;
            designation.save().then(async () => {
                let r = null;
                // console.log(status);
                if (req.body.status) {
                    r = await Employee.updateMany({ designation: oldDesignationValue }, { designation: designation.value });
                } else {
                    r = await Employee.updateMany({ designation: oldDesignationValue }, { designation: "Not Assigned" });
                }
                console.log(r);
                let newdesignation = await DesignationType.find({}).select({ "__v": 0 });
                res.status(200).json({ designation: newdesignation });
            }).catch(error => {
                console.log(error)
                res.status(400).json({ error });
            });
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
})
router.put('/types/technology/:id', verifyTokenSuperUser, async function (req, res) {
    try {
        let technology = await TechnologyType.findOne({ _id: req.params.id });
        let projectUsingTech = await Project.findOne({ tech: { $in: technology.id } });
        let employeeUsingTechUsingTech = await Employee.findOne({ technology: { $in: technology.id } });
        let oldTechnologyValue = technology.value;
        // let alreadyInUseEmployee = await Employee.findOne({designation:oldDesignationValue});
        if (projectUsingTech && !req.body.status) {
            res.status(400).json({ error: `Technology of type \`${oldTechnologyValue}\` already in use!` });
        } else if (employeeUsingTechUsingTech && !req.body.status) {
            res.status(400).json({ error: `Designation of type \`${oldTechnologyValue}\` already in use!` });
        } else {
            technology.value = req.body.value;
            technology.description = req.body.description;
            technology.status = req.body.status;
            technology.save().then(async () => {
                let newtechnology = await TechnologyType.find({}).select({ "__v": 0 });
                res.status(200).json({ technology: newtechnology });
            }).catch(error => {
                console.log(error)
                res.status(400).json({ error });
            });
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
})
app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);
// var server = app.listen(8081, function () {
//     // var host = server.address().address
//     var host = "localhost"
//     var port = server.address().port

//     console.log("Example app listening at http://%s:%s", host, port)
// })
/* express app ends */