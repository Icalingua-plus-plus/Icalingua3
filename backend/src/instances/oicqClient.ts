import { createClient } from 'oicq';
import settings from '../settings.js';
import { oicqDataPath } from '../utils/pathUtils.js';

const oicqClient = createClient(settings.qid, {
  platform: 2,
  data_dir: oicqDataPath,
});

export default oicqClient;
