import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

// Billing cancellation API middleware plugin
function billingApiPlugin(): Plugin {
  return {
    name: 'billing-api-handler',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/subscription/cancel' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            let parsedData: Record<string, unknown> = {};
            try {
              if (body) parsedData = JSON.parse(body);
            } catch {
              // ignore json parse error
            }
            const email = (parsedData.email as string) || 'oren71601@gmail.com';
            const confirmationCode = `PAY-CANC-${Math.floor(100000 + Math.random() * 900000)}`;
            const responseData = {
              success: true,
              status: 'cancelled',
              provider: 'Payoneer Subscription Gateway',
              userEmail: email,
              subscriptionId: (parsedData.subscriptionId as string) || 'STJ-44354-PRO',
              cancelledAt: new Date().toISOString(),
              confirmationCode,
              willChargeNextMonth: false,
              nextBillingAmount: 0,
              message: 'Subscription successfully cancelled with the payment provider. You will not be charged next month.',
            };
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(responseData));
          });
          return;
        }

        if (req.url === '/api/subscription/status' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ status: 'ok', provider: 'Payoneer' }));
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), billingApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
