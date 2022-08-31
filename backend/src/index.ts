import onMessage from './services/messageHandler.js';
import socketPool from './services/socketHandler.js';

onMessage.subscribe();
socketPool.map(() => false);
