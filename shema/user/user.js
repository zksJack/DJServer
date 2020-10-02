let Joi = require("@hapi/joi");
let userID = Joi.string().max(30).required();
let username = Joi.string().max(30).required();
let disabled = Joi.string()
exports.user_schema={
    body:{
        userID,
        disabled
    }
}
exports.user_name_schema={
    body:{
        username
    }
}
exports.user_login_schema={
    body:{
        id_card:username,
        password:username
    }
}
exports.user_upDatePWD_schema={
    body:{
        id_card:username,
        oldPassword:username,
        newPassword:username,
    }
}