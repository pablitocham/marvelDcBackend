import { getDAOs } from './src/daos/factory.js';

const test = async () => {
    try {
        const { UserDao } = await getDAOs();
        const users = await UserDao.getAll();
        console.log('Usuarios:', users);
    } catch (error) {
        console.error('Error al obtener los DAOs:', error.message);
    }
};

test();
