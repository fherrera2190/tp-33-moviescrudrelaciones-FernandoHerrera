const { validationResult } = require("express-validator");
const db = require("../../database/models");

const create = function(req, res) {
  // TODO
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("moviesAdd", {
      errors: errors.mapped(),
      old: req.body
    });
  }
  console.log("Sigo por aca");
  const { title, rating, awards, release_date, length, genre_id } = req.body;
  db.Movie
    .create({
      title: title.trim(),
      rating,
      awards,
      release_date,
      length,
      genre_id
    })
    .then(movie => {
      return res.redirect("/movies");
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = create;
