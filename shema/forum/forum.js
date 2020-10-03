let Joi = require("@hapi/joi");
let JoiUtils = require('../../utils/joiUtile')
exports.in_huifu_schema={
    body:{
        forumId:JoiUtils.IS_STRING_NOT_NULL,
        userId:JoiUtils.IS_STRING_NOT_NULL,
        comment:JoiUtils.IS_STRING_NOT_NULL
    }
}
exports.in_forum_schema={
    body:{
        userId:JoiUtils.IS_STRING_NOT_NULL,
        username:JoiUtils.IS_STRING_NOT_NULL,
        content:JoiUtils.IS_STRING_NOT_NULL,
        type:JoiUtils.IS_INT_NOT_NULL,
    }
}
