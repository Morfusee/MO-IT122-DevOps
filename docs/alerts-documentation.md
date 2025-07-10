# Alerts Dcumentation

This guide provides clear and actionable procedures for each alert defined in the Prometheus `alerting-rules.yml`. Each section includes what the alert means, possible causes, troubleshooting steps, and resolution procedures.

---

## Alert: `NodeDown`

**Severity:** Critical  
**Trigger:** No metrics received from `node_exporter` for 1 minute  
**Expression:** `up{job="node_exporter"} == 0`

### Meaning

This alert indicates that a monitored node is unreachable. It could be offline, experiencing network issues, or the `node_exporter` service is down.

### Possible Causes

- Node is powered off or crashed
- Network issues between Prometheus and the node
- `node_exporter` is stopped or crashed
- Firewall is blocking port 9100
- Incorrect `scrape_config`

### Troubleshooting

1. Ping the instance: `ping {{ $labels.instance }}`
2. SSH into the node and check service:  
   `sudo systemctl status node_exporter`
3. Test metrics endpoint:  
   `curl http://{{ $labels.instance }}:9100/metrics`
4. Check in Prometheus UI: `Status -> Targets`
5. Inspect firewall and port accessibility

### Resolution

- Restart `node_exporter`
- Reboot or power on the node
- Fix network or firewall issues
- Correct Prometheus `scrape_config`

---

## Alert: `HighMemoryUsage`

**Severity:** Warning  
**Trigger:** Memory usage > 80% for 10s  
**Expression:**  
`(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 80`

### Meaning

Indicates high memory consumption on a node, which may lead to swapping or crashes.

### Possible Causes

- Memory leaks in applications
- Unexpected workload spikes
- Poorly configured applications
- Insufficient RAM
- Inefficient garbage collection

### Troubleshooting

1. Check memory usage: `htop`, `top`, or `ps aux --sort=-%mem`
2. Review app logs for errors
3. Examine recent deployments/config changes
4. Analyze memory trends on dashboards

### Resolution

- Restart high-memory applications
- Tune app memory settings
- Add more RAM or scale services
- Fix memory leaks
- Clean temp files and caches

---

## Alert: `HighCPUUsage`

**Severity:** Warning  
**Trigger:** CPU usage > 85% for 2m  
**Expression:**  
`100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) > 85`

### Meaning

High CPU utilization is affecting system performance.

### Possible Causes

- Heavy computational loads
- Inefficient or stuck applications
- DoS attacks
- Background jobs misbehaving
- Insufficient CPU cores

### Troubleshooting

1. Inspect processes: `top`, `htop`, or `ps aux --sort=-%cpu`
2. Check logs of high-CPU apps
3. Review recent changes or cron jobs
4. Analyze CPU graphs on dashboard

### Resolution

- Optimize apps using excessive CPU
- Reschedule or throttle background tasks
- Scale out or upgrade CPU
- Address potential DoS issues
- Restart problematic services (temp fix)

---

## Alert: `LowDiskSpace`

**Severity:** Warning  
**Trigger:** Disk usage > 90% for 3m  
**Expression:**  
`(1 - (node_filesystem_avail_bytes{fstype!~"tmpfs|overlay"} / node_filesystem_size_bytes{fstype!~"tmpfs|overlay"})) * 100 > 90`

### Meaning

Disk usage is critically high and may affect system stability.

### Possible Causes

- Log bloat without rotation
- Orphaned temporary files
- Large data uploads or backups
- Snapshots consuming space
- Users storing large files

### Troubleshooting

1. Check usage: `df -h`
2. Locate large files: `du -sh /*`, `/var/*`, `/opt/*`
3. Inspect log rotation (`logrotate`)
4. Check cron cleanup jobs
5. Analyze disk trend graphs

### Resolution

- Remove temp or unused files
- Rotate/compress/delete logs
- Delete outdated backups
- Expand disk or add volumes

---

## Alert: `NodeExporterMissing`

**Severity:** Critical  
**Trigger:** No `node_exporter` targets found for 1m  
**Expression:** `absent(up{job="node_exporter"})`

### Meaning

Prometheus cannot find or scrape any `node_exporter` targets.

### Possible Causes

- `node_exporter` not installed
- `scrape_config` missing or incorrect
- Global firewall issue
- Broken service discovery

### Troubleshooting

1. Confirm `node_exporter` is installed and running
2. Validate `prometheus.yml` config
3. Check Prometheus UI: `Status -> Targets`
4. Test metrics endpoint from Prometheus host
5. Review Prometheus logs

### Resolution

- Install and start `node_exporter`
- Fix or define `scrape_config`
- Resolve network/firewall issues
- Repair service discovery setup

---

## Alert: `HighTraefikErrorRate`

**Severity:** Warning  
**Trigger:** 5xx error rate > 5% over 2m  
**Expression:**  
`(sum(rate(traefik_service_requests_total{code=~"5..",protocol="http"}[2m])) / sum(rate(traefik_service_requests_total{protocol="http"}[2m]))) > 0.05`

### Meaning

Backend services behind Traefik are failing to serve requests successfully.

### Possible Causes

- Unhealthy backend services
- High load or timeouts
- Bad deployments
- Misconfigured routing
- External dependencies failing

### Troubleshooting

1. Check Traefik dashboards for erroring services
2. Review logs of affected services
3. Inspect backend host resource usage
4. Bypass Traefik and test services directly
5. Check recent changes

### Resolution

- Restart affected services
- Scale backend services
- Roll back recent deployments
- Fix application issues
- Resolve database or dependency issues

---

## Alert: `AppEndpointDown`

**Severity:** Critical  
**Trigger:** AdonisJS app metrics endpoint unreachable for 1m  
**Expression:** `up{job="adonisjs-app"} == 0`

### Meaning

AdonisJS app is down or its metrics endpoint is inaccessible.

### Possible Causes

- App crashed or stopped
- App overloaded
- Misconfigured Prometheus scrape target
- Network/firewall issues

### Troubleshooting

1. Check app status: `pm2`, `systemctl`, or container status
2. Review application logs
3. `curl` the `/metrics` endpoint
4. Check Prometheus UI: `Status -> Targets`
5. Inspect firewall rules

### Resolution

- Restart app
- Fix configuration or dependency issues
- Scale resources
- Correct `scrape_config`

---

## Alert: `PrometheusSelfScrapeFailing`

**Severity:** Warning  
**Trigger:** Prometheus can't scrape itself for 1m  
**Expression:** `up{job="prometheus"} == 0`

### Meaning

Prometheus is unable to scrape its own metrics, which may indicate a systemic issue.

### Possible Causes

- Prometheus is unhealthy or overloaded
- Firewall blocking `localhost:9090`
- Prometheus config is incorrect
- Disk full or out of memory

### Troubleshooting

1. Check service: `systemctl status prometheus` or Docker status
2. Test endpoint: `curl http://localhost:9090/metrics`
3. Check Prometheus logs
4. Inspect server resources: `top`, `df -h`, etc.
5. Review `scrape_config`

### Resolution

- Restart Prometheus
- Free up system resources
- Fix local firewall config
- Correct the self-scrape configuration
