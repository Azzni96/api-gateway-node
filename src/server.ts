import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { ClientRequest } from 'http';

const app = express();
const PORT = Number(process.env.PORT || 3008);

// إعدادات أساسية
app.disable('x-powered-by');
app.set('trust proxy', true);
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// -------- Proxy #1: JSONPlaceholder --------
app.use(
  '/api1',
  createProxyMiddleware({
    target: 'https://jsonplaceholder.typicode.com',
    changeOrigin: true,
    secure: true,
    pathRewrite: { '^/api1': '' } // /api1/posts -> /posts
  })
);

// -------- Proxy #2: httpbin --------
app.use(
  '/api2',
  createProxyMiddleware({
    target: 'https://httpbin.org',
    changeOrigin: true,
    secure: true,
    pathRewrite: { '^/api2': '' } // /api2/get -> /get
  })
);


const OWM_HOST = 'https://api.openweathermap.org';

app.use(
  '/weather',
  createProxyMiddleware({
    target: OWM_HOST,          
    changeOrigin: true,
    secure: true,

   
    pathRewrite: (path: string, req: Request) => {
    
      let rest = path.replace(/^\/weather/, ''); 
      if (rest === '' || rest === '/') rest = '/weather';


      const allowed = new Set(['/weather', '/forecast']);
      const seg = rest.split('?')[0];
      const endpoint = allowed.has(seg) ? seg : '/weather';

    
      const originalUrl = (req.url || '').replace(/[\r\n\t]/g, '');
      const qs = originalUrl.includes('?') ? originalUrl.split('?')[1] : '';
      const params = new URLSearchParams(qs);

      
      if (!params.has('appid')) params.set('appid', process.env.WEATHER_API_KEY ?? '');
      if (!params.has('units')) params.set('units', 'metric');

      const finalPath = `/data/2.5${endpoint}?${params.toString()}`;
      console.log('OWM ->', finalPath.replace(/(appid=)[^&]+/i, '$1***'));
      return finalPath;
    },
  })
);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Gateway error:', err);
  res.status(500).json({ error: 'Internal gateway error' });
});

app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`);
  console.log(`API 1:   http://localhost:${PORT}/api1/posts`);
  console.log(`API 2:   http://localhost:${PORT}/api2/get`);
  console.log(`Weather: http://localhost:${PORT}/weather/weather?q=Helsinki`);
});
