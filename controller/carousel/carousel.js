let express = require("express");
let carouselService = require("../../service/carousel/carousel");
let expressJoi = require('@escook/express-joi');
let Router = express.Router();

Router.post("/pageQuery",carouselService.pageQuery);
Router.post("/deleteByID",carouselService.deleteByID);
Router.post("/batchDelete",carouselService.batchDelete);
Router.post("/updateById",carouselService.updateById);
Router.post("/insertById",carouselService.insertById);
module.exports =Router