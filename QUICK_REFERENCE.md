# ⚡ Quick Reference - ResumeTailor AI

## 🚀 Start the App (After Setup)

```bash
cd resume-tailor-ai
npm run dev
```

Open: http://localhost:3000

## 📁 Key Files You Might Edit

| File | Purpose |
|------|---------|
| `.env.local` | Your API key |
| `app/api/optimize/route.ts` | AI prompts for optimization |
| `tailwind.config.js` | Color customization |
| `components/UploadSection.tsx` | Upload page design |
| `components/ResultsDashboard.tsx` | Results page design |

## 🎨 Quick Customizations

### Change Main Colors

Edit `tailwind.config.js`:
```javascript
primary: {
  500: '#0ea5e9', // Change this hex color
}
```

### Modify AI Behavior

Edit `app/api/optimize/route.ts` and change the prompts in the `prompts` object.

### Change App Name

Edit `app/layout.tsx`:
```typescript
title: 'Your New Name Here',
```

## 🔧 Common Commands

| Command | What it does |
|---------|--------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Check for code issues |

## 🐛 Quick Fixes

### Reset Everything
```bash
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

### Update All Packages
```bash
npm update
```

## 📊 API Usage Tracking

Check usage at: https://console.anthropic.com/

**Cost per resume:** ~$0.003
**1000 resumes:** ~$3-5

## 🚀 Deploy to Vercel

```bash
# Install Vercel CLI (one time)
npm i -g vercel

# Deploy
vercel

# Add API key in Vercel dashboard:
# Settings → Environment Variables
# ANTHROPIC_API_KEY = your_key
```

## 🔐 Security Reminder

**Never commit these files to GitHub:**
- `.env.local`
- `.env`
- Any file with API keys

Already protected by `.gitignore` ✅

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 💾 File Size Limits

- PDF upload: 5MB max
- DOCX upload: 5MB max
- Resume text: ~50KB recommended

## 🎯 Supported File Types

**Upload:**
- `.pdf` - PDF documents
- `.docx` - Word documents
- `.doc` - Word documents (older)
- `.txt` - Plain text

**Download:**
- `.pdf` - Generated resume

## 🌐 URLs

- **Local:** http://localhost:3000
- **Anthropic Console:** https://console.anthropic.com/
- **Next.js Docs:** https://nextjs.org/docs
- **GitHub:** (your repo URL)

## 💡 Pro Tips

1. **Test first** with sample data before using real resume
2. **Compare versions** to see which fits best
3. **Keep master resume** updated with latest experience
4. **Try multiple JDs** to see different optimizations
5. **Download all versions** before starting new optimization

## 🆘 Emergency Commands

### Server won't start?
```bash
killall node
npm run dev
```

### Broken dependencies?
```bash
rm -rf node_modules
npm install
```

### Need to update Node?
Visit: https://nodejs.org/

---

**Need detailed help?** Check `SETUP_GUIDE.md`

**Ready to optimize?** Run `npm run dev` 🚀
