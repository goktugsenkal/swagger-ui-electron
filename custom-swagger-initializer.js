// public/swagger-ui-dist/swagger-initializer.js
window.onload = function() {
  // parse ?file= parameter
  const params = new URLSearchParams(window.location.search);
  const swaggerFileUrl = params.get("file");

  window.ui = SwaggerUIBundle({
    url: swaggerFileUrl,
    dom_id: "#swagger-ui",
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  });
};
