const getIndex =   (req, res) => {
    console.log("(SystemMessage_getIndex_indexCtrl.js) ");
    console.log(req.session);  
    console.log(process.env.STRIPE_PUBLISHABLE_KEY);
    console.log(process.env.STRIPE_SECRET_KEY);
    res.render("index");
};

module.exports = {getIndex};