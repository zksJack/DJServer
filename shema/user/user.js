let Joi = require("@hapi/joi");
let JoiUtils = require('../../utils/joiUtile')
let userID = Joi.string().max(30).required();
let username = Joi.string().max(30).required();

exports.user_schema={
    body:{
        userID,
        disabled:Joi.string()
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
exports.user_updateInfo={
    body:{
        username:JoiUtils.IS_STRING_NOT_NULL,
        id_card:JoiUtils.IS_id_Card,
        phone:JoiUtils.IS_STRING_NOT_NULL,
        nation:JoiUtils.IS_STRING_NOT_NULL,
        wx_num:JoiUtils.IS_STRING_NOT_NULL,
        qq_num:JoiUtils.IS_QQ,
        age:JoiUtils.IS_INT_NOT_NULL,
        sex:JoiUtils.IS_sex,
        education:JoiUtils.IS_chinese,
        job_rank:JoiUtils.IS_chinese,
        address:JoiUtils.IS_STRING_NOT_NULL,
        salary:JoiUtils.IS_INT_NOT_NULL,
        party_status:JoiUtils.IS_INT_NOT_NULL,
        hometown:JoiUtils.IS_STRING_NOT_NULL,
        userId:JoiUtils.IS_NOT_NULL
    }
}