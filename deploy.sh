#!/bin/bash

# Log fayliga chiqish
LOG_FILE="/var/log/deploy.log"
exec > >(tee -a ${LOG_FILE}) 2>&1
echo "--------------------------------------------------------"
echo "Deploy boshlandi: $(date)"
echo "--------------------------------------------------------"

# Loyihaning asosiy papkasiga o'tish
cd /home/ubuntu/Dilnoza-Shop/ || { echo "Xato: Loyiha katalogi topilmadi!"; exit 1; }

echo "--- Loyiha fayllarini Gitdan tortish ---"
# Bu GitHub Actions tomonidan tortilganidan keyin serverda pull qiladi
git pull origin main # Yoki sizning asosiy branch nomingiz (masalan, master)

echo "--- Frontend (Next.js) yangilash ---"
cd dilnoza-shop-erp || { echo "Xato: Frontend katalogi topilmadi!"; exit 1; }
npm install --legacy-peer-deps # Yangi dependensiyalar uchun
NODE_OPTIONS="--max-old-space-size=4096" npm run build # Loyihani qayta build qilish

echo "--- PM2 orqali frontendni qayta yuklash ---"
pm2 reload dilnoza-shop-frontend || pm2 restart dilnoza-shop-frontend # Reload ishlamasa restart
pm2 save

echo "--- Backend (Django/Flask) yangilash ---"
cd ../dilnoza_backend || { echo "Xato: Backend katalogi topilmadi!"; exit 1; }
source venv/bin/activate      # Virtual environmentni faollashtirish
pip install -r requirements.txt # Yangi dependensiyalar uchun

# Ma'lumotlar bazasi migratsiyalari (agar o'zgargan bo'lsa)
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Statik fayllarni qayta yig'ish (agar o'zgargan bo'lsa)
python manage.py collectstatic --noinput

deactivate # Virtual environmentni o'chirish

echo "--- Gunicorn servisni qayta yuklash ---"
sudo systemctl restart gunicorn.service

echo "--- Nginxni qayta yuklash (agar konfiguratsiyada o'zgarish bo'lsa) ---"
# Nginx konfiguratsiyasini tekshirish va xatoliklar bo'lmasa reload qilish
sudo nginx -t && sudo systemctl reload nginx

echo "--------------------------------------------------------"
echo "Deploy tugadi: $(date)"
echo "--------------------------------------------------------"
