"""Serve the exported RUCFC site on this computer only."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

site_directory = Path(__file__).resolve().parent / "out"
if not (site_directory / "index.html").is_file():
    raise SystemExit("请先执行 npm run build:local 生成 out/ 目录。")

handler = partial(SimpleHTTPRequestHandler, directory=str(site_directory))
try:
    server = ThreadingHTTPServer(("127.0.0.1", 3000), handler)
except OSError as exc:
    raise SystemExit("无法使用 3000 端口；如果预览已在运行，请直接打开 http://127.0.0.1:3000 。") from exc
print("RUCFC 本地预览：http://127.0.0.1:3000", flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
