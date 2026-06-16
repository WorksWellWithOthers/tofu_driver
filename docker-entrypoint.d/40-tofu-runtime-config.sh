#!/bin/sh
set -eu

config_file="/usr/share/nginx/html/static/nospill/runtime-config.js"

json_bool() {
  case "$(printf '%s' "${1:-}" | tr '[:upper:]' '[:lower:]')" in
    1|true|yes|on) printf 'true' ;;
    *) printf 'false' ;;
  esac
}

json_string() {
  printf '%s' "${1:-}" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

posthog_host="${TOFU_DRIVER_POSTHOG_HOST:-https://us.i.posthog.com}"

cat > "$config_file" <<EOF
"use strict";

window.TOFU_DRIVER_CONFIG = {
  posthogEnabled: $(json_bool "${TOFU_DRIVER_POSTHOG_ENABLED:-}"),
  posthogKey: "$(json_string "${TOFU_DRIVER_POSTHOG_KEY:-}")",
  posthogHost: "$(json_string "$posthog_host")",
  posthogDebug: $(json_bool "${TOFU_DRIVER_POSTHOG_DEBUG:-}"),
};
EOF
