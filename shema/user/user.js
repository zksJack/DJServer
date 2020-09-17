let Joi = require("@hapi/joi");
let userID = Joi.string().max(30).required();
let disabled = Joi.string()
exports.user_schema={
    body:{
        userID,
        disabled
    }
}