#!/bin/bash

set -e

echo "Setting up rn-template project..."

# Initialize and update submodules
echo "Initializing submodules..."
git submodule update --init --recursive || {
    echo "Standard init failed, trying with --remote..."
    git submodule deinit -f packages/core packages/ui 2>/dev/null || true
    rm -rf .git/modules/packages 2>/dev/null || true
    git submodule update --init --remote
}

# Install dependencies
echo "Installing dependencies..."
npm install

echo ""
echo "Setup complete!"
echo ""
echo "To run the app:"
echo "  npm run mobile start"
echo ""
echo "Or for specific platforms:"
echo "  npm run mobile ios      # iOS"
echo "  npm run mobile android  # Android"
echo "  npm run mobile web      # Web"
