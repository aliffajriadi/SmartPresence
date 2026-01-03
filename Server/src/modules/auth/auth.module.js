import authController from "./auth.controller.js";

export default (app) => {
    app.use("/api/auth", authController);
};
