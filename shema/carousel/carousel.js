let Joi = require("@hapi/joi")
let JoiUtils = require('../../utils/joiUtile')
exports.in_carousel_schema={
    body:{
        title:JoiUtils.IS_STRING_NOT_NULL,
        url:JoiUtils.IS_STRING_NOT_NULL,
        img_url:JoiUtils.IS_STRING_NOT_NULL,
        priority:JoiUtils.IS_INT_NOT_NULL,
        type:JoiUtils.IS_INT_NOT_NULL,
        status:JoiUtils.IS_INT_NOT_NULL
    }
}
exports.up_carousel_schema={
    body:{
        carouselId:JoiUtils.IS_STRING_NOT_NULL,
        title:JoiUtils.IS_STRING_NOT_NULL,
        url:JoiUtils.IS_STRING_NOT_NULL,
        img_url:JoiUtils.IS_STRING_NOT_NULL,
        priority:JoiUtils.IS_INT_NOT_NULL,
        type:JoiUtils.IS_INT_NOT_NULL,
        status:JoiUtils.IS_INT_NOT_NULL
    }
}