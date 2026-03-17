import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import NTPClient, { NTP_EVENTS } from 'ntp.js';

const ntpMaps = new Map<number, NTPClient>();

const app = express();

app.get('/api/healthcheck', (_, res) => {
  res
    .type('json')
    .send({
      msg: 'ok'
    });
});

app.get('/api/time', (req, res) => {
  const getRequestTime = Date.now();

  const reqTime = parseInt(req.query.reqTime as string);
  if (!reqTime || isNaN(reqTime) || reqTime < 0) {
    return res
      .status(400)
      .type('json')
      .send({
        msg: 'No reqTime provided'
      });
  }

  const identity = Math.floor(getRequestTime / 1000);
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
    const fetchEndTime = Date.now();
    clearNTPClient();

    const fetchCost = fetchEndTime - fetchStartTime;
    const clientToServerOffset = reqTime - getRequestTime;
    const totalOffset = (fetchStartTime - getRequestTime) + fetchCost + clientToServerOffset;

    res
      .type('json')
      .send({
        msg: 'ok',
        data: {
          ntpResponseTime: reqTime + totalOffset,
          ntpTime: (new Date(time)).getTime(),
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

  const fetchStartTime = Date.now();
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
