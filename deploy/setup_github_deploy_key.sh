#!/usr/bin/env bash
set -euo pipefail

KEY_PATH="${HOME}/.ssh/github_actions_vps"

read -rp "VPS IP or hostname: " VPS_HOST
read -rp "VPS SSH user [root]: " VPS_USER
VPS_USER="${VPS_USER:-root}"

echo
echo "==> Generating deploy key..."
mkdir -p "${HOME}/.ssh"
chmod 700 "${HOME}/.ssh"

if [ -f "$KEY_PATH" ] || [ -f "${KEY_PATH}.pub" ]; then
  echo "Key already exists at $KEY_PATH"
  read -rp "Overwrite it? [y/N]: " OVERWRITE
  if [[ ! "$OVERWRITE" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
  fi
  rm -f "$KEY_PATH" "${KEY_PATH}.pub"
fi

ssh-keygen -t ed25519 -C "github-actions-deploy" -f "$KEY_PATH" -N ""

echo
echo "==> Public key:"
cat "${KEY_PATH}.pub"

echo
echo "==> Copying public key to ${VPS_USER}@${VPS_HOST} ..."
if command -v ssh-copy-id >/dev/null 2>&1; then
  ssh-copy-id -i "${KEY_PATH}.pub" "${VPS_USER}@${VPS_HOST}"
else
  PUB_KEY="$(cat "${KEY_PATH}.pub")"
  ssh "${VPS_USER}@${VPS_HOST}" "mkdir -p ~/.ssh && chmod 700 ~/.ssh && touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && grep -qxF '$PUB_KEY' ~/.ssh/authorized_keys || echo '$PUB_KEY' >> ~/.ssh/authorized_keys"
fi

echo
echo "==> Testing SSH login with the new key..."
ssh -i "$KEY_PATH" -o BatchMode=yes -o StrictHostKeyChecking=accept-new "${VPS_USER}@${VPS_HOST}" "echo SSH login successful"

echo
echo "==> Add these GitHub Actions secrets:"
echo "VPS_HOST = ${VPS_HOST}"
echo "VPS_USER = ${VPS_USER}"
echo
echo "SSH_PRIVATE_KEY value:"
echo "----------------------------------------"
cat "$KEY_PATH"
echo "----------------------------------------"
echo
echo "Done."