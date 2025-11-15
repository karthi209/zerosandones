set -a
source .env.deploy
set +a
chmod +x ./build_deploy.sh
./build_deploy.sh