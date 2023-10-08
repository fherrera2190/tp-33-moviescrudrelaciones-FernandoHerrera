const db = require("../../database/models");

const add = function(req, res) {
  db.Genre
    .findAll({ order: ["name"] })
    .then(allGenres => {
      // console.log(allGenres);
      res.render("moviesAdd", { allGenres });
    })
    .catch(error => {
      console.log(error);
    });
};

module.exports = add;
