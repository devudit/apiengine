#!/usr/bin/env bash
chmod +x server.js
pm2 start server.js --watch --max-restarts=3 &