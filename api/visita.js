import { Redis } from '@upstash/redis';
import crypto from 'crypto';

const redis = Redis.fromEnv();
const SALT = process.env.VISIT_HASH_SALT;
const TTL_SECONDS = Number(process.env.VISIT_TTL_SECONDS) || 31536000; // 1 ano

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  if (!SALT) {
    res.status(500).json({ error: 'contador não configurado (falta VISIT_HASH_SALT)' });
    return;
  }

  try {
    const ip = getClientIp(req);
    const hash = crypto.createHash('sha256').update(ip + SALT).digest('hex');
    const key = `visit:${hash}`;

    const alreadyVisited = await redis.exists(key);

    let total;
    if (alreadyVisited) {
      total = await redis.get('total_visitas');
    } else {
      total = await redis.incr('total_visitas');
      await redis.set(key, '1', { ex: TTL_SECONDS });
    }

    res.status(200).json({ total: Number(total) || 0, counted: !alreadyVisited });
  } catch (err) {
    res.status(200).json({ total: null, counted: false });
  }
}
