var Joi = require("@hapi/joi");
var username = Joi.string().alphanum().min(3).max(30).required();
var password = Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required();
exports.admin_login_schema={
    query:{
        username,
        password
    }
}
exports.admin_changePassword_schema = {
    body:{
        username,
        password,
        newpassword:password
    }
}