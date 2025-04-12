export const flashMessage = (req, res, next) => {
  console.log(req.session);
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
};
