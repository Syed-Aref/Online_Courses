const getLogout = (req, res) => {
    // Redirect to login page/homepage
    res.redirect("/login");
};

module.exports = {getLogout};