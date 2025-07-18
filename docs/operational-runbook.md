# 🚀 BrainBytes AI Tutoring Platform - Operational Runbook

<div align="center">
  <h3>Comprehensive Guide for DevOps Operations</h3>
  <p>Last Updated: July 18, 2025</p>
</div>

## 📋 Table of Contents

|  Section | Description |
|----------|-------------|
| 🔄 [Restart AdonisJS Backend Service](#-restart-adonisjs-backend-service) | Steps to restart the backend container |
| 🚀 [Deploy New Version](#-deploy-new-version) | CI/CD deployment procedures |
| 📊 [Monitor System Health](#-monitor-system-health) | System and application monitoring |
| ⚡ [Handle High CPU/Memory Usage](#-handle-high-cpumemory-usage) | Troubleshoot resource issues |
| 💾 [Restore from Backup](#-restore-from-backup) | Database restoration procedures |
| 🔒 [Renew SSL Certificates](#-renew-ssl-certificates) | Certificate management |
| 🚨 [Watchtower Failure Recovery](#-watchtower-failure-recovery) | Recover from failed container updates |
| 🧪 [Test Failure Analysis](#-test-failure-analysis) | Investigate CI test failures |
| 📄 [Configuration Drift Detection](#-configuration-drift-detection) | Audit environment inconsistencies |
| 📉 [Alert Investigation Playbook](#-alert-investigation-playbook) | Respond to system alerts |
| 🧰 [Container Bootstrap Troubleshooting](#-container-bootstrap-troubleshooting) | Fix service startup issues |
| 🔄 [Rolling Update Strategy](#-rolling-update-strategy) | Safely update services |
| 👤 [User Access & SSH Audit](#-user-access--ssh-audit) | Verify and secure access |


---

## 🔄 Restart AdonisJS Backend Service


Restart the AdonisJS backend container to apply configuration changes or recover from failures.

### Trigger Conditions
- 5xx errors in application logs
- High response times
- Configuration changes requiring restart
- Memory leaks observed

### Step-by-Step Actions
1. **SSH into the production server**
   ```bash
   ssh user@production-server
   cd /path/to/brainbytes
   ```

2. **Restart the backend service**
   ```bash
   docker-compose -f docker/compose.prod.yml restart adonisjs
   ```

3. **Verify service status**
   ```bash
   docker-compose -f docker/compose.prod.yml ps
   docker-compose -f docker/compose.prod.yml logs --tail=50 adonisjs
   ```

### Rollback Steps
If the new version has issues:
```bash
docker-compose -f docker/compose.prod.yml pull adonisjs:previous-version
docker-compose -f docker/compose.prod.yml up -d adonisjs
```

### Expected Outcome
- Service restarts with new configuration
- Application responds with 200 OK on health check
- No errors in logs after restart

### Escalation Path
- If service doesn't start: Notify DevOps team via Discord #alerts
- If issue persists after rollback: Escalate to senior DevOps engineer

---

## 🚀 Deploy New Version


Deploy a new version of the application using the CI/CD pipeline.

### Trigger Conditions
- New code pushed to main/develop branch
- Manual deployment triggered
- Security patches available

### Step-by-Step Actions
1. **Trigger deployment**
   - Go to GitHub Actions
   - Select "Run workflow" on the `automation.yml` workflow
   - Select branch and version tag
   - Click "Run workflow"

2. **Monitor deployment**
   ```bash
   # Watch deployment logs
   docker-compose -f docker/compose.prod.yml logs -f
   
   # Check service health
   curl -I https://your-domain.com/api/health
   ```

3. **Verify deployment**
   - Check Grafana dashboards
   - Run smoke tests
   - Verify API responses

### Rollback Steps
```bash
# Rollback to previous version
docker-compose -f docker/compose.prod.yml pull adonisjs:previous-version
docker-compose -f docker/compose.prod.yml up -d adonisjs

# Rollback frontend if needed
docker-compose -f docker/compose.prod.yml pull nextjs:previous-version
docker-compose -f docker/compose.prod.yml up -d nextjs
```

### Expected Outcome
- New version deployed successfully
- All services running with new version tags
- No errors in application logs
- Health checks passing

### Escalation Path
- If deployment fails: Check GitHub Actions logs
- If rollback needed: Follow rollback steps
- If issues persist: Contact DevOps lead

---

## 📊 Monitor System Health


Routine system and application health monitoring.

### Trigger Conditions
- Scheduled daily check
- Alerts from monitoring system
- Performance degradation reported

### Step-by-Step Actions
1. **Access Grafana**
   - Navigate to: `https://grafana.your-domain.com`
   - Check key dashboards:
     - System Overview
     - Application Performance
     - Database Metrics
     - Container Resources

2. **Check Prometheus Alerts**
   ```bash
   # Check firing alerts
   curl -s http://localhost:9090/api/v1/alerts | jq '.data.alerts[]|select(.state=="firing")'
   ```

3. **Verify Logs**
   ```bash
   # Check recent errors
   docker-compose -f docker/compose.prod.yml logs --tail=100 | grep -i error
   
   # Check container status
   docker-compose -f docker/compose.prod.yml ps
   ```

### Rollback Steps
N/A (Monitoring only, no changes made)

### Expected Outcome
- All systems operational
- No critical alerts
- Resource usage within thresholds

### Escalation Path
- For critical alerts: Immediate notification to on-call engineer
- For non-critical alerts: Create ticket for next business day

---

## ⚡ Handle High CPU/Memory Usage


Address high resource utilization in production.

### Trigger Conditions
- CPU > 80% for 5 minutes
- Memory > 85% utilization
- Container restarts due to OOM

### Step-by-Step Actions
1. **Identify problematic container**
   ```bash
   docker stats
   docker-compose -f docker/compose.prod.yml top
   ```

2. **Get detailed metrics**
   ```bash
   # Get container stats
   docker stats $(docker ps --format '{{.Names}}')
   
   # Get process list in container
   docker-compose -f docker/compose.prod.yml exec adonisjs top
   ```

3. **Check application logs**
   ```bash
   docker-compose -f docker/compose.prod.yml logs --tail=200 adonisjs
   ```

4. **Temporary mitigation**
   ```bash
   # Scale up service if possible
   docker-compose -f docker/compose.prod.yml up -d --scale adonisjs=2
   ```

### Rollback Steps
```bash
# Scale back down if scaling caused issues
docker-compose -f docker/compose.prod.yml up -d --scale adonisjs=1
```

### Expected Outcome
- Resource usage returns to normal levels
- Application remains responsive
- No data loss or corruption

### Escalation Path
- Immediate notification to DevOps team
- If issue persists: Escalate to senior engineer
- If service degradation: Consider failover to backup region

---

## 💾 Restore from Backup


Restore MongoDB database from backup.

### Trigger Conditions
- Data corruption detected
- Accidental data deletion
- Failed deployment with data issues

### Step-by-Step Actions
1. **List available backups**
   ```bash
   ls -l /path/to/backups/
   ```

2. **Stop dependent services**
   ```bash
   docker-compose -f docker/compose.prod.yml stop adonisjs nextjs
   ```

3. **Restore database**
   ```bash
   # Restore from latest backup
   mongorestore --drop --gzip --archive=/path/to/backup/latest.dump
   ```

4. **Restart services**
   ```bash
   docker-compose -f docker/compose.prod.yml up -d
   ```

### Rollback Steps
- If restore fails, attempt previous backup
- If issues persist, contact database administrator

### Expected Outcome
- Database restored to last known good state
- Data consistency verified
- Services running with restored data

### Escalation Path
- Notify team lead immediately
- If restore fails: Escalate to senior DBA
- If data loss occurred: Notify stakeholders

---

## 🔒 Renew SSL Certificates


Renew expiring SSL certificates for the domain.

### Trigger Conditions
- Certificate expiration within 30 days
- Certificate expiration alerts
- Security audit findings

### Step-by-Step Actions
1. **Check certificate status**
   ```bash
   docker-compose -f docker/compose.prod.yml exec reverse-proxy \
     certbot certificates
   ```

2. **Renew certificates**
   ```bash
   docker-compose -f docker/compose.prod.yml exec reverse-proxy \
     certbot renew --dry-run
   
   # If dry run successful, run actual renewal
   docker-compose -f docker/compose.prod.yml exec reverse-proxy \
     certbot renew
   ```

3. **Reload Traefik**
   ```bash
   docker-compose -f docker/compose.prod.yml kill -s SIGHUP reverse-proxy
   ```

### Rollback Steps
```bash
# Revert to previous certificate if needed
docker-compose -f docker/compose.prod.yml exec reverse-proxy \
  cp /etc/letsencrypt/archive/domain/privkey1.pem /letsencrypt/cert.key
docker-compose -f docker/compose.prod.yml exec reverse-proxy \
  cp /etc/letsencrypt/archive/domain/cert1.pem /letsencrypt/cert.crt
```

### Expected Outcome
- Certificates renewed successfully
- No service interruption
- New expiration date verified

### Escalation Path
- If renewal fails: Contact infrastructure team
- If service disruption: Follow incident response plan

---

## 🚨 Watchtower Failure Recovery


Recover from failed or missed container updates when Watchtower encounters issues.

### Trigger Conditions
- Watchtower container not running
- Containers not updating to latest tags
- GitHub Container Registry (GHCR) updates not reflected

### Step-by-Step Actions
1. **Check Watchtower Status**
   ```bash
   # List running Watchtower container
   docker ps | grep watchtower
   
   # View Watchtower logs
   docker logs watchtower
   ```

2. **Verify GHCR Access**
   ```bash
   # Check GHCR authentication
   echo $GHCR_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
   ```
   
   > **Note:** Replace `USERNAME` with your GitHub username and ensure `GHCR_TOKEN` is set with a valid GitHub Personal Access Token with `read:packages` scope.

3. **Manual Update**
   ```bash
   # Pull latest image for the service
   docker-compose -f docker/compose.prod.yml pull service_name
   
   # Recreate the service with new image
   docker-compose -f docker/compose.prod.yml up -d --no-deps service_name
   ```

### Rollback Steps
```bash
# Tag current version as previous
docker tag service_name:current service_name:previous

# Revert to previous version
docker-compose -f docker/compose.prod.yml up -d service_name
```

### Expected Outcome
- Containers running latest versions
- Watchtower service operational
- GHCR access verified

### Escalation Path
- If GHCR access issues: Contact repository admin
- If Watchtower won't start: Review logs and restart

---

## 🧪 Test Failure Analysis


Investigate and resolve test failures in CI pipeline.

### Trigger Conditions
- Japa or Cypress test failures in GitHub Actions
- Inconsistent test results
- Test timeouts or flaky tests

### Step-by-Step Actions
1. **Examine Test Output**
   ```bash
   # View test logs from GitHub Actions
   # 1. Go to GitHub repository
   # 2. Click on 'Actions' tab
   # 3. Select the failed workflow run
   # 4. Click on the failed test job
   # 5. Review the test output and artifacts
   ```

2. **Reproduce Locally**
   ```bash
   # For backend tests
   cd backend
   pnpm install
   pnpm test:ci
   
   # For frontend E2E tests
   cd frontend
   pnpm install
   pnpm test:e2e
   ```

3. **Check Test Artifacts**
   - Download test screenshots/videos from GitHub Actions
   - Review test coverage reports

### Rollback Steps
```bash
# Option 1: Revert test files only
git checkout -- test/

# Option 2: Revert last commit if tests were working before
git revert HEAD

# Option 3: Checkout specific commit where tests were passing
git checkout <commit-hash>
```

### Expected Outcome
- Root cause of test failure identified
- Tests passing consistently
- Documentation updated if needed

### Escalation Path
- For flaky tests: Create issue with `flaky-test` label
- For environment issues: Notify DevOps

---

## 📄 Configuration Drift Detection


Identify and resolve configuration inconsistencies across environments.

### Trigger Conditions
- Deployment failures
- Inconsistent behavior between environments
- Security audit findings

### Step-by-Step Actions
1. **Compare Environment Files**
   ```bash
   # Compare .env files
   diff -u .env.example .env
   
   # Check for sensitive data exposure
   grep -r 'PASSWORD\|SECRET\|KEY\|TOKEN' .env* --color=always
   
   # Check for missing variables
   comm -23 <(grep -o '^[^#=]*' .env.example | sort) \
            <(grep -o '^[^#=]*' .env | sort)
   ```

2. **Verify Traefik Configuration**
   ```bash
   # Check active Traefik configuration
   curl -s http://localhost:8080/api/rawdata | jq .
   
   # Check configured routers and services
   curl -s http://localhost:8080/api/http/routers | jq .
   curl -s http://localhost:8080/api/http/services | jq .
   
   # Check middleware configuration
   curl -s http://localhost:8080/api/http/middlewares | jq .
   ```

3. **Audit MongoDB Connections**
   ```bash
   # Check active connections
   docker-compose -f docker/compose.prod.yml exec mongo \
     mongo --eval "db.currentOp()"
   ```

### Rollback Steps
```bash
# Restore from version control
git checkout -- config/
# Restart services
docker-compose -f docker/compose.prod.yml up -d
```

### Expected Outcome
- Configuration consistent across environments
- Security issues addressed
- Documentation updated

### Escalation Path
- For security issues: Immediate security team notification
- For config issues: Notify team lead

---

## 📉 Alert Investigation Playbook


Structured response to system alerts and monitoring events.

### Trigger Conditions
- AppEndpointDown alert
- HighTraefikErrorRate
- Resource exhaustion alerts

### Step-by-Step Actions
1. **Check Prometheus**
   ```bash
   # Query failing endpoint
   curl -s "http://prometheus:9090/api/v1/query?query=up{job=\"adonisjs\"}"
   ```

2. **Review Traefik Metrics**
   ```bash
   # Check error rates
   curl -s "http://traefik:8080/metrics" | grep -i error
   ```

3. **Verify Application Health**
   ```bash
   curl -I http://localhost:3333/health
   docker-compose -f docker/compose.prod.yml logs --tail=100 adonisjs
   ```

### Rollback Steps
```bash
# If recent deployment caused issues
git revert HEAD
docker-compose -f docker/compose.prod.yml up -d
```

### Expected Outcome
- Alert resolved or root cause identified
- Monitoring gaps addressed
- Runbook updated with new findings

### Escalation Path
- For P1 alerts: Page on-call engineer
- For unresolved issues: Escalate to senior staff

---

## 🧰 Container Bootstrap Troubleshooting


Resolve issues when containers fail to start on new VPS instances.

### Trigger Conditions
- Containers in crash loop
- Permission denied errors
- Missing environment variables

### Step-by-Step Actions
1. **Check Container Logs**
   ```bash
   docker-compose -f docker/compose.prod.yml logs --tail=100
   ```

2. **Verify .env File**
   ```bash
   # Check for required variables
   cat .env | grep -v '^#' | grep -v '^$'
   ```

3. **Check Disk Space**
   ```bash
   df -h
   docker system df
   ```

### Rollback Steps
```bash
# Remove corrupted images
docker system prune -a
# Pull fresh images
docker-compose -f docker/compose.prod.yml pull
```

### Expected Outcome
- Containers running successfully
- All dependencies resolved
- Documentation updated

### Escalation Path
- For image issues: Contact image maintainer
- For VPS issues: Contact cloud provider

---

## 🔄 Rolling Update Strategy


Safely deploy updates with minimal downtime.

### Trigger Conditions
- Scheduled deployment window
- Security patches
- Feature releases

### Step-by-Step Actions
1. **Pre-Deployment**
   ```bash
   # Create backup
   docker-compose -f docker/compose.prod.yml config > backup-config-$(date +%Y%m%d).yml
   ```

2. **Deploy Update**
   ```bash
   # Pull new images
   docker-compose -f docker/compose.prod.yml pull
   
   # Update one service at a time
   docker-compose -f docker/compose.prod.yml up -d --no-deps service_name
   ```

3. **Verify**
   ```bash
   # Check service health
   curl -I http://localhost/health
   # Monitor logs
   docker-compose -f docker/compose.prod.yml logs -f
   ```

### Rollback Steps
```bash
# Revert to previous version
docker-compose -f backup-config-*.yml up -d
```

### Expected Outcome
- Zero-downtime deployment
- All services operational
- Performance within thresholds

### Escalation Path
- For rollback issues: Follow incident response
- For data issues: Contact DBA

---

## 👤 User Access & SSH Audit


Verify and manage system access controls.

### Trigger Conditions
- Team member onboarding/offboarding
- Security incident
- Quarterly security review

### Step-by-Step Actions
1. **Audit SSH Access**
   ```bash
   # List authorized keys
   cat ~/.ssh/authorized_keys
   # Check sudo access
   grep -r "NOPASSWD" /etc/sudoers.d/
   ```

2. **Review Docker Access**
   ```bash
   # List users in docker group
   getent group docker
   # Check container access
   docker ps --format '{{.Names}} {{.Image}} {{.Status}}'
   ```

3. **Verify Firewall**
   ```bash
   # Check active rules
   sudo ufw status verbose
   # Check open ports
   sudo ss -tulpn
   ```

### Rollback Steps
```bash
# Revoke access
sudo deluser username docker
sudo deluser username sudo
```

### Expected Outcome
- Only authorized users have access
- All access properly documented
- Security controls enforced

### Escalation Path
- For security incidents: Follow security protocol
- For access issues: Contact IT admin


Renew expiring SSL certificates for the domain.

### Trigger Conditions
- Certificate expiration within 30 days
- Certificate expiration alerts
- Security audit findings

### Step-by-Step Actions
1. **Check certificate status**
   ```bash
   docker-compose -f docker/compose.prod.yml exec reverse-proxy \
     certbot certificates
   ```

2. **Renew certificates**
   ```bash
   docker-compose -f docker/compose.prod.yml exec reverse-proxy \
     certbot renew --dry-run
   
   # If dry run successful, run actual renewal
   docker-compose -f docker/compose.prod.yml exec reverse-proxy \
     certbot renew
   ```

3. **Reload Traefik**
   ```bash
   docker-compose -f docker/compose.prod.yml kill -s SIGHUP reverse-proxy
   ```

### Rollback Steps
```bash
# Revert to previous certificate if needed
docker-compose -f docker/compose.prod.yml exec reverse-proxy \
  cp /etc/letsencrypt/archive/domain/privkey1.pem /letsencrypt/cert.key
docker-compose -f docker/compose.prod.yml exec reverse-proxy \
  cp /etc/letsencrypt/archive/domain/cert1.pem /letsencrypt/cert.crt
```

### Expected Outcome
- Certificates renewed successfully
- No service interruption
- New expiration date verified

### Escalation Path
- If renewal fails: Contact infrastructure team
- If service disruption: Follow incident response plan
