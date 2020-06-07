#!/bin/bash

BASEDIR=$(dirname "$0")

PROFILE=$1

PROJECT_ROOT="$BASEDIR/.."
CONF_DIR="$PROJECT_ROOT/envConf"

echo -e "\e[36m[profile] \e[32m${PROFILE:-dev}\e[39m"

declare -A CONFIGS
readConfig() {
  while IFS='' read -r line; do
    CONFIGS[$(echo $line | sed s/\"//g)]=$(jq ".$line" "$CONF_DIR/env$1.json" | sed s/\"//g)
  done < <(jq 'keys[]' "$CONF_DIR/env$1.json")
}

replaceCofig() {
  for key in "${!CONFIGS[@]}"; do
    sed -i s,\$$key,${CONFIGS[$key]},g "$PROJECT_ROOT/$1"
  done
}

readConfig
if [[ $PROFILE ]]; then
  if [[ $(ls $CONF_DIR | grep "env-$PROFILE.json" | wc -l) == 0 ]]; then
    echo "Profile: '$PROFILE' not found. Exiting now..."
    exit 1
  fi
  readConfig -$PROFILE
fi

cp $CONF_DIR/keycloak-template.json $PROJECT_ROOT/keycloak.json
replaceCofig keycloak.json

profiles=(test stage prod)

if [[ " ${profiles[@]} " =~ " ${PROFILE} " ]]; then
  cp $CONF_DIR/app-template.yaml $PROJECT_ROOT/app.yaml
  replaceCofig app.yaml
fi
