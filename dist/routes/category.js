"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = require("express");
const category_1 = require("../controller/category");
const authenticator_1 = require("../middlewares/authenticator");
const roleBasedPermission_1 = require("../middlewares/roleBasedPermission");
const category_2 = require("../middlewares/category");
const categoryRouter = (0, express_1.Router)();
exports.categoryRouter = categoryRouter;
// Admin routes
categoryRouter.post("/", authenticator_1.authenticateUser, category_2.createCategoryValidatorMiddleware, (0, roleBasedPermission_1.authorizeRoles)("Admin"), category_1.createCategory);
categoryRouter.delete("/:categoryId", category_1.deleteCategory);
// client side routes
categoryRouter.get("/", category_1.getAllCategory);
//# sourceMappingURL=category.js.map