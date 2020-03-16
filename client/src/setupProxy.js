const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(createProxyMiddleware('/api/*', {
        target: "http://localhost:5000",
        onProxyReq(proxyReq) {
            if (proxyReq.getHeader("origin")) {
                proxyReq.setHeader("origin", "http://localhost:3000");
            }
        },
        changeOrigin: true,
        logLevel: "debug",
    }));
}