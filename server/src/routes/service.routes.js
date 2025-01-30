const router = require("express").Router();

const serviceController = require("../controllers/service.controller");

router.post("/create", serviceController.createService);
router.get("/", serviceController.getAllServices);
router.get("/search", serviceController.getAllServicesNameAndId);
router.get("/:id", serviceController.getSingleService);

module.exports = router;
