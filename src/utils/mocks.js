import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

export const mockUsers = async (quantity) => {
    const users = [];

    for (let i = 0; i < quantity; i++) {
        const hashedPassword = await bcrypt.hash("coder123", 10);
        users.push({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            age: faker.number.int({ min: 18, max: 80 }),
            email: faker.internet.email(),
            password: hashedPassword,
            role: "user",
            pets: [],
        });
    }
    return users;
}
export const mockPets = async (quantity) => {
    const pets = [];

    for (let i = 0; i < quantity; i++) {
        pets.push({
            name: faker.animal.dog(),
            species: faker.animal.type(),
            age: faker.number.int({ min: 1, max: 15 }),
        });
    }
    return pets;
}