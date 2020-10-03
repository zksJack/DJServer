let express = require("express");
let carouselService = require("../../service/carousel/carousel");
let expressJoi = require('@escook/express-joi');
let {in_carousel_schema,up_carousel_schema} = require('../../shema/carousel/carousel')
const multer = require('multer')
let path = require('path');
let uploads = multer({dest:path.join(__dirname,"../../uploads")})
let Router = express.Router();

Router.post("/pageQuery",carouselService.pageQuery);
Router.post("/deleteByID",carouselService.deleteByID);
Router.post("/batchDelete",carouselService.batchDelete);
Router.post("/updateById",uploads.single('pic'),expressJoi(up_carousel_schema), carouselService.updateById);
Router.post("/insertById",expressJoi(in_carousel_schema),carouselService.insertById);
Router.post("/selectByID",carouselService.selectByID);
module.exports =Router