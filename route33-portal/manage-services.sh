#!/bin/bash
# 33 Tools Service Management Script
# Manages the 33 Tools Multi-Driver Business Management System

PROJECT_DIR="/home/xoom000/GoPublic/33tools-staging"
PORTAL_DIR="$PROJECT_DIR/route33-portal"

case "$1" in
    "status")
        echo "🔍 33 Tools Service Status:"
        echo ""
        echo "📊 Active Processes:"
        ps aux | grep "node proxy-server\|node server.js" | grep -v grep || echo "❌ No Node processes running"
        
        echo ""
        echo "🌐 SSH Tunnels:"
        ps aux | grep "ssh -R 8084" | grep -v grep || echo "❌ No tunnel to port 8084"
        
        echo ""
        echo "🔌 Port Usage (22XX Architecture):"
        netstat -tlnp 2>/dev/null | grep -E ":22[123]0" || echo "❌ No services on 2210/2220/2230 ports"
        
        echo ""
        echo "🌍 Public Test:"
        curl -s -I https://test.route33.app/ | head -1 || echo "❌ Public site not accessible"
        ;;
    
    "start")
        echo "🚀 Starting 33 Tools Services..."
        
        # Start backend API - NEW PORT ARCHITECTURE 
        echo "Starting backend API (port 2210)..."
        cd "$PROJECT_DIR" && nohup node server.js > server.log 2>&1 &
        
        # Start frontend proxy  
        echo "Starting frontend proxy (port 2220)..."
        cd "$PORTAL_DIR" && nohup env FRONTEND_PORT=2220 node proxy-server.js > proxy.log 2>&1 &
        
        # Wait for services to start
        sleep 3
        
        # Start SSH tunnel - NEW PORT ARCHITECTURE
        echo "Starting SSH tunnel (8084 → 2220)..."
        nohup ssh -R 8084:localhost:2220 \
          -o StrictHostKeyChecking=no \
          -o ConnectTimeout=10 \
          -o ServerAliveInterval=30 \
          -o ServerAliveCountMax=3 \
          -o ExitOnForwardFailure=yes \
          -f root@24.199.121.11 -N > tunnel.log 2>&1
        
        echo "✅ Services started! Check status with: $0 status"
        ;;
    
    "stop")
        echo "🛑 Stopping 33 Tools Services..."
        
        # Stop all related processes with timeout
        pkill -f "node proxy-server" || true
        pkill -f "node server.js" || true
        pkill -f "ssh -R 8084" || true
        
        # Give processes a moment to clean up
        sleep 1
        
        echo "✅ Services stopped!"
        ;;
    
    "restart")
        echo "🔄 Restarting 33 Tools Services..."
        $0 stop
        sleep 2
        $0 start
        ;;
    
    "restart-local")
        echo "🔄 Restarting Local Services (no SSH tunnel)..."
        
        # Stop local processes only
        pkill -f "node proxy-server" || true
        pkill -f "node server.js" || true
        sleep 1
        
        # Start backend API
        echo "Starting backend API (port 2210)..."
        cd "$PROJECT_DIR" && nohup node server.js > server.log 2>&1 &
        
        # Start frontend proxy  
        echo "Starting frontend proxy (port 2220)..."
        cd "$PORTAL_DIR" && nohup env FRONTEND_PORT=2220 node proxy-server.js > proxy.log 2>&1 &
        
        echo "✅ Local services restarted! (SSH tunnel unchanged)"
        ;;
    
    "logs")
        echo "📋 Recent Logs:"
        echo ""
        echo "🔧 Backend API Logs:"
        tail -10 "$PROJECT_DIR/server.log" 2>/dev/null || echo "No backend logs"
        
        echo ""
        echo "🌐 Frontend Proxy Logs:"  
        tail -10 "$PORTAL_DIR/proxy.log" 2>/dev/null || echo "No proxy logs"
        
        echo ""
        echo "🚇 Tunnel Logs:"
        tail -10 "$PORTAL_DIR/tunnel.log" 2>/dev/null || echo "No tunnel logs"
        ;;
    
    "test")
        echo "🧪 Testing 33 Tools System..."
        
        echo "Testing backend API..."
        curl -s -X POST http://localhost:3334/api/customers/170449/validate \
             -H "Content-Type: application/json" \
             -d '{"loginCode": "X4L4CYP9"}' | head -1
        
        echo ""
        echo "Testing frontend proxy..."
        curl -s -I http://localhost:3340/ | head -1
        
        echo ""
        echo "Testing public site..."
        curl -s -I https://orders.route33.app/ | head -1
        ;;
    
    *)
        echo "🎯 33 Tools Service Manager"
        echo ""
        echo "Usage: $0 {start|stop|restart|restart-local|status|logs|test}"
        echo ""
        echo "Commands:"
        echo "  start        - Start all services (backend + proxy + tunnel)"
        echo "  stop         - Stop all services"
        echo "  restart      - Stop and start all services (includes SSH tunnel)" 
        echo "  restart-local- Restart only local services (faster, no SSH tunnel)"
        echo "  status       - Show current service status"
        echo "  logs         - Show recent log entries"
        echo "  test         - Test all endpoints"
        echo ""
        echo "Live site: https://orders.route33.app"
        echo "Test login: Account 170449, Code X4L4CYP9"
        ;;
esac