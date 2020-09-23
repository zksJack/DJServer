let express = require("express");
let commentService = require("../../service/comment/comment");
let expressJoi = require('@escook/express-joi');
let Router = express.Router();

Router.post("/pageQuery",commentService.pageQuery);
Router.post("/selectById",commentService.selectById);
Router.post("/updateStatus",commentService.updateStatus);
Router.post("/updateById",commentService.updateById);
Router.post("/inserCommen",commentService.inserCommen);
module.exports =Router