import http.server
import socketserver

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Проверяем, что файл существует
        if self.path != '/' and not self.path.endswith('.js') and not self.path.endswith('.css') and not self.path.endswith('.json') and not self.path.endswith('.png') and not self.path.endswith('.jpg') and not self.path.endswith('.ico'):
            self.path = '/'  # Перенаправляем все нестатические запросы на root
        return super().do_GET()

PORT = 3000
Handler = CustomHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving on port {PORT}")
    httpd.serve_forever()
