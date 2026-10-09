cd /home/opc/FIFA-Career-Dashboard-Frontend
git checkout -f master
git fetch origin
git reset --hard origin/master
pnpm install
pnpm build

cd /home/opc/FIFA-Career-Dashboard
git checkout -f master
git fetch origin
git reset --hard origin/master
pnpm install

cd /home/opc/FIFA-Career-Dashboard-Website
git checkout -f master
git fetch origin
git reset --hard origin/master
pnpm install
pnpm build

pm2 restart all
