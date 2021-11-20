kill -9 `lsof -i :3000` >/dev/null 2>&1
kill -9 `lsof -i :8444` >/dev/null 2>&1
kill -9 `lsof -i :8445` >/dev/null 2>&1
kill -9 `lsof -i :8446` >/dev/null 2>&1
kill -9 `lsof -i :8447` >/dev/null 2>&1
ps -ef | grep 'ffmpeg' | grep -v grep | awk '{print $2}' | xargs kill -9

# For development
# kill -9 `lsof -i :8443` >/dev/null 2>&1

sleep 3