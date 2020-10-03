let express = require("express");
let forumService = require("../../service/forum/forum");
let forumCommentService = require("../../service/forum/forumComment");
let expressJoi = require('@escook/express-joi');
let {in_huifu_schema,in_forum_schema} = require('../../shema/forum/forum')
let Router = express.Router();

Router.post("/pageQueryList",forumService.pageQueryList);
Router.post("/findForumById",forumService.findForumById);
Router.post("/deleteForumById",forumService.deleteForumById);
Router.post("/batchDelete",forumService.batchDelete);

//手机端
Router.post("/insertHuiFu",expressJoi(in_huifu_schema), forumCommentService.insertHuiFu);
Router.post("/findForumCommentById",forumCommentService.findForumCommentById);
Router.post("/insertForum",expressJoi(in_forum_schema),forumService.insertForum);
module.exports =Router