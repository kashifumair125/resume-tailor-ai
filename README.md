# 🚀 ResumeTailor AI

AI-powered resume optimizer that tailors your resume to match job descriptions and pass ATS systems in under 2 minutes.

## ✨ Features

- **🎯 ATS Optimization** - Beat applicant tracking systems with smart keyword matching
- **📊 3 Resume Versions** - Get ATS-Safe, Impact, and Recruiter-Friendly versions
- **🎨 4 Professional Templates** - Jake's Resume, Harvard, Venables, and ModernCV
- **💡 Detailed Insights** - See exactly what changed and why it matters
- **📈 Before/After Comparison** - Visual transformation of your resume
- **⚠️ Rejection Risk Analysis** - Honest feedback on what might hold you back
- **📥 PDF Download** - Download any version in any template as a professionally formatted PDF

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Claude API (Anthropic)
- **File Processing**: Mammoth.js (DOCX), pdf-parse (PDF), jsPDF (PDF generation)
- **Deployment**: Vercel-ready

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

## 🚀 Quick Start Guide

### Step 1: Clone or Download the Project

If you have the project files, navigate to the project directory:

```bash
cd resume-tailor-ai
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js and React
- Anthropic SDK
- File parsers (mammoth, pdf-parse)
- PDF generator (jsPDF)
- UI components (lucide-react)

### Step 3: Set Up Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env.local
```

2. Open `.env.local` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
```

**How to get your API key:**
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to "API Keys"
4. Create a new API key
5. Copy and paste it into your `.env.local` file

### Step 4: Run the Development Server

```bash
npm run dev
```

The application will start at **http://localhost:3000**

### Step 5: Open in Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

You should see the ResumeTailor AI landing page! 🎉

## 📖 How to Use

1. **Upload Your Resume**
   - Choose "Paste Text" or "Upload File" (supports PDF, DOCX, TXT)
   - Paste or upload your master resume

2. **Add Job Description**
   - Copy the entire job posting
   - Paste it in the Job Description field

3. **Click "Optimize Resume Now"**
   - Wait 30-60 seconds for AI processing

4. **Review Results**
   - Check your ATS score
   - Review the 3 versions: ATS-Safe, Impact, Recruiter-Friendly
   - See what changed and why
   - Compare before/after

5. **Choose Template & Download**
   - Select from 4 professional templates:
     - **Jake's Resume**: Popular one-column (most ATS-friendly)
     - **Harvard**: Classic elegant style
     - **Venables**: Executive modern design
     - **ModernCV**: LaTeX-inspired with sidebar
   - Download your preferred combination

## 🏗️ Project Structure

```
resume-tailor-ai/
├── app/
│   ├── api/
│   │   ├── optimize/
│   │   │   └── route.ts          # Main optimization logic
│   │   ├── parse-resume/
│   │   │   └── route.ts          # File parsing endpoint
│   │   └── download-pdf/
│   │       └── route.ts          # PDF generation
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main page
│   └── globals.css               # Global styles
├── components/
│   ├── UploadSection.tsx         # Resume upload interface
│   ├── ResultsDashboard.tsx      # Results display
│   ├── BeforeAfterComparison.tsx # Comparison view
│   ├── ChangesPanel.tsx          # Changes breakdown
│   └── ResumePreview.tsx         # Resume display
├── .env.local                    # Your API keys (create this)
├── .env.example                  # Example env file
├── package.json                  # Dependencies
├── next.config.js                # Next.js config
├── tailwind.config.js            # Tailwind config
└── README.md                     # This file
```

## 🔧 Troubleshooting

### Issue: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: API key not working

**Solution:**
1. Verify your API key is correct in `.env.local`
2. Make sure the file is named `.env.local` (not `.env`)
3. Restart the development server after changing env variables

### Issue: File upload not working

**Solution:**
- Ensure file size is under 5MB
- Only PDF, DOCX, and TXT formats are supported
- Try using "Paste Text" instead

### Issue: PDF download fails

**Solution:**
- Check browser console for errors
- Try a different browser
- Ensure jsPDF is properly installed

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com)

3. Click "New Project"

4. Import your GitHub repository

5. Add environment variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key

6. Click "Deploy"

Your app will be live in ~2 minutes! 🎉

### Alternative: Deploy to Railway, Render, or Netlify

All platforms support Next.js. Just:
1. Connect your repository
2. Add the `ANTHROPIC_API_KEY` environment variable
3. Deploy

## 💰 Cost Estimation

**Anthropic API Costs (Claude Sonnet 4):**
- ~$0.003 per resume optimization
- 1000 resumes = ~$3-5

**Hosting (Vercel):**
- Free tier: 100GB bandwidth
- Pro tier: $20/month (if needed)

**Total for 1000 users/month:** ~$3-25

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Keep your API key secret
- The app doesn't store user data (all processing is ephemeral)
- Files are processed in-memory and immediately discarded

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#YOUR_COLOR_HERE',
      },
    },
  },
}
```

### Modify AI Prompts

Edit the prompts in `app/api/optimize/route.ts`:

```typescript
const prompts = {
  atsSafe: `Your custom prompt here...`,
  impact: `Your custom prompt here...`,
  recruiterFriendly: `Your custom prompt here...`,
}
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

This is a personal project, but feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use this for personal or commercial projects!

## 🆘 Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review the browser console for errors
3. Ensure all dependencies are installed
4. Verify your API key is valid

## 🎯 Roadmap

Future enhancements:
- [ ] User authentication
- [ ] Resume history
- [ ] Cover letter generation
- [ ] LinkedIn profile optimization
- [ ] Multiple resume templates
- [ ] Team collaboration features

## 🙏 Acknowledgments

Built with:
- [Anthropic Claude](https://www.anthropic.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Made with ❤️ to help job seekers land their dream jobs**

Ready to optimize your first resume? Run `npm run dev` and visit http://localhost:3000! 🚀
# 🚀 ResumeTailor AI

AI-powered resume optimizer that tailors your resume to match job descriptions and pass ATS systems in under 2 minutes.

## ✨ Features

- **🎯 ATS Optimization** - Beat applicant tracking systems with smart keyword matching
- **📊 3 Resume Versions** - Get ATS-Safe, Impact, and Recruiter-Friendly versions
- **💡 Detailed Insights** - See exactly what changed and why it matters
- **📈 Before/After Comparison** - Visual transformation of your resume
- **⚠️ Rejection Risk Analysis** - Honest feedback on what might hold you back
- **📥 PDF Download** - Download any version as a professionally formatted PDF

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Claude API (Anthropic)
- **File Processing**: Mammoth.js (DOCX), pdf-parse (PDF), jsPDF (PDF generation)
- **Deployment**: Vercel-ready

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

## 🚀 Quick Start Guide

### Step 1: Clone or Download the Project

If you have the project files, navigate to the project directory:

```bash
cd resume-tailor-ai
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js and React
- Anthropic SDK
- File parsers (mammoth, pdf-parse)
- PDF generator (jsPDF)
- UI components (lucide-react)

### Step 3: Set Up Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env.local
```

2. Open `.env.local` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
```

**How to get your API key:**
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to "API Keys"
4. Create a new API key
5. Copy and paste it into your `.env.local` file

### Step 4: Run the Development Server

```bash
npm run dev
```

The application will start at **http://localhost:3000**

### Step 5: Open in Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

You should see the ResumeTailor AI landing page! 🎉

## 📖 How to Use

1. **Upload Your Resume**
   - Choose "Paste Text" or "Upload File" (supports PDF, DOCX, TXT)
   - Paste or upload your master resume

2. **Add Job Description**
   - Copy the entire job posting
   - Paste it in the Job Description field

3. **Click "Optimize Resume Now"**
   - Wait 30-60 seconds for AI processing

4. **Review Results**
   - Check your ATS score
   - Review the 3 versions: ATS-Safe, Impact, Recruiter-Friendly
   - See what changed and why
   - Compare before/after

5. **Download**
   - Choose your preferred version
   - Download as PDF

## 🏗️ Project Structure

```
resume-tailor-ai/
├── app/
│   ├── api/
│   │   ├── optimize/
│   │   │   └── route.ts          # Main optimization logic
│   │   ├── parse-resume/
│   │   │   └── route.ts          # File parsing endpoint
│   │   └── download-pdf/
│   │       └── route.ts          # PDF generation
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main page
│   └── globals.css               # Global styles
├── components/
│   ├── UploadSection.tsx         # Resume upload interface
│   ├── ResultsDashboard.tsx      # Results display
│   ├── BeforeAfterComparison.tsx # Comparison view
│   ├── ChangesPanel.tsx          # Changes breakdown
│   └── ResumePreview.tsx         # Resume display
├── .env.local                    # Your API keys (create this)
├── .env.example                  # Example env file
├── package.json                  # Dependencies
├── next.config.js                # Next.js config
├── tailwind.config.js            # Tailwind config
└── README.md                     # This file
```

## 🔧 Troubleshooting

### Issue: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: API key not working

**Solution:**
1. Verify your API key is correct in `.env.local`
2. Make sure the file is named `.env.local` (not `.env`)
3. Restart the development server after changing env variables

### Issue: File upload not working

**Solution:**
- Ensure file size is under 5MB
- Only PDF, DOCX, and TXT formats are supported
- Try using "Paste Text" instead

### Issue: PDF download fails

**Solution:**
- Check browser console for errors
- Try a different browser
- Ensure jsPDF is properly installed

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com)

3. Click "New Project"

4. Import your GitHub repository

5. Add environment variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key

6. Click "Deploy"

Your app will be live in ~2 minutes! 🎉

### Alternative: Deploy to Railway, Render, or Netlify

All platforms support Next.js. Just:
1. Connect your repository
2. Add the `ANTHROPIC_API_KEY` environment variable
3. Deploy

## 💰 Cost Estimation

**Anthropic API Costs (Claude Sonnet 4):**
- ~$0.003 per resume optimization
- 1000 resumes = ~$3-5

**Hosting (Vercel):**
- Free tier: 100GB bandwidth
- Pro tier: $20/month (if needed)

**Total for 1000 users/month:** ~$3-25

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Keep your API key secret
- The app doesn't store user data (all processing is ephemeral)
- Files are processed in-memory and immediately discarded

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#YOUR_COLOR_HERE',
      },
    },
  },
}
```

### Modify AI Prompts

Edit the prompts in `app/api/optimize/route.ts`:

```typescript
const prompts = {
  atsSafe: `Your custom prompt here...`,
  impact: `Your custom prompt here...`,
  recruiterFriendly: `Your custom prompt here...`,
}
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

This is a personal project, but feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use this for personal or commercial projects!

## 🆘 Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review the browser console for errors
3. Ensure all dependencies are installed
4. Verify your API key is valid

## 🎯 Roadmap

Future enhancements:
- [ ] User authentication
- [ ] Resume history
- [ ] Cover letter generation
- [ ] LinkedIn profile optimization
- [ ] Multiple resume templates
- [ ] Team collaboration features

## 🙏 Acknowledgments

Built with:
- [Anthropic Claude](https://www.anthropic.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Made with ❤️ to help job seekers land their dream jobs**

Ready to optimize your first resume? Run `npm run dev` and visit http://localhost:3000! 🚀
