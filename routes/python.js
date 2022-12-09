
const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
            console.log(req.headers)
            res.status(401).json({data:'received'})
});

module.exports = router;