let Joi = require("@hapi/joi");
let username = Joi.string().max(30).required();
let disabled = Joi.string()
exports.user_schema={
    body:{
        username,
        disabled
    }
}