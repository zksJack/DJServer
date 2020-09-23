let express = require("express");
let forumService = require("../../service/forum/forum");
let expressJoi = require('@escook/express-joi');

let Router = express.Router();

Router.post("/pageQueryList",forumService.pageQueryList);
Router.post("/findForumById",forumService.findForumById);
Router.post("/deleteForumById",forumService.deleteForumById);
Router.post("/batchDelete",forumService.batchDelete);
module.exports =Router