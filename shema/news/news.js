let Joi = require("@hapi/joi");
let JoiUtils = require('../../utils/joiUtile');
exports.news_Info_schema={
    body:{
        title:JoiUtils.IS_STRING_NOT_NULL,
        author:JoiUtils.IS_STRING_NOT_NULL,
        titleDesc:JoiUtils.IS_STRING_NOT_NULL,
        content:JoiUtils.IS_HTML,
        type:JoiUtils.IS_INT_NOT_NULL,
        newID:JoiUtils.IS_STRING_NOT_NULL
    }
}