#!/bin/bash

redirect_uri="http://localhost:8888/"

if [ $# -ne 2 ]; then
  echo "Usage: $0 <facebook appId> <facebook appSecret> "
  exit 1
fi

open "https://www.facebook.com/v2.8/dialog/oauth?client_id=$1&redirect_uri=$redirect_uri&scope=user_likes,manage_pages,user_posts"

nc -l 8888 >facebook.authcode <<EOF
HTTP 1.0 200 OK
Content-Type: text/html

<html><body><h1>OK</h1></body></html>
EOF

code=$(sed -E -e 's|GET /[?]code=([^ ]+) HTTP/1[.]1|\1|' -e t -e d facebook.authcode |tr -d "\r\n")

curl "https://graph.facebook.com/v2.8/oauth/access_token?client_id=$1&redirect_uri=$redirect_uri&client_secret=$2&code=$code" -o facebook.access_token

jq -r ".access_token" facebook.access_token
