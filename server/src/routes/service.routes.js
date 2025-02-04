const router = require("express").Router();

const serviceController = require("../controllers/service.controller");
const isAdmin = require("../middlewares/isAdmin.middleware");
const isAuthenticated = require("../middlewares/isAuthenticated.middleware");

router.post("/create", serviceController.createService);
router.get("/", serviceController.getAllServices);
router.get("/search", serviceController.getAllServicesNameAndId);
router.get("/:id", serviceController.getSingleService);
router.put(
  "/update/:id",
  isAuthenticated,
  isAdmin,
  serviceController.updateServiceStatus,
);

module.exports = router;
