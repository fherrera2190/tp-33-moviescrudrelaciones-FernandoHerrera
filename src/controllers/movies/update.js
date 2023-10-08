const db = require("../../database/models");

const update = function(req, res) {
  // TODO
  const { title, awards, rating, length, release_date, genre_id } = req.body;

  // actors = typeof actors === "string" ? [actors] : actors;
  const actors = [req.body.actors].flat();

  db.Movie
    .update(
      {
        title: title.trim(),
        awards,
        rating,
        length,
        release_date,
        genre_id
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
    .then(() => {
      db.Actor_Movie
        .destroy({
          where: {
            movie_id: req.params.id
          }
        })
        .then(() => {
          if (actors) {
            const actorsDB = actors.map(actor => {
              return {
                movie_id: req.params.id,
                actor_id: actor
              };
            });
            db.Actor_Movie
              .bulkCreate(actorsDB, {
                validate: true
              })
              .then(() => {
                console.log("Actores agregados correctamente");
              });
          }
        });
    })
    .catch(err => console.log(err))
    .finally(() => res.redirect("/movies"));
};
module.exports = update;
