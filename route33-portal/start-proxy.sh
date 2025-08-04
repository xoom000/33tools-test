#!/bin/bash

# Persistent Proxy Server Starter with Auto-Restart
# Fixes the 502 Bad Gateway issue by ensuring proxy stays running

echo "🚀 Starting persistent Route33 proxy server..."

# Kill any existing proxy processes
pkill -f "node proxy-server.js" 2>/dev/null || true
sleep 2

# Function to start proxy server with monitoring
start_proxy() {
    echo "⚡ Starting proxy server (attempt $1)..."
    
    # Start proxy server in background with logging
    nohup node proxy-server.js > proxy.log 2>&1 &
    PROXY_PID=$!
    
    echo "📋 Proxy PID: $PROXY_PID"
    
    # Wait a moment for startup
    sleep 3
    
    # Check if it's actually running
    if kill -0 $PROXY_PID 2>/dev/null; then
        echo "✅ Proxy server running successfully on port 3341"
        echo "🌐 Access: http://localhost:3341/"
        return 0
    else
        echo "❌ Proxy server failed to start"
        return 1
    fi
}

# Try to start the proxy server with retries
ATTEMPT=1
MAX_ATTEMPTS=3

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    if start_proxy $ATTEMPT; then
        # Success! Now monitor and restart if it dies
        echo "🛡️ Starting monitoring loop..."
        
        while true; do
            sleep 10
            
            # Check if proxy is still running
            if ! pgrep -f "node proxy-server.js" > /dev/null; then
                echo "⚠️ Proxy server died! Restarting..."
                
                # Clean up any zombie processes
                pkill -f "node proxy-server.js" 2>/dev/null || true
                sleep 2
                
                # Restart
                nohup node proxy-server.js > proxy.log 2>&1 &
                echo "🔄 Proxy restarted automatically"
            else
                # Verify it's responding
                if ! curl -s -I http://localhost:3341/ > /dev/null 2>&1; then
                    echo "⚠️ Proxy not responding! Restarting..."
                    pkill -f "node proxy-server.js" 2>/dev/null || true
                    sleep 2
                    nohup node proxy-server.js > proxy.log 2>&1 &
                    echo "🔄 Proxy restarted due to non-response"
                fi
            fi
        done
        
        break
    else
        ATTEMPT=$((ATTEMPT + 1))
        if [ $ATTEMPT -le $MAX_ATTEMPTS ]; then
            echo "⏳ Retrying in 5 seconds..."
            sleep 5
        fi
    fi
done

if [ $ATTEMPT -gt $MAX_ATTEMPTS ]; then
    echo "💥 Failed to start proxy after $MAX_ATTEMPTS attempts"
    echo "📋 Check logs: cat proxy.log"
    exit 1
fi