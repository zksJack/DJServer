let Joi = require("@hapi/joi");
let JoiUtils = require('../../utils/joiUtile')
exports.in_huifu_schema={
    body:{
        forumId:JoiUtils.IS_STRING_NOT_NULL,
        userId:JoiUtils.IS_STRING_NOT_NULL,
        comment:JoiUtils.IS_STRING_NOT_NULL
    }
}