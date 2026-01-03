import * as rfidRepository from "./rfid.repository.js";

export const getUserByRfid = async (id) => {
  const rfid = await rfidRepository.getUserByRfid(id);
  if (!rfid) {
    throw new Error("RFID not found");
  }
  return rfid;
};
