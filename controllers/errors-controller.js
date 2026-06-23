// 404 Error handling middleware
exports.handle404 = (req, res, next) => {
  res.status(404).render("404-error", {
    pageTitle: "Page Not Found",
    currentPage: "404Error",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};
