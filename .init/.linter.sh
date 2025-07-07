#!/bin/bash
cd /home/kavia/workspace/code-generation/wordquest-web-120986-11bae033/word_search_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

