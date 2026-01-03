import resetpasswordController from "./resetpassword.controller.js";


export default (app) => {
    app.use("/api/lupa-password", resetpasswordController);
}
