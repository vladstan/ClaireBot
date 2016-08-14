import Koa from 'koa';

import logger from '../utils/logger';
import requestLogger from '../middleware/request-logger';
import bodyParser from '../middleware/body-parser';

import config from '../config';
import router from './router';

const app = new Koa();

app.use(requestLogger());
app.use(bodyParser({limit: '1mb'}));
app.use(router.routes());

app.listen(config.port, () => {
  logger.info('listening on port %s', config.port);
});

export default app;