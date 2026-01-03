import { createUser } from "../src/modules/user/user.repository.js";
import { hashPassword } from "../src/utils/helper/bcrypt.js";

console.log("✅ Mulai membuat seeder admin");
const main = async () => {
  try {
    const hashedPassword = await hashPassword("password");

    const user = await createUser({
      name: "Admin",
      role: "admin",
      password: hashedPassword,
      nohp: "08123456789",
    });

    console.log(user);
    console.log("✅ Berhasil membuat seeder admin");
  } catch (error) {
    console.error("❌ Gagal membuat seeder admin:", error.message);
  } finally {
    process.exit(0);
  }
};

main();