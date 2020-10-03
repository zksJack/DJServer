let Joi = require("@hapi/joi");
module.exports={
    IS_NOT_NULL:Joi.any().required().error(new Error('数据不能为空')),
    IS_INT_NOT_NULL:Joi.number().required().error(new Error('数据必须是数字')),
    IS_STRING_NOT_NULL:Joi.string().required().error(new Error('数据必须是字符型')),
    IS_email: Joi.string().email().required().error(new Error('邮箱格式不正确')),
    IS_sex:Joi.number().valid(1,2).required().error(new Error('性别格式不正确')),
    IS_pwd:Joi.string().regex(/^[a-zA-Z0-9]+$/).error(new Error('密码格式不正确')),
    IS_phone:Joi.string().regex(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/).error(new Error('手机号格式不正确')),
    IS_id_Card:Joi.string().regex(/^\d{15}|\d{18}$/).error(new Error('身份证格式不正确')),
    IS_QQ:Joi.string().regex(/[1-9][0-9]{4,}/).error(new Error('QQ格式不正确')),
    IS_birthday:Joi.string().regex(/^\d{4}-\d{1,2}-\d{1,2}/).error(new Error('生日格式不正确')),
    IS_chinese:Joi.string().regex(/^[\u4e00-\u9fa5]{0,}$/).error(new Error('汉字格式不正确')),
    IS_Longth0_30:Joi.string().regex(/^.{3,20}$/).error(new Error('字符长度在3-20'))
}