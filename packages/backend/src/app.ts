import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import NTPClient, { NTP_EVENTS } from 'ntp.js';

const ntpMaps = new Map<number, NTPClient>();

const app = express();

app.use(express.static('public'));

app.get('/api/healthcheck', (_, res) => {
  res
    .type('json')
    .send({
      msg: 'ok'
    });
});

app.get('/api/time', (req, res) => {
  const serverReceiveTime = Date.now();

  const identity = Math.floor(Date.now() / 1000);
  if (ntpMaps.has(identity)) {
    return res
      .status(409)
      .type('json')
      .send({
        msg: 'Already had a client'
      });
  }

  let ntpServer = process.env.NTP_SERVER || 'time.cloudflare.com';
  if (req.query.ntpServer && typeof req.query.ntpServer === 'string') {
    ntpServer = req.query.ntpServer;
  }

  const ntpClient = new NTPClient({
    poolServerName: ntpServer,
  });
  ntpMaps.set(identity, ntpClient);

  const clearNTPClient = () => {
    ntpClient.stop();
    ntpMaps.delete(identity);
  }

  ntpClient.on(NTP_EVENTS.SYNC, (time) => {
    const serverSendTime = Date.now();
    clearNTPClient();

    res
      .type('json')
      .send({
        msg: 'ok',
        data: {
          ntpTime: (new Date(time)).getTime(),
          serverReceiveTime,
          serverSendTime,
        }
      });
  });

  ntpClient.on(NTP_EVENTS.ERROR, (error) => {
    clearNTPClient();
    res
      .status(500)
      .type('json')
      .send({
        msg: 'Failed to fetch NTP server',
        error: error.toString(),
      });
  });

  ntpClient.forceUpdate().then().catch();
});

const server = createServer(app);
server.listen(process.env.SERVER_PORT || 5000);
console.log(`Server is listening on port ${process.env.SERVER_PORT || 5000}`);

// For Vite's HMR compatibility
if (import.meta.hot) {
  const close = () => server.close();

  import.meta.hot.accept(close);
  import.meta.hot.dispose(close);
}
