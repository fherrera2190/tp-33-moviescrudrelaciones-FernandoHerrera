const db = require("../../database/models");
const paginate = require("express-paginate");
const list = (req, res) => {
  db.Movie
    .findAndCountAll({
      include: ["genre"],
      limit: req.query.limit,
      offset: req.skip
    })
    .then((result) => {
      const pagesCount = Math.ceil(result.count / req.query.limit);
      // console.log(pagesCount);
      console.log(res.locals.paginate.href().prev);
      return res.render("moviesList.ejs", {
        movies: result.rows,
        pages: paginate.getArrayPages(req)(
          pagesCount,
          pagesCount,
          req.query.page
        ),
        paginate:res.locals.paginate,
        pagesCount,
        currentPage: req.query.page
      });
    });
};

module.exports = list;
