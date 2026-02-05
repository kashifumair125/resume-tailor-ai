# 📘 Complete Setup Guide - ResumeTailor AI

This guide will walk you through setting up ResumeTailor AI on your system from scratch, even if you're new to web development.

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Installing Prerequisites](#installing-prerequisites)
3. [Project Setup](#project-setup)
4. [Getting Your API Key](#getting-your-api-key)
5. [Running the Application](#running-the-application)
6. [Testing the Application](#testing-the-application)
7. [Common Issues & Solutions](#common-issues--solutions)

---

## 1. System Requirements

### Operating System
- ✅ Windows 10/11
- ✅ macOS 10.15 or later
- ✅ Linux (Ubuntu 20.04 or later)

### Required Software
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- A **text editor** (VS Code recommended)
- A **web browser** (Chrome, Firefox, Safari, or Edge)

---

## 2. Installing Prerequisites

### Step 2.1: Install Node.js

#### On Windows:
1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Run the installer
4. Follow the installation wizard (keep default settings)
5. Restart your computer

#### On macOS:
1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version**
3. Open the downloaded `.pkg` file
4. Follow the installation steps
5. Restart Terminal

#### On Linux (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2.2: Verify Installation

Open your terminal/command prompt and run:

```bash
node --version
npm --version
```

You should see version numbers like:
```
v18.17.0
9.6.7
```

If you see these, you're ready to proceed! ✅

### Step 2.3: Install a Code Editor (Optional but Recommended)

Download and install **Visual Studio Code**:
- Visit [https://code.visualstudio.com/](https://code.visualstudio.com/)
- Download for your operating system
- Install and open it

---

## 3. Project Setup

### Step 3.1: Navigate to Project Directory

#### On Windows:
1. Open **Command Prompt** or **PowerShell**
2. Navigate to where you saved the project:
```bash
cd C:\Users\YourName\Downloads\resume-tailor-ai
```

#### On macOS/Linux:
1. Open **Terminal**
2. Navigate to the project:
```bash
cd ~/Downloads/resume-tailor-ai
```

**Pro Tip:** You can drag the folder into Terminal (macOS/Linux) or type `cd` followed by a space and drag the folder into Command Prompt (Windows).

### Step 3.2: Install Project Dependencies

Run this command in your terminal:

```bash
npm install
```

**What's happening?**
- npm is downloading all required libraries
- This may take 2-5 minutes
- You'll see a progress bar and lots of text scrolling

**Expected output:**
```
added 312 packages, and audited 313 packages in 2m
found 0 vulnerabilities
```

✅ If you see this, installation was successful!

❌ If you see errors, check the [Common Issues](#common-issues--solutions) section.

---

## 4. Getting Your API Key

### Step 4.1: Create an Anthropic Account

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Click **"Sign Up"**
3. Enter your email and create a password
4. Verify your email address

### Step 4.2: Add Credits (if needed)

1. After logging in, you may need to add credits
2. Navigate to **"Billing"** in the console
3. Add at least $5 (this will last for hundreds of resume optimizations)

### Step 4.3: Generate an API Key

1. In the Anthropic Console, click **"API Keys"**
2. Click **"Create Key"**
3. Give it a name (e.g., "ResumeTailor")
4. Click **"Create"**
5. **IMPORTANT:** Copy the key immediately - you won't see it again!

Your API key looks like this:
```
sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 4.4: Add API Key to Your Project

1. In the project folder, find the file `.env.example`
2. **Copy** this file and rename the copy to `.env.local`

#### On Windows:
- Right-click `.env.example` → Copy
- Right-click in folder → Paste
- Rename to `.env.local`
- Edit with Notepad

#### On macOS/Linux:
```bash
cp .env.example .env.local
```

3. Open `.env.local` in a text editor
4. Replace `your_api_key_here` with your actual API key:

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

5. **Save the file**

**Security Note:** Never share this file or commit it to GitHub! It's already in `.gitignore` to prevent accidents.

---

## 5. Running the Application

### Step 5.1: Start the Development Server

In your terminal, run:

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 14.2.0
- Local:        http://localhost:3000
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

✅ Success! Your app is running!

### Step 5.2: Open in Browser

1. Open your web browser
2. Navigate to: **http://localhost:3000**
3. You should see the ResumeTailor AI homepage!

**What you should see:**
- A beautiful gradient background
- "ResumeTailor AI" header
- Two upload boxes (Resume and Job Description)
- Feature icons at the bottom

---

## 6. Testing the Application

### Step 6.1: Prepare Test Data

#### Sample Resume Text:
```
John Doe
Software Engineer

EXPERIENCE
Software Developer | Tech Corp | 2020-Present
- Developed web applications using React and Node.js
- Collaborated with team of 5 developers
- Implemented new features for client projects

EDUCATION
Bachelor of Science in Computer Science
State University, 2020

SKILLS
JavaScript, Python, HTML, CSS, Git
```

#### Sample Job Description:
```
Senior Software Engineer

We're looking for an experienced Senior Software Engineer with:
- 3+ years of experience with React and TypeScript
- Strong background in Node.js and API development
- Experience with SQL databases (PostgreSQL preferred)
- Leadership abilities and mentoring skills
- AWS cloud experience

Requirements:
- Bachelor's degree in Computer Science or related field
- Proven track record of delivering high-quality code
- Excellent communication skills
```

### Step 6.2: Run Your First Optimization

1. **Paste the sample resume** in the "Your Master Resume" section
2. **Paste the sample job description** in the "Target Job Description" section
3. Click **"Optimize Resume Now"**
4. Wait 30-60 seconds (AI is processing!)

### Step 6.3: Review Results

You should see:
- ✅ ATS Score (should be around 60-80)
- ✅ Three resume tabs (ATS-Safe, Impact, Recruiter-Friendly)
- ✅ Before/After comparison
- ✅ List of changes made
- ✅ Insights about potential rejection risks

### Step 6.4: Download a Resume

1. Click on any of the three resume version tabs
2. Scroll down
3. Click **"Download PDF"**
4. The PDF should download to your default Downloads folder

---

## 7. Common Issues & Solutions

### Issue 1: "npm: command not found"

**Problem:** Node.js is not installed or not in PATH

**Solution:**
1. Reinstall Node.js from [nodejs.org](https://nodejs.org)
2. Restart your terminal/command prompt
3. Restart your computer if needed

### Issue 2: "Module not found" errors

**Problem:** Dependencies not installed correctly

**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall everything
npm install
```

### Issue 3: "Port 3000 already in use"

**Problem:** Another app is using port 3000

**Solution:**

**Option A - Use different port:**
```bash
npm run dev -- -p 3001
```
Then visit http://localhost:3001

**Option B - Kill process on port 3000:**

Windows:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

macOS/Linux:
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue 4: API key not working

**Problem:** "Failed to optimize resume" error

**Solution:**
1. Check `.env.local` file exists (not `.env.example`)
2. Verify API key is correct (no extra spaces)
3. Ensure file is in the root project directory
4. Restart the development server:
   - Press `Ctrl+C` in terminal
   - Run `npm run dev` again

### Issue 5: PDF download doesn't work

**Problem:** Click download but nothing happens

**Solution:**
1. Check browser console for errors (F12 → Console tab)
2. Try a different browser
3. Check if browser is blocking downloads
4. Verify jsPDF is installed:
```bash
npm list jspdf
```

### Issue 6: "Cannot read property 'text' of undefined"

**Problem:** AI response format unexpected

**Solution:**
- This is usually a temporary API issue
- Wait a moment and try again
- Check your API key has available credits
- Verify API key is active in Anthropic Console

### Issue 7: File upload fails

**Problem:** Can't upload PDF/DOCX files

**Solution:**
1. Ensure file is under 5MB
2. Check file format (only PDF, DOCX, TXT supported)
3. Try "Paste Text" instead as a workaround
4. Check browser console for specific error

### Issue 8: Slow response time

**Problem:** Optimization takes more than 2 minutes

**Solution:**
- This is normal for very long resumes/JDs
- Anthropic API can be slow during peak hours
- Shorten the resume or job description
- Check your internet connection

---

## 🎉 Success Checklist

Before considering setup complete, verify:

- ✅ Node.js installed (run `node --version`)
- ✅ Project dependencies installed (run `npm list` - should show packages)
- ✅ `.env.local` file created with valid API key
- ✅ Development server starts without errors
- ✅ Can access http://localhost:3000
- ✅ Can paste resume and job description
- ✅ Optimization completes successfully
- ✅ Can view all three resume versions
- ✅ Can download PDF

If all boxes are checked, congratulations! 🎊 Your ResumeTailor AI is fully set up and ready to use!

---

## 📞 Need More Help?

1. **Check the main README.md** for additional information
2. **Review error messages carefully** - they often tell you exactly what's wrong
3. **Google the error message** - many issues have been solved by others
4. **Check Anthropic's API status**: https://status.anthropic.com/

---

## 🚀 Next Steps

Now that your app is running:

1. **Test with your own resume**
2. **Try different job descriptions**
3. **Compare the three versions**
4. **Customize the AI prompts** (in `app/api/optimize/route.ts`)
5. **Deploy to Vercel** to share with others
6. **Add new features** (authentication, history, etc.)

Happy job hunting! 🎯
