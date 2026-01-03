import rfidController from "./rfid.controller.js";

export default (app) => {
    app.use("/api/rfid", rfidController);
};