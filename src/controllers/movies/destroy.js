const db = require("../../database/models");

const destroy = function(req, res) {
  // TODO
  db.ActorMovie
    .destroy({
      where: {
        movie_id: req.params.id
      }
    })
    .then(reponse => {
      db.Actor
        .update(
          {
            favorite_movie_id: null
          },
          {
            where: {
              favorite_movie_id: req.params.id
            }
          }
        )
        .then(response => {
          console.log(response);
          db.Movie
            .destroy({
              where: {
                id: req.params.id
              }
            })
            .then(result => {
              console.log(response);
              res.redirect("/movies");
            });
        });
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = destroy;
