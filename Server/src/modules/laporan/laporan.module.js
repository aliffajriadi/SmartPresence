import laporanController from "./laporan.controller.js";

export default (app) => {
    app.use("/api/laporan", laporanController);
}