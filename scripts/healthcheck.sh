#!/bin/bash

pingServer() {
  echo $(curl -s localhost:8000/healthCheck)
}

isAppRunning() {
  [[ $(pingServer) == *'App is running'* ]]
  echo $?
}

tmp=${NODE_ENV}
export NODE_ENV=production

npm run genconf.ts-js
npm run up &
end=$((SECONDS + 10))

checkSuccess=$(isAppRunning)
while [[ $SECONDS -lt ${end} && ${checkSuccess} != 0 ]]; do
  sleep 1
  echo "Waiting for app to bring up..."
  checkResult=$(pingServer)
  echo "Check results: $checkResult"
  checkSuccess=$(isAppRunning)
done

pkill --signal sigint node

NODE_ENV=${tmp}
exit "${checkSuccess}"
