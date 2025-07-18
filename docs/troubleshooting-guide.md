# 🛠️ BrainBytes DevOps Troubleshooting Guide

This guide provides solutions to common issues you might encounter in the BrainBytes DevOps environment. Each section addresses a specific category of problems with step-by-step solutions.

## 📋 Table of Contents

| Section | Description |
|---------|-------------|
| [🔄 Container Issues](#-container-issues) | Common Docker and container problems |
| [🌐 Network Problems](#-network-problems) | Connectivity and networking issues |
| [💾 Database Troubles](#-database-troubles) | MongoDB and database-related issues |
| [🔌 Service Dependencies](#-service-dependencies) | Problems with dependent services |
| [📊 Monitoring & Logs](#-monitoring--logs) | Troubleshooting monitoring and logging |
| [🔑 Authentication Issues](#-authentication-issues) | Login and permission problems |
| [⚡ Performance Problems](#-performance-problems) | System and application performance |
| [🚀 Deployment Failures](#-deployment-failures) | CI/CD and deployment issues |

---

## 🔄 Container Issues

### 1. Container Fails to Start
**Symptoms**: Container exits immediately or fails to start

**Troubleshooting Steps**:
1. Check container logs:
   ```bash
   docker logs <container_name>
   ```
2. Start container with interactive shell:
   ```bash
   docker run -it --entrypoint=/bin/sh <image_name>
   ```
3. Check container status:
   ```bash
   docker ps -a | grep <container_name>
   ```

**Common Causes**:
- Missing environment variables
- Port conflicts
- Volume mount issues
- Insufficient permissions

### 2. Container Restart Loop
**Symptoms**: Container keeps restarting

**Troubleshooting Steps**:
1. Check restart policy:
   ```bash
   docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' <container_name>
   ```
2. Examine logs from previous runs:
   ```bash
   docker logs --tail 100 --follow --previous <container_name>
   ```
3. Check system resources:
   ```bash
   docker stats
   ```

---

## 🌐 Network Problems

### 1. Containers Can't Communicate
**Symptoms**: Services can't reach each other

**Troubleshooting Steps**:
1. Check Docker network:
   ```bash
   docker network ls
   docker network inspect <network_name>
   ```
2. Test connectivity between containers:
   ```bash
   docker exec -it <container1> ping <container2>
   ```
3. Check exposed ports:
   ```bash
   docker port <container_name>
   ```

### 2. DNS Resolution Issues
**Symptoms**: Can't resolve hostnames

**Troubleshooting Steps**:
1. Check container's DNS configuration:
   ```bash
   docker exec -it <container> cat /etc/resolv.conf
   ```
2. Test DNS resolution:
   ```bash
   docker exec -it <container> nslookup google.com
   ```
3. Check host's DNS settings:
   ```bash
   cat /etc/resolv.conf
   ```

---

## 💾 Database Troubles

### 1. MongoDB Connection Issues
**Symptoms**: Can't connect to MongoDB

**Troubleshooting Steps**:
1. Check if MongoDB is running:
   ```bash
   docker-compose -f docker/compose.prod.yml ps mongo
   ```
2. Check MongoDB logs:
   ```bash
   docker-compose -f docker/compose.prod.yml logs mongo
   ```
3. Test MongoDB connection:
   ```bash
   docker-compose -f docker/compose.prod.yml exec mongo mongo --eval "db.adminCommand('ping')"
   ```

### 2. Database Performance Issues
**Symptoms**: Slow queries, high CPU usage

**Troubleshooting Steps**:
1. Check current operations:
   ```bash
   docker-compose -f docker/compose.prod.yml exec mongo mongo --eval "db.currentOp()"
   ```
2. Check database stats:
   ```bash
   docker-compose -f docker/compose.prod.yml exec mongo mongo --eval "db.stats()"
   ```
3. Check index usage:
   ```bash
   docker-compose -f docker/compose.prod.yml exec mongo mongo --eval "db.collection.getIndexes()"
   ```

---

## 🔌 Service Dependencies

### 1. Service Dependency Issues
**Symptoms**: Services start in wrong order

**Troubleshooting Steps**:
1. Check service dependencies in compose file:
   ```bash
   grep -A 5 "depends_on" docker-compose*.yml
   ```
2. Check service health:
   ```bash
   curl -I http://localhost:8080/health
   ```
3. View service startup order:
   ```bash
   docker-compose -f docker/compose.prod.yml ps --services
   ```

### 2. Environment Variable Issues
**Symptoms**: Missing or incorrect configuration

**Troubleshooting Steps**:
1. Check environment variables:
   ```bash
   docker exec <container> env
   ```
2. Validate .env file:
   ```bash
   docker-compose -f docker/compose.prod.yml config
   ```
3. Check for missing variables:
   ```bash
   diff -u <(grep -o '^[^#=]*' .env.example | sort) \
            <(grep -o '^[^#=]*' .env | sort)
   ```

---

## 📊 Monitoring & Logs

### 1. Missing Logs
**Symptoms**: No logs in Grafana/Loki

**Troubleshooting Steps**:
1. Check Loki service:
   ```bash
   docker-compose -f docker/compose.monitor.yml logs loki
   ```
2. Check Promtail logs:
   ```bash
   docker-compose -f docker/compose.monitor.yml logs promtail
   ```
3. Test Loki API:
   ```bash
   curl -s http://localhost:3100/ready
   ```

### 2. Prometheus Scraping Issues
**Symptoms**: Missing metrics

**Troubleshooting Steps**:
1. Check targets:
   ```bash
   curl -s http://localhost:9090/api/v1/targets | jq .
   ```
2. Check service discovery:
   ```bash
   curl -s http://localhost:9090/sd
   ```
3. Check Prometheus logs:
   ```bash
   docker-compose -f docker/compose.monitor.yml logs prometheus
   ```

---

## 🔑 Authentication Issues

### 1. GHCR Authentication Failures
**Symptoms**: Can't pull images from GitHub Container Registry

**Troubleshooting Steps**:
1. Check Docker config:
   ```bash
   cat ~/.docker/config.json
   ```
2. Test authentication:
   ```bash
   echo $GHCR_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
   ```
3. Check token permissions:
   ```bash
   curl -H "Authorization: token $GHCR_TOKEN" https://api.github.com/user
   ```

### 2. JWT Token Issues
**Symptoms**: Authentication failures in application

**Troubleshooting Steps**:
1. Check JWT configuration:
   ```bash
   grep -r "JWT_SECRET" .env*
   ```
2. Verify token format:
   ```bash
   # Decode token header
   echo "<token>" | cut -d'.' -f1 | base64 -d
   # Decode token payload
   echo "<token>" | cut -d'.' -f2 | base64 -d
   ```

---

## ⚡ Performance Problems

### 1. High CPU Usage
**Symptoms**: System becomes unresponsive

**Troubleshooting Steps**:
1. Identify problematic container:
   ```bash
   docker stats
   ```
2. Check process inside container:
   ```bash
   docker top <container_name>
   ```
3. Profile application:
   ```bash
   # For Node.js applications
   docker exec -it <container> node --inspect-brk -e "process._debugProcess(<pid>)"
   ```

### 2. Memory Leaks
**Symptoms**: Memory usage grows over time

**Troubleshooting Steps**:
1. Check container memory stats:
   ```bash
   docker stats --no-stream
   ```
2. Generate heap snapshot (Node.js):
   ```bash
   curl -X POST http://localhost:9229/json/version -d '{"type":"heap"}'
   ```
3. Check for memory leaks:
   ```bash
   docker-compose -f docker/compose.prod.yml exec adonisjs node --inspect-brk -e "process._debugProcess(1)"
   ```

---

## 🚀 Deployment Failures

### 1. CI/CD Pipeline Failures
**Symptoms**: GitHub Actions workflow fails

**Troubleshooting Steps**:
1. Check workflow run:
   ```bash
   # View workflow runs
   gh run list
   # View specific run
   gh run view <run_id>
   ```
2. Re-run failed jobs:
   ```bash
   gh run rerun <run_id> --failed
   ```
3. Download workflow logs:
   ```bash
   gh run download <run_id> -n <job_name>
   ```

### 2. Image Build Failures
**Symptoms**: Docker build fails

**Troubleshooting Steps**:
1. Build with debug output:
   ```bash
   DOCKER_BUILDKIT=0 docker build --no-cache --progress=plain .
   ```
2. Check Docker daemon logs:
   ```bash
   journalctl -u docker.service --no-pager -n 50
   ```
3. Check available disk space:
   ```bash
   df -h /var/lib/docker
   ```

---

## 🆘 Getting Help

If you've gone through these troubleshooting steps and are still experiencing issues:

1. **Collect Information**:
   - Docker version: `docker version`
   - Docker Compose version: `docker-compose version`
   - System info: `docker system info`
   - Service logs: `docker-compose -f docker/compose.prod.yml logs --tail=100`

2. **Check Known Issues**:
   - Review GitHub Issues for similar problems
   - Check project documentation

3. **Contact Support**:
   - DevOps Team: #devops-support
   - Emergency Contact: @devops-lead

---

📝 **Note**: This is a living document. Please contribute your solutions to common issues to help improve this guide.
