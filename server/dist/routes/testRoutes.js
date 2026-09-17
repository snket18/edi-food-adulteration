"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testController_1 = require("../controllers/testController");
const router = (0, express_1.Router)();
// Endpoint to run ML analysis on captured spectrum
router.post('/analyze', testController_1.analyzeTest);
// Endpoint to save a finalized test result
router.post('/', testController_1.saveTest);
// Endpoints to fetch history
router.get('/', testController_1.getTests);
router.get('/:id', testController_1.getTestById);
exports.default = router;
