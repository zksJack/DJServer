let Joi = require("@hapi/joi");
let JoiUtils = require('../../utils/joiUtile')
exports.up_schema={
    body:{
        content:JoiUtils.IS_STRING_NOT_NULL,
        title_desc:JoiUtils.IS_STRING_NOT_NULL,
        is_open:JoiUtils.IS_INT_NOT_NULL,
        commentID:JoiUtils.IS_STRING_NOT_NULL
    }
}
exports.in_schema={
    body:{
        content:JoiUtils.IS_STRING_NOT_NULL,
        title_desc:JoiUtils.IS_STRING_NOT_NULL,
        commentID:JoiUtils.IS_STRING_NOT_NULL
    }
}