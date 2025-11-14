# Production Deployment Checklist

## ⚠️ CRITICAL SECURITY STEPS - DO BEFORE DEPLOYING

### 1. Change Admin Password
```bash
# In backend/.env, change ADMIN_PASSWORD to a strong password
ADMIN_PASSWORD=YourVeryStrongPassword123!WithSpecialChars
```

### 2. Update ALLOWED_ORIGINS
```bash
# In backend/.env, set your production domain
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Database Security
- Change DB_PASSWORD to a stronger one if possible
- Ensure database only accepts connections from your server IP
- Enable SSL for database connections if available

### 4. Frontend Environment
Create `.env.production` in the root directory:
```
VITE_API_URL=https://your-api-domain.com
VITE_ADMIN_PASSWORD=SameAsBackendAdminPassword
```

### 5. Never Commit Sensitive Data
✅ `.env` is in `.gitignore`
✅ Backend `.env` contains real credentials
✅ Only `.env.example` should be committed

## 🚀 Deployment Steps

### Backend Deployment (Node.js Server)
1. Deploy to service (Railway, Render, DigitalOcean, etc.)
2. Set environment variables in hosting platform
3. Enable HTTPS
4. Set NODE_ENV=production

### Frontend Deployment (Static Site)
1. Build: `npm run build`
2. Deploy `dist/` folder to hosting (Vercel, Netlify, Cloudflare Pages)
3. Set environment variables for VITE_API_URL

## 🔒 Post-Deployment Security

1. **Test Admin Access**: Verify only you can access /admin
2. **Test Rate Limiting**: Try multiple failed logins
3. **Check CORS**: Ensure only your domain can access API
4. **Monitor Logs**: Watch for suspicious activity
5. **Enable HTTPS**: Force SSL on both frontend and backend

## 📝 Maintenance

- Regularly update npm packages: `npm audit fix`
- Monitor database size
- Backup database regularly
- Rotate admin password periodically

## 🆘 Emergency Access Recovery

If locked out, SSH into your server and reset:
```bash
cd /path/to/backend
echo "ADMIN_PASSWORD=temporary123" >> .env
# Restart server, login, then change password
```
