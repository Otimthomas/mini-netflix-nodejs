const express = require("express");
const { Movie, validate } = require("../models/movies");

const router = express.Router();

router.get("/", async (req, res) => {
	throw new Error("Could not get movies");
	const movies = await Movie.find()
		.select("-__v")
		.sort("title");
	res.send(movies);
});

router.get("/:id", async (req, res) => {
	const movie = await Movie.findById(req.params.id).select("-__v");

	if (!movie)
		return res.status(404).send("A Movie with the given Id was not found");
	res.send(movie);
});

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const movie = new Movie({
		title: req.body.title,
		imgUrl: req.body.imgUrl,
		isFavourite: req.body.isFavourite,
		year: req.body.year
	});

	await movie.save();
	res.send(movie);
});

router.put("/:id", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const movie = await Movie.findByIdAndUpdate(
		req.params.id,
		{
			title: req.body.title,
			imgUrl: req.body.imgUrl,
			isFavourite: req.body.isFavourite,
			year: req.body.year
		},
		{
			new: true
		}
	);

	if (!movie) return res.status(404).send("A movie with that id was not found");
	res.send(movie);
});

router.delete("/:id", async (req, res) => {
	const movie = await Movie.findByIdAndRemove(req.params.id);

	if (!movie) return res.status(404).send("A movie with that id was not found");
	res.send(movie);
});

module.exports = router;
