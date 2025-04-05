const users = [];

export const userModel = {
  findOne: async ({ email }) => users.find(u => u.email === email),
  create: async (userData) => {
    const user = { ...userData, id: Date.now().toString() };
    users.push(user);
    return user;
  }
};
