let Joi = require("@hapi/joi");
let JoiUtils = require('../../utils/joiUtile')
exports.in_schema={
    body:{
         title:JoiUtils.IS_STRING_NOT_NULL,
         content:JoiUtils.IS_STRING_NOT_NULL
    }
 }
 exports.up_schema={
     body:{
         title:JoiUtils.IS_STRING_NOT_NULL,
         content:JoiUtils.IS_STRING_NOT_NULL,
         noticeId:JoiUtils.IS_STRING_NOT_NULL,
     }
  }