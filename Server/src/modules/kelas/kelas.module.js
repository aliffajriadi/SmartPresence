import kelasController from "./kelas.controller.js";

export default (app) => {
    app.use("/api/kelas", kelasController);
}