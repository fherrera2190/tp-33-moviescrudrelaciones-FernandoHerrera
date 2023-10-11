const db = require("../database/models");
const sequelize = db.sequelize;

const genresController = {
  list: (req, res) => {
    db.Genre.findAll({ include: ["movies"] }).then(genres => {
      //return res.send(genres);
      res.render("genresList.ejs", { genres });
    });
  },
  detail: (req, res) => {
    db.Genre.findByPk(req.params.id, { include: ["movies"] }).then(genre => {
      res.render("genresDetail.ejs", { genre });
    });
  }
};

module.exports = genresController;
