let express = require("express");
let forumService = require("../../service/forum/forum");
let forumCommentService = require("../../service/forum/forumComment");
let expressJoi = require('@escook/express-joi');

let Router = express.Router();

Router.post("/pageQueryList",forumService.pageQueryList);
Router.post("/findForumById",forumService.findForumById);
Router.post("/deleteForumById",forumService.deleteForumById);
Router.post("/batchDelete",forumService.batchDelete);

//手机端
Router.post("/insertHuiFu",forumCommentService.insertHuiFu);
Router.post("/findForumCommentById",forumCommentService.findForumCommentById);
module.exports =Router