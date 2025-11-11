# CLAUDE.md - Cosmic Explorer Agent Context

**Project**: Space exploration game with web-based graphics deployed on SRT-HQ Kubernetes platform
**Status**: Production deployed at `https://cosmic.lab.hq.solidrust.net`
**Last Updated**: 2025-11-10
**Shaun's Golden Rule**: **No workarounds, no temporary fixes, no disabled functionality. Full solutions only.**

---

## ⚡ AGENT QUICK START

**Your job**: Help with Cosmic Explorer - a Python Flask space exploration game on Kubernetes.

**Shaun's top rule**: No workarounds, no temporary fixes, complete solutions only.

**Where to start**:
1. Read "Project Overview" below
2. Understand this is a Flask backend + JavaScript frontend
3. Reference deployment patterns as needed
4. Use ChromaDB for platform integration questions

---

## 📚 PLATFORM INTEGRATION (ChromaDB Knowledge Base)

**When working in this submodule**, you cannot access the parent srt-hq-k8s repository files. Use ChromaDB to query platform capabilities and integration patterns.

**Collection**: `srt-hq-k8s-platform-guide` (41 docs, updated 2025-11-10)

**Why This Matters for Cosmic Explorer**:
The game is deployed on the SRT-HQ Kubernetes platform and needs to understand:
- Platform ingress and SSL certificate automation
- WebSocket support for real-time game updates
- Storage options for save game data (emptyDir for stateless, PVC for persistent)
- Monitoring and observability integration
- Platform deployment conventions

**Query When You Need**:
- Platform architecture and three-tier taxonomy
- Ingress and SSL certificate patterns with WebSocket support
- Storage classes for persistent save game data
- Monitoring and logging integration
- Platform service discovery

**Example Queries**:
```
"What is the srt-hq-k8s platform architecture?"
"How does ingress and SSL work on the platform?"
"What storage classes are available for game saves?"
"How do I integrate with platform monitoring?"
"How to configure WebSocket support in nginx ingress?"
```

**When NOT to Query**:
- ❌ Python/Flask development (use requirements.txt and Flask docs)
- ❌ Game logic and mechanics (see game README.md and docs/)
- ❌ Docker build process (use build-and-push.ps1)

---

## 📍 PROJECT OVERVIEW

**Game Type**: Web-based space exploration game with graphical interface
**Backend**: Python Flask with Flask-SocketIO for real-time communication
**Frontend**: HTML5 Canvas + JavaScript
**Communication**: REST API + WebSockets
**Production**: Flask served via Python runtime with eventlet worker

**Key Features**:
- Real-time space navigation with WebSocket updates
- Star map with regions and nodes
- Ship management with different types and modifications
- Pod augmentation system
- Inventory management with various item types
- Save/load game functionality
- Event-driven gameplay
- Action processing system

---

## 🗂️ LOCATIONS

**Repository**:
- GitHub: `git@github.com:SolidRusT/srt-cosmic-explorer.git`
- Submodule: `/mnt/c/Users/shaun/repos/srt-hq-k8s/manifests/apps/cosmic-explorer/`
- Standalone: `/mnt/c/Users/shaun/repos/srt-cosmic-explorer/`

**Deployment**:
- Dev: `python api/app.py` → `http://localhost:5000` (Flask dev server)
- Docker Test: `docker run -p 5000:5000 suparious/cosmic-explorer:latest` → `http://localhost:5000`
- Production: `https://cosmic.lab.hq.solidrust.net` (K8s namespace: `cosmic-explorer`)

**Images**:
- Docker Hub: `suparious/cosmic-explorer:latest`
- Public URL: `https://hub.docker.com/r/suparious/cosmic-explorer`

---

## 🛠️ TECH STACK

### Backend (Python Flask)
- **Flask**: 2.3.0+ (web framework)
- **Flask-SocketIO**: 5.3.0+ (WebSocket support)
- **Flask-CORS**: 4.0.0+ (cross-origin resource sharing)
- **eventlet**: 0.33.0+ (async worker for production)
- **python-socketio**: 5.9.0+ (SocketIO server)
- **Dev Port**: 5000 (Flask default)

### Frontend (Vanilla JavaScript)
- **HTML5**: Canvas-based graphics
- **JavaScript**: ES6+ with socket.io-client
- **Static Files**: Served by Flask from `/static`
- **Templates**: Jinja2 templates in `/templates`

### Production (Docker + Kubernetes)
- **Base Image**: python:3.13-slim (multi-stage build)
- **Runtime**: Python with eventlet worker
- **Orchestration**: Kubernetes 1.34+
- **Ingress**: nginx-ingress with Let's Encrypt DNS-01 + WebSocket support

---

## 📁 PROJECT STRUCTURE

```
cosmic-explorer/
├── api/                       # Flask API backend
│   └── app.py                 # Main Flask application
├── static/                    # Frontend assets
│   ├── css/                   # Stylesheets
│   ├── js/                    # JavaScript code
│   ├── images/                # Game images
│   └── sounds/                # Audio files
├── templates/                 # Jinja2 templates
│   └── index.html             # Main game page
├── saves/                     # Save game data (local dev)
├── k8s/                       # Kubernetes manifests (K8s deployment only)
│   ├── 01-namespace.yaml
│   ├── 02-deployment.yaml
│   ├── 03-service.yaml
│   └── 04-ingress.yaml
├── tests/                     # Test cases
├── ship_system.py             # Ship management
├── inventory_system.py        # Inventory management
├── pod_system.py              # Pod augmentation
├── session_manager.py         # Session management
├── action_processor.py        # Action processing
├── save_manager.py            # Save/load functionality
├── navigation.py              # Navigation logic
├── regions.py                 # Region/node definitions
├── events.py                  # Event system
├── config.py                  # Configuration
├── requirements.txt           # Python dependencies
├── package.json               # Node.js dev tools
├── Dockerfile                 # Multi-stage build (K8s deployment only)
├── .dockerignore              # Docker build exclusions (K8s deployment only)
├── build-and-push.ps1         # Docker build script (K8s deployment only)
├── deploy.ps1                 # Kubernetes deployment (K8s deployment only)
├── CLAUDE.md                  # This file (K8s deployment only)
├── README-K8S.md              # Deployment guide (K8s deployment only)
└── README.md                  # Project documentation
```

**Note**: Files marked "K8s deployment only" are in the submodule but NOT in the standalone game repository.

---

## 🚀 DEVELOPMENT WORKFLOW

### Local Development

```bash
# Install Python dependencies
pip install -r requirements.txt

# Start Flask dev server
python api/app.py
# Access: http://localhost:5000

# Run tests
python -m pytest tests/
```

### Docker Testing

```bash
# Build image locally
.\build-and-push.ps1

# Test image
docker run --rm -p 5000:5000 suparious/cosmic-explorer:latest
# Access: http://localhost:5000
```

### Production Deployment

```bash
# Build and push to Docker Hub
.\build-and-push.ps1 -Login -Push

# Deploy to Kubernetes
.\deploy.ps1

# Or build + push + deploy in one command
.\deploy.ps1 -Build -Push
```

---

## 📋 DEPLOYMENT

### Quick Deploy (Recommended)

```powershell
# Full deployment (build, push, deploy)
.\deploy.ps1 -Build -Push

# Deploy only (uses existing Docker Hub image)
.\deploy.ps1

# Uninstall
.\deploy.ps1 -Uninstall
```

### Manual Deployment

```bash
# Build and push Docker image
docker build -t suparious/cosmic-explorer:latest .
docker push suparious/cosmic-explorer:latest

# Deploy to cluster
kubectl apply -f k8s/

# Verify deployment
kubectl get all -n cosmic-explorer
kubectl get certificate -n cosmic-explorer
kubectl get ingress -n cosmic-explorer
```

---

## 🔧 COMMON TASKS

### View Logs

```bash
# All pods
kubectl logs -n cosmic-explorer -l app=cosmic-explorer -f

# Specific pod
kubectl logs -n cosmic-explorer <pod-name> -f
```

### Update Deployment

```bash
# Restart pods (pull latest image)
kubectl rollout restart deployment/cosmic-explorer -n cosmic-explorer

# Watch rollout status
kubectl rollout status deployment/cosmic-explorer -n cosmic-explorer
```

### Troubleshooting

```bash
# Check pod status
kubectl get pods -n cosmic-explorer

# Describe pod (events and errors)
kubectl describe pod -n cosmic-explorer <pod-name>

# Check certificate status
kubectl describe certificate -n cosmic-explorer cosmic-explorer-tls

# Check ingress
kubectl describe ingress -n cosmic-explorer cosmic-explorer

# Test health endpoint
curl https://cosmic.lab.hq.solidrust.net/api/health
```

---

## 🎯 USER PREFERENCES (CRITICAL)

### Solutions
- ✅ **Complete, working solutions** - Every change must be immediately deployable
- ✅ **Direct execution** - Use available tools, verify in real-time
- ✅ **No back-and-forth** - Show results, iterate to solution
- ❌ **NO workarounds** - If symptoms remain, keep digging for root cause
- ❌ **NO temporary files** - All code is production code
- ❌ **NO disabled functionality** - Don't hack around errors, fix them
- ✅ **Git as source of truth** - All changes in code, nothing manual

### Code Quality
- Full files, never patch fragments (unless part of strategy)
- Scripts work on first run (no retry logic needed)
- Documentation before infrastructure
- Reproducibility via automation

---

## 🏗️ BUILD PROCESS

### Multi-Stage Docker Build

**Stage 1: Builder** (python:3.13-slim)
1. Install build dependencies (gcc for compiled Python packages)
2. Install Python dependencies from requirements.txt
3. Store in /root/.local for copying to production stage

**Stage 2: Production** (python:3.13-slim)
1. Copy Python packages from builder stage
2. Copy application code
3. Create saves directory for game data
4. Expose port 5000
5. Health check endpoint at /api/health
6. Run with eventlet worker for WebSocket support

**Build Time**: ~3-5 minutes
**Image Size**: ~200-250 MB (Python runtime + dependencies)

---

## 🌐 NETWORKING

**Ingress Configuration**:
- Host: `cosmic.lab.hq.solidrust.net`
- TLS: Let's Encrypt DNS-01 (automatic via cert-manager)
- Certificate Secret: `cosmic-explorer-tls`
- Ingress Class: `nginx`
- SSL Redirect: Enabled
- **WebSocket Support**: Enabled via nginx annotations for Flask-SocketIO

**Service**:
- Type: ClusterIP
- Port: 80 (HTTP)
- Target Port: 5000 (Flask container)

**Access**:
- Production: `https://cosmic.lab.hq.solidrust.net`
- Redirects HTTP → HTTPS automatically
- WebSocket upgrades handled by nginx

---

## 📊 RESOURCE ALLOCATION

**Deployment**:
- Replicas: 2 (high availability)
- Strategy: RollingUpdate

**Container Resources**:
- **Requests**: 200m CPU, 256Mi memory
- **Limits**: 1000m CPU, 512Mi memory

**Probes**:
- **Liveness**: HTTP GET /api/health every 30s (after 15s initial delay, 5s timeout)
- **Readiness**: HTTP GET /api/health every 10s (after 10s initial delay, 3s timeout)

**Storage**:
- **Volume**: emptyDir for /app/saves (ephemeral, pod-local)
- **Future**: Can migrate to PVC for persistent save data across restarts

**Rationale**: Python Flask app requires more resources than static SPA, eventlet provides async performance

---

## 🔍 VALIDATION

### After Deployment

```bash
# 1. Check pods are running
kubectl get pods -n cosmic-explorer
# Expected: 2/2 pods Running

# 2. Check service
kubectl get svc -n cosmic-explorer
# Expected: ClusterIP service on port 80

# 3. Check ingress
kubectl get ingress -n cosmic-explorer
# Expected: cosmic.lab.hq.solidrust.net with ADDRESS

# 4. Check certificate
kubectl get certificate -n cosmic-explorer
# Expected: READY=True

# 5. Test health endpoint
curl -k https://cosmic.lab.hq.solidrust.net/api/health
# Expected: {"status": "ok"} or similar

# 6. Browser test
# Open https://cosmic.lab.hq.solidrust.net
# Expected: Green padlock, game loads
```

---

## 💡 KEY DECISIONS

### Why Python Flask (not Node.js)?
- Game logic already written in Python
- Flask-SocketIO provides excellent WebSocket support
- Mature ecosystem for game development
- Easy session management and state persistence

### Why eventlet worker?
- Async I/O for WebSocket connections
- Production-ready for Flask-SocketIO
- Better performance than threaded worker
- Recommended by Flask-SocketIO docs

### Why 2 replicas?
- High availability
- Zero-downtime deployments
- Load distribution for multiplayer
- Better than 1 (no HA) or 3+ (overkill for game)

### Why emptyDir for saves?
- Initial deployment simplicity
- Game saves are ephemeral in current design
- Can migrate to PVC if persistent saves needed
- Stateless pods for easier scaling

### Why ClusterIP service?
- No external LoadBalancer needed
- Traffic comes through Ingress only
- Standard pattern for web apps on this platform

---

## 🎓 AGENT SUCCESS CRITERIA

You're doing well if:

✅ You understand this is a Python Flask application with JavaScript frontend
✅ You know dev server is `python api/app.py` (port 5000)
✅ You know production uses eventlet worker for WebSocket support
✅ You reference ChromaDB for platform integration questions
✅ You provide complete solutions (never workarounds)
✅ You use PowerShell scripts for deployment
✅ You validate changes work end-to-end
✅ You remember this is a space exploration game (not action game)
✅ You check requirements.txt for Python dependencies
✅ You respect Shaun's "no workarounds" philosophy
✅ You understand WebSocket support is critical for real-time updates

---

## 📅 CHANGE HISTORY

| Date | Change | Impact |
|------|--------|--------|
| 2025-11-10 | Initial onboarding | Project added to SRT-HQ K8s platform |
| 2025-11-10 | Created Dockerfile | Multi-stage build for Python Flask app |
| 2025-11-10 | Created K8s manifests | Deployment, Service, Ingress with WebSocket support |
| 2025-11-10 | Created PowerShell scripts | build-and-push.ps1, deploy.ps1 |
| 2025-11-10 | Added as git submodule | Integrated into srt-hq-k8s repo |

---

**Last Updated**: 2025-11-10
**Status**: Production Ready
**Platform**: SRT-HQ Kubernetes
**Access**: https://cosmic.lab.hq.solidrust.net

---

*Attach this file to Cosmic Explorer conversations for complete context.*
