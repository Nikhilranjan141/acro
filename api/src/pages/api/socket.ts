import { NextApiRequest } from 'next';
import { NextApiResponseServerIO, initSocketServer } from '../../lib/socketServer';
import { setSimulatorSocket, startSimulator } from '../../lib/simulator';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (req.method === 'POST') {
    // For manual triggers or wakeups
    initSocketServer(res);
    res.status(200).json({ success: true, message: 'Socket initialized' });
    return;
  }

  // GET requests are typically used by clients to initiate the handshake
  const io = initSocketServer(res);
  setSimulatorSocket(io);
  startSimulator();

  res.end();
}
