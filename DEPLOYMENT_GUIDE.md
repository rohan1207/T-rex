# Hostinger cPanel Deployment Guide

## Steps to Deploy:

1. **Build the project:**
   ```bash
   npm run build
   ```
   This creates a `dist` folder with all production files.

2. **Upload to Hostinger:**
   - Log into Hostinger cPanel
   - Go to File Manager
   - Navigate to `public_html` folder
   - Upload ALL contents from the `dist` folder (not the dist folder itself)
   - **IMPORTANT:** Also upload the `.htaccess` file to `public_html`

3. **File Structure on Hostinger should be:**
   ```
   public_html/
   ├── .htaccess          ← MUST BE UPLOADED
   ├── index.html
   ├── assets/
   │   ├── *.js
   │   ├── *.css
   │   └── *.png/jpg/etc
   ├── image/
   ├── glg_models/
   └── video/
   ```

4. **Common Issues:**

   **Blank Screen:**
   - ✅ Make sure `.htaccess` is uploaded
   - ✅ Check browser console for errors (F12)
   - ✅ Verify all files are uploaded correctly
   - ✅ Check file permissions (should be 644 for files, 755 for folders)

   **404 Errors on Routes:**
   - ✅ Ensure `.htaccess` is in `public_html` root
   - ✅ Check that mod_rewrite is enabled on Hostinger

   **Assets Not Loading:**
   - ✅ Verify asset paths in browser console
   - ✅ Check if files exist in correct locations
   - ✅ Clear browser cache

5. **Troubleshooting:**
   - Open browser console (F12) and check for errors
   - Check Network tab to see which files are failing to load
   - Verify the base URL matches your domain

## Quick Fix Checklist:
- [ ] `.htaccess` file uploaded to `public_html`
- [ ] All files from `dist` folder uploaded
- [ ] File permissions are correct (644/755)
- [ ] No console errors in browser
- [ ] Assets loading correctly













