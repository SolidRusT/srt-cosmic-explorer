# Cosmic Explorer - Kubernetes Deployment

Space exploration game with web-based graphics deployed on SRT-HQ Kubernetes platform.

**Tech Stack**: Python Flask + JavaScript + Flask-SocketIO
**Production URL**: https://cosmic.lab.hq.solidrust.net
**Docker Image**: suparious/cosmic-explorer:latest

---

## 🚀 Quick Start

### Deploy from Docker Hub
```powershell
.\deploy.ps1
```

### Build, Push, and Deploy
```powershell
.\deploy.ps1 -Build -Push
```

### Uninstall
```powershell
.\deploy.ps1 -Uninstall
```

---

## 🛠️ Development

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run Flask dev server
python api/app.py
# Access: http://localhost:5000
```

### Docker Build
```powershell
# Build locally
.\build-and-push.ps1

# Build and push to Docker Hub
.\build-and-push.ps1 -Login -Push
```

### Test Docker Image
```bash
docker run --rm -p 5000:5000 suparious/cosmic-explorer:latest
# Access: http://localhost:5000
```

---

## 📦 Kubernetes Resources

### Deployment
- **Name**: cosmic-explorer
- **Namespace**: cosmic-explorer
- **Replicas**: 2
- **Image**: suparious/cosmic-explorer:latest
- **Port**: 5000 (Flask)

### Resources
- **Requests**: 200m CPU, 256Mi memory
- **Limits**: 1000m CPU, 512Mi memory

### Storage
- **Volume**: emptyDir for `/app/saves` (ephemeral)
- **Future**: Migrate to PVC for persistent save data

### Service
- **Type**: ClusterIP
- **Port**: 80 → 5000

### Ingress
- **Host**: cosmic.lab.hq.solidrust.net
- **TLS**: Let's Encrypt (automatic)
- **WebSocket**: Enabled for Flask-SocketIO

---

## 🔧 Maintenance

### View Logs
```bash
kubectl logs -n cosmic-explorer -l app=cosmic-explorer -f
```

### Restart Deployment
```bash
kubectl rollout restart deployment/cosmic-explorer -n cosmic-explorer
```

### Check Status
```bash
kubectl get all,certificate,ingress -n cosmic-explorer
```

### Troubleshooting
```bash
# Pod status
kubectl get pods -n cosmic-explorer

# Pod details
kubectl describe pod -n cosmic-explorer <pod-name>

# Certificate status
kubectl get certificate -n cosmic-explorer

# Test health endpoint
curl https://cosmic.lab.hq.solidrust.net/api/health
```

---

## 🏗️ Architecture

### Multi-Stage Docker Build
1. **Builder Stage** (python:3.13-slim)
   - Install build dependencies
   - Install Python packages
2. **Production Stage** (python:3.13-slim)
   - Copy Python packages
   - Copy application code
   - Run with eventlet worker

### Application Components
- **Backend**: Flask API with Flask-SocketIO
- **Frontend**: HTML5 Canvas + JavaScript
- **Communication**: REST API + WebSockets
- **Worker**: eventlet for async I/O

### Key Features
- Real-time space navigation
- Star map with regions/nodes
- Ship and inventory management
- Save/load functionality
- Event-driven gameplay
- WebSocket updates

---

## 📁 Files Overview

```
cosmic-explorer/
├── k8s/                       # Kubernetes manifests
│   ├── 01-namespace.yaml      # Namespace definition
│   ├── 02-deployment.yaml     # Deployment with 2 replicas
│   ├── 03-service.yaml        # ClusterIP service
│   └── 04-ingress.yaml        # Ingress with TLS + WebSocket
├── Dockerfile                 # Multi-stage build
├── .dockerignore              # Build exclusions
├── build-and-push.ps1         # Docker build script
├── deploy.ps1                 # Kubernetes deployment script
├── CLAUDE.md                  # Complete AI agent context
└── README-K8S.md              # This file
```

---

## 🌐 Networking

**Access Points**:
- Production: `https://cosmic.lab.hq.solidrust.net`
- Health Check: `https://cosmic.lab.hq.solidrust.net/api/health`

**WebSocket Support**:
- nginx ingress configured for WebSocket upgrades
- Flask-SocketIO handles real-time game updates

**TLS**:
- Automatic Let's Encrypt certificates via cert-manager
- DNS-01 challenge with Cloudflare

---

## ✅ Validation

After deployment:

1. **Check pods**: `kubectl get pods -n cosmic-explorer`
   → Expected: 2/2 Running

2. **Check certificate**: `kubectl get certificate -n cosmic-explorer`
   → Expected: READY=True

3. **Test health**: `curl -k https://cosmic.lab.hq.solidrust.net/api/health`
   → Expected: HTTP 200

4. **Browser test**: Open `https://cosmic.lab.hq.solidrust.net`
   → Expected: Green padlock, game loads

---

## 🔗 Links

- **Production**: https://cosmic.lab.hq.solidrust.net
- **Docker Hub**: https://hub.docker.com/r/suparious/cosmic-explorer
- **GitHub**: https://github.com/SolidRusT/srt-cosmic-explorer

---

**Last Updated**: 2025-11-10
**Platform**: SRT-HQ Kubernetes
**Status**: Production Ready
