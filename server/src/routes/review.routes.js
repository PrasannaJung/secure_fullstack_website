const router = require("express").Router();

const reviewController = require("../controllers/review.controller");
const isAuthenticated = require("../middlewares/isAuthenticated.middleware");

router.post("/create", isAuthenticated, reviewController.createReview);
router.get("/user", isAuthenticated, reviewController.getReviewsForUser);

// KEEP THIS ROUTE AT THE END SO THAT IT DOES NOT CONFLICT WITH OTHER ROUTES BECAUSE IT WILL MATCH ANYTHING DUE TO THE DYNAMIC PARAMETER
router.get("/service/:serviceId", reviewController.getReviewsForService);

module.exports = router;
