let Joi = require("@hapi/joi");
let JoiUtils = require('../../utils/joiUtile')
exports.intergral_schema={
    body:{
       user_id:JoiUtils.IS_STRING_NOT_NULL,
       type:JoiUtils.IS_INT_NOT_NULL, 
       type_name:JoiUtils.IS_STRING_NOT_NULL,
       cur_max:JoiUtils.IS_INT_NOT_NULL,
       single_desc:JoiUtils.IS_INT_NOT_NULL,
       max_num:JoiUtils.IS_INT_NOT_NULL,
    }
}
exports.intergral_rule_schema={
    body:{
       ruleId:JoiUtils.IS_STRING_NOT_NULL,
       type:JoiUtils.IS_INT_NOT_NULL, 
       type_name:JoiUtils.IS_STRING_NOT_NULL,
       cur_max:JoiUtils.IS_INT_NOT_NULL,
       single_desc:JoiUtils.IS_INT_NOT_NULL,
    }
}

