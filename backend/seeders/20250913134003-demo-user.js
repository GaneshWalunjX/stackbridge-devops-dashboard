'use strict';

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash("1234567", 10);

    await queryInterface.bulkInsert("Users", [
      {
        email: "ganesha.swc@gmail.com",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Users", {
      email: "ganesha.swc@gmail.com",
    });
  },
};

