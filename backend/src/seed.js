require("dotenv").config();
const bcrypt = require("bcrypt");
const { randomUUID } = require("crypto");
const { realDb } = require("./config/db");
const UserDao = require("./dao/userDao");

async function seed() {
    const dao = new UserDao(realDb);

    const accounts = [
        {
            email: "admin@remit.local",
            password: "Admin1234!",
            fullName: "Admin User",
            phone: "+447000000001",
            role: "admin",
        },
        {
            email: "dev@remit.local",
            password: "Dev1234!",
            fullName: "Developer User",
            phone: "+447000000002",
            role: "developer",
        },
    ];

    for (const account of accounts) {
        const existing = dao.findByEmail(account.email);
        if (existing) {
            console.log(`⏭  ${account.role} already exists: ${account.email}`);
            continue;
        }

        const passwordHash = await bcrypt.hash(account.password, 10);
        dao.create({
            id: randomUUID(),
            fullName: account.fullName,
            email: account.email,
            phone: account.phone,
            passwordHash,
            role: account.role,
            verificationToken: null,
            createdAt: new Date().toISOString(),
        });

        // Auto-verify seeded accounts
        const user = dao.findByEmail(account.email);
        dao.verify(user.id);
        dao.updateRole(user.id, account.role);

        console.log(`✅ Created ${account.role}: ${account.email} / ${account.password}`);
    }

    console.log("Seed complete.");
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});