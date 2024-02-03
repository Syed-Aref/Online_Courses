const protectedMW = (req, res, next) => {
    if (!req.session.loginUser) {
        return res.render("notAllowed");
      }
      next();
};

module.exports = {protectedMW};