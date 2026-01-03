//src/modules/user/user.module.js

import userController from "./user.controller.js";

export default (app) => {
  app.use("/api/user", userController);
};