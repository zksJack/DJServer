let Joi = require("@hapi/joi");
let JoiUtils = require('../../utils/joiUtile')
exports.in_schema={
   body:{
        is_accept:JoiUtils.IS_INT_NOT_NULL,
        reason:JoiUtils.IS_STRING_NOT_NULL,
        reportId:JoiUtils.IS_STRING_NOT_NULL
   }
}
exports.up_Accept_schema={
    body:{
        is_accept:JoiUtils.IS_INT_NOT_NULL,
        reason:JoiUtils.IS_STRING_NOT_NULL,
        reportId:JoiUtils.IS_STRING_NOT_NULL
    }
 }
 exports.in_report_schema={
    body:{
        istype:JoiUtils.IS_INT_NOT_NULL,
        userID:JoiUtils.IS_STRING_NOT_NULL,
    }
 }