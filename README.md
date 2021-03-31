Front end for Projects & Resources Management Tool build with react.

# Endpoints

## GET

|       URL       |             desciption             |
| :-------------: | :--------------------------------: |
|     `/test`     | Returns data to initialize the app |
| `/projects/:id` |         Details of project         |
| `/clients/:id`  |         Details of client          |
| `/clients/:id`  |        Details of resource         |

## POST

|         URL          |                   desciption                   |
| :------------------: | :--------------------------------------------: |
|       `/login`       |        Get access token on valid login         |
|   `/projects/:id`    | Add client to project(will get modified later) |
|     `/projects`      |               Add project detail               |
|     `/resources`     |              Add resource detail               |
|      `/clients`      |               Add client details               |
|  `/responsibility`   |           Add responsibility details           |
|   `/types/payment`   |               Add a payment type               |
| `/types/allocation`  |             Add a allocation type              |
|  `/types/priority`   |              Add a priority type               |
|   `/types/status`    |               Add a status type                |
|    `/types/role`     |                Add a role type                 |
| `/types/designation` |             Add a designation type             |
| `/types/technology`  |             Add a technology type              |

## PUT

|           URL            |               desciption               |
| :----------------------: | :------------------------------------: |
|     `/projects/:id`      |      To update a project details       |
|     `/resources/:id`     | To update a resource(Employee) details |
|      `/clients/:id`      |       To update a client details       |
| `/projects/clients/:id`  |        Add client to a project         |
|   `/types/payment/:id`   |         Update a payment type          |
| `/types/allocation/:id`  |        Update a allocation type        |
|  `/types/priority/:id`   |         Update a priority type         |
|   `/types/status/:id`    |          Update a status type          |
|    `/types/role/:id`     |           Update a role type           |
| `/types/designation/:id` |       Update a designation type        |
| `/types/technology/:id`  |        Update a technology type        |
|  `/responsibility/:id`   |         Update responsibility          |

## DELETE

|                   URL                    |                     desciption                      |
| :--------------------------------------: | :-------------------------------------------------: |
|             `/projects/:id`              |           Deletes a project with given id           |
|             `/resources/:id`             |          Deletes a resource with given id           |
|              `/clients/:id`              |           Deletes a client with given id            |
| `/projects/:projectId/clients/:clientId` |           Deletes a client from a project           |
|           `/types/status/:id`            |   Deletes a status type and reset project in use    |
|            `/types/role/:id`             | Deletes a role type and reset responsibility in use |
|          `/types/priority/:id`           |               Deletes a priority type               |
|           `/types/payment/:id`           |               Deletes a payment type                |
|         `/types/allocation/:id`          |              Deletes a allocation type              |
|         `/types/designation/:id`         |             Deletes a designation type              |
|         `/types/technology/:id`          |              Deletes a technology type              |
|          `/responsibility/:id`           |   Deletes responsibility of resource from project   |

# About dependencies

## Dependencies

[`body-parser`](https://www.npmjs.com/package/body-parser)
parses incoming request bodies in a middleware before your handlers, available under the req.body property.

[`cors`](https://www.npmjs.com/package/cors)
is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

[`express`](https://www.npmjs.com/package/express)
is Fast, unopinionated, minimalist web framework for node.

[`mongoose`](https://www.npmjs.com/package/mongoose)
is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.

[`nodemon`](https://www.npmjs.com/package/nodemon)
is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
