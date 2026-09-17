"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const monitoringController_1 = require("../controllers/monitoringController");
const router = (0, express_1.Router)();
// Endpoint to fetch the complete monitoring dashboard data
router.get('/dashboard', monitoringController_1.getMonitoringDashboard);
// Endpoint to fetch map data
router.get('/map', monitoringController_1.getMapData);
exports.default = router;
