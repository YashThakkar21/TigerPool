#!/bin/bash
export APP_SECRET_KEY=testing
cd Frontend
npm install
npm run build
cd ../Server
python runserver.py $1
cd ..