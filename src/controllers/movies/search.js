const { Op } = require("sequelize");
const db = require("../../database/models");
const axios = require("axios");
const moment = require("moment");
require("dotenv").config();
const URL_BASE = process.env.URL_BASE;

const translate = require("translatte");

module.exports = async (req, res) => {
  const keyword = req.query.keyword;

  try {
    const movies = await db.Movie.findAll({
      where: {
        title: { [Op.substring]: keyword }
      }
    });
    console.log(movies)
    if (!movies.length) {
      const response = await axios.get(URL_BASE + "&t=" + keyword);
      console.log(response)
      if(response.data.Error){
        return res.render("index", { title: "Digital Movies", movies,error:response.data.Error });
      }
      const {
        Title,
        Released,
        Genre,
        Awards,
        Poster,
        Ratings,
        Runtime
      } = response.data;
      const awardsArray = Awards.match(/\d+/g);
      const awards =awardsArray? awardsArray.reduce((acum, num) => +acum + +num, 0):0;
      const length = Runtime.split(" ")[0];
      const rating = !Ratings?+Ratings[0].Value.split("/")[0]:0;
      const release_date = moment(Released).toDate();
      const image = Poster;
      const newGenre = Genre.split(",")[0];
      let genre_id;
      if (newGenre) {
        const genres = await db.Genre.findAll({ order: [["ranking", "DESC"]] });
        const { text } = await translate(newGenre, { to: "es" });
        const [genre, genreCreated] = await db.Genre.findOrCreate({
          where: { name: text },
          defaults: {
            active: 1,
            ranking: genres[0].ranking + 1
          }
        });
        genre_id = genre.id;
      }
      const newMovie = {
        title: Title,
        awards,
        length,
        rating,
        release_date,
        image,
        genre_id
      };
      const ultimaMovie = await db.Movie.create(newMovie);
      //   return res.json(ultimaMovie.dataValues);
      return res.render("index", {
        title: "Digital Movies",
        movies: [ultimaMovie.dataValues]
      });
    } else {
      return res.render("index", { title: "Digital Movies", movies });
    }
  } catch (error) {
    console.log(error);
  }
};
