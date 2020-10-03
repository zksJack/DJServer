let express = require("express");
let commentService = require("../../service/comment/comment");
let expressJoi = require('@escook/express-joi');
let {up_schema,in_schema} = require('../../shema/comment/comment')
let Router = express.Router();

Router.post("/pageQuery",commentService.pageQuery);
Router.post("/selectById",commentService.selectById);
Router.post("/updateStatus", commentService.updateStatus);
Router.post("/updateById",expressJoi(up_schema),commentService.updateById);
Router.post("/inserCommen",expressJoi(in_schema),commentService.inserCommen);
module.exports =Router