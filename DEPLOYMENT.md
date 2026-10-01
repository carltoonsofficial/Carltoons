# Carltoons Final Deployment

Final source: `carltoons_monetization`.

## Test locally
```powershell
npm install
npm run build
npm run dev
```

## GitHub
Use the existing GitHub repository connected to Vercel:
```powershell
git init
git branch -M main
git add .
git commit -m "Final Carltoons monetization build"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```
Do not force-push.

Keep `.env.local` private. Add the same required environment variables in Vercel Project Settings → Environment Variables.
