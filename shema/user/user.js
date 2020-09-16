let joi = require("@hapi/joi");

let name = joi.string().required();
exports.user_schema={
    one:{
        name
    }
}