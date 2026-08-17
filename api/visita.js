import { Redis } from '@upstash/redis';
import crypto from 'crypto';

const redis = Redis.fromEnv();
const SALT = process.env.VISIT_HASH_SALT;
const TTL_SECONDS = Number(process.env.VISIT_TTL_SECONDS) || 31536000; // 1 ano
const DAILY_DEDUP_TTL_SECONDS = 60 * 60 * 26; // ~26h, cobre a virada do dia com folga

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function ymd(date) {
  return date.toISOString().slice(0, 10);
}

function shiftDays(date, days) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function startOfMonth(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function rangeDates(start, end) {
  const dates = [];
  for (let d = new Date(start); d <= end; d = shiftDays(d, 1)) {
    dates.push(ymd(d));
  }
  return dates;
}

async function computeVisitStats() {
  const today = new Date();
  const todayStr = ymd(today);
  const yesterday = shiftDays(today, -1);

  const semanaDates = rangeDates(shiftDays(today, -6), today);
  const semanaAnteriorDates = rangeDates(shiftDays(today, -13), shiftDays(today, -7));

  const mesStart = startOfMonth(today);
  const mesDates = rangeDates(mesStart, today);

  const mesAnteriorEnd = shiftDays(mesStart, -1);
  const mesAnteriorStart = startOfMonth(mesAnteriorEnd);
  const mesAnteriorDates = rangeDates(mesAnteriorStart, mesAnteriorEnd);

  const todosOsDias = Array.from(
    new Set([...semanaDates, ...semanaAnteriorDates, ...mesDates, ...mesAnteriorDates])
  );

  const valores = todosOsDias.length > 0 ? await redis.mget(...todosOsDias.map((d) => `visits:day:${d}`)) : [];
  const porDia = Object.fromEntries(todosOsDias.map((d, i) => [d, Number(valores[i]) || 0]));

  const soma = (dates) => dates.reduce((acc, d) => acc + (porDia[d] || 0), 0);
  const total = Number((await redis.get('total_visitas')) || 0);

  return {
    hoje: porDia[todayStr] || 0,
    ontem: porDia[ymd(yesterday)] || 0,
    semana: soma(semanaDates),
    semanaAnterior: soma(semanaAnteriorDates),
    mes: soma(mesDates),
    mesAnterior: soma(mesAnteriorDates),
    total,
    ultimosSeteDias: semanaDates.map((d) => ({ data: d, total: porDia[d] || 0 })),
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    try {
      res.status(200).json(await computeVisitStats());
    } catch (err) {
      res.status(500).json({ error: 'não foi possível calcular as estatísticas' });
    }
    return;
  }

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

    // Contagem diária, independente da dedup de 1 ano acima — alimenta as
    // métricas de hoje/semana/mês da Visão Geral, sem mexer no total_visitas.
    const todayKey = ymd(new Date());
    const dailyDedupKey = `visit:day:${hash}:${todayKey}`;
    const alreadyVisitedToday = await redis.exists(dailyDedupKey);
    if (!alreadyVisitedToday) {
      await redis.incr(`visits:day:${todayKey}`);
      await redis.set(dailyDedupKey, '1', { ex: DAILY_DEDUP_TTL_SECONDS });
    }

    res.status(200).json({ total: Number(total) || 0, counted: !alreadyVisited });
  } catch (err) {
    res.status(200).json({ total: null, counted: false });
  }
}
