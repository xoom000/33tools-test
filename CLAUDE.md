# 33TOOLS STAGING

## 🎯 SERVICE: Staging 33TOOLS Testing Environment

**Public URL**: https://test.route33.app  
**Environment**: Staging/Development  
**Architecture**: Uses $TOOLS33STAGING_* environment variables

---

## 🚀 QUICK START

```bash
# Start all services
./manage-services.sh start

# Check status  
./manage-services.sh status

# View logs
./manage-services.sh logs

# Stop all services
./manage-services.sh stop
```

---

## 🔧 CURRENT CONFIGURATION

**Ports (from environment variables):**
- Backend API: `$TOOLS33STAGING_API` (2210)
- Frontend Web: `$TOOLS33STAGING_WEB` (2220)
- SSH Tunnel: `$TOOLS33STAGING_TUNNEL` (2230)

**Key Files:**
- `.env` - Backend configuration (PORT=2210)
- `route33-portal/` - Frontend React app
- `server.js` - Main API server
- `route33-portal/proxy-server.js` - Frontend proxy

---

## 🌐 PUBLIC ACCESS

**Test Portal**: https://test.route33.app  
**Test Dashboard**: https://test.route33.app/dashboard  

**Same credentials as production for testing**

---

## 📊 ARCHITECTURE

```
Internet → test.route33.app → Droplet nginx → SSH Tunnel (8084) → 
Local Proxy ($TOOLS33STAGING_WEB:2220) → Backend API ($TOOLS33STAGING_API:2210)
```

**Purpose**: Safe testing of new features before production deployment

---

*Use environment variables, never hardcode ports*  
*Refer to /home/xoom000/GoPublic/CLAUDE.md for architecture patterns*