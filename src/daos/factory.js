import { CONFIG } from '../config/config.js';
import { PERSISTENCE } from '../common/constants/persistence.js';

export async function getDAOs() {
    switch (CONFIG.PERSISTENCE) {
        case PERSISTENCE.MONGODB:
            const mongoDAOs = await import('./mongo/index.js');
            return mongoDAOs;
        case PERSISTENCE.MEMORY:
            const memoryDAOs = await import('./memory/index.js');
            return memoryDAOs;
        default:
            throw new Error('Invalid persistence type');
    }
}
