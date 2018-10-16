var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
    console.log(req.userInfo.id);
    res.render('main/index',{
        userInfo:req.userInfo
    });
});

module.exports = router;