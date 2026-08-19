import { Readable } from 'stream';
import Busboy from 'busboy';
import connectDB from '../_lib/db.js';
import Registration from '../_lib/models/Registration.js';
import { setCors } from '../_lib/auth.js';

/**
 * Parse multipart/form-data from the request.
 * Vercel parses the raw stream into a Buffer in req.body for multipart requests.
 */
function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const fields = {};
    const files = {};

    const busboy = Busboy({
      headers: req.headers,
      limits: { fileSize: 2 * 1024 * 1024 } // 2MB per file
    });

    busboy.on('field', (name, value) => {
      fields[name] = value;
    });

    busboy.on('file', (name, stream, info) => {
      const { filename, mimeType } = info;

      // Validate file type
      const allowedTypes = /jpeg|jpg|png|pdf/i;
      const extMatch = filename && allowedTypes.test(filename.split('.').pop());
      const mimeMatch = allowedTypes.test(mimeType);

      if (!extMatch && !mimeMatch) {
        stream.resume(); // drain the stream
        return;
      }

      const chunks = [];
      let truncated = false;

      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('limit', () => { truncated = true; });
      stream.on('end', () => {
        if (truncated) return; // skip oversized files
        const buffer = Buffer.concat(chunks);
        files[name] = {
          filename,
          mimeType,
          base64: `data:${mimeType};base64,${buffer.toString('base64')}`,
          size: buffer.length
        };
      });
    });

    busboy.on('finish', () => resolve({ fields, files }));
    busboy.on('error', reject);

    // Feed Vercel's buffered body directly into busboy
    if (Buffer.isBuffer(req.body)) {
      busboy.end(req.body);
    } else if (req.body && typeof req.body === 'string') {
      // In case Vercel parsed it as a string
      busboy.end(Buffer.from(req.body));
    } else {
      // Fallback for local development or if it's still a stream
      req.pipe(busboy);
    }
  });
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { fields, files } = await parseMultipart(req);

    const count = await Registration.countDocuments();
    const regNumber = `PPDB-2026-${String(count + 1).padStart(4, '0')}`;

    const registrationData = {
      ...fields,
      regNumber
    };

    // Convert raporScore to number if present
    if (registrationData.raporScore) {
      registrationData.raporScore = Number(registrationData.raporScore);
    }

    // Attach files as Base64 data URIs
    if (files.pasFoto) registrationData.pasFoto = files.pasFoto.base64;
    if (files.ijazah) registrationData.ijazah = files.ijazah.base64;
    if (files.rapor) registrationData.rapor = files.rapor.base64;
    if (files.kartuKeluarga) registrationData.kartuKeluarga = files.kartuKeluarga.base64;
    if (files.aktaKelahiran) registrationData.aktaKelahiran = files.aktaKelahiran.base64;
    if (files.suratKeterangan) registrationData.suratKeterangan = files.suratKeterangan.base64;

    // Track which files were submitted
    registrationData.submittedFiles = {
      rapor: !!files.rapor,
      kk: !!files.kartuKeluarga,
      ijazah: !!files.ijazah
    };

    const registration = await Registration.create(registrationData);
    res.status(201).json({ regNumber: registration.regNumber, data: registration });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
}
