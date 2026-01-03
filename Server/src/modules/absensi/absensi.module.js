import absensiController from "./absensi.controller.js";

export default (app) => {
    app.use("/api/absensi", absensiController);
}