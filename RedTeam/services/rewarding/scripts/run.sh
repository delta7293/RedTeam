#!/bin/bash
set -euo pipefail


## --- Base --- ##
# Getting path of this script file:
_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
_PROJECT_DIR="$(cd "${_SCRIPT_DIR}/../../.." >/dev/null 2>&1 && pwd)"
cd "${_PROJECT_DIR}" || exit 2

# Loading base script:
# shellcheck disable=SC1091
source ./scripts/base.sh


if [ -z "$(which python)" ]; then
	echoError "'python' not found or not installed."
	exit 1
fi

# Loading .env file (if exists):
if [ -f ".env" ]; then
	# shellcheck disable=SC1091
	source .env
fi
## --- Base --- ##


python -u ./services/rewarding/app.py \
	--wallet.name "${RT_REWARD_APP_WALLET_NAME:-validator}" \
	--wallet.path "${RT_BTCLI_WALLET_DIR:-${RT_BTCLI_DATA_DIR:-/var/lib/sidecar.btcli}/wallets}" \
	--wallet.hotkey "default" \
	--subtensor.network "${RT_BT_SUBTENSOR_NETWORK:-${RT_BT_SUBTENSOR_WS_SCHEME:-ws}://${RT_BT_SUBTENSOR_HOST:-subtensor}:${RT_BT_SUBTENSOR_WS_PORT:-9944}}" \
	--network "${RT_SUBTENSOR_NETWORK:-test}" \
	--netuid "${RT_BT_SUBNET_NETUID:-2}" \
	--reward_app.port "${RT_REWARD_APP_PORT:-47920}" \
	--reward_app.epoch_length "${RT_REWARD_APP_EPOCH_LENGTH:-60}" \
	--validator.cache_dir "${RT_REWARD_APP_DATA_DIR:-/var/lib/server.reward-app}/.cache" \
	--validator.hf_repo_id "${RT_REWARD_APP_HF_REPO:-redteamsubnet61/server.reward-app}" || exit 2
