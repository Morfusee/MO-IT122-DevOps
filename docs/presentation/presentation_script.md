Documentation Overview (2-3 minutes)
"Thank you ****, Continuing on with the presentation, I want to talk about something that's absolutely critical to the long-term success and maintainability of any project: documentation. For us, this wasn't just a final task; it was an integral part of our development process. Our documentation serves as the single source of truth for developers, operators, and new team members."
"We've structured our documentation to be comprehensive and easily accessible. It covers several key areas:"
System Design & Architecture: We have detailed documents like the system-design-documentation.md and cloud-env-documentation.md. These explain our entire containerized setup on OVHCloud, the networking and security layers, and how all the services interact.
Deployment: Our deployment-plan-documentation.md provides a step-by-step guide for provisioning the server and deploying the application, while our workflow documentation explains the entire CI/CD process.
Monitoring: The monitoring-documentation.md is a complete guide to our observability stack. It includes a full metrics catalog from Prometheus, detailed explanations of our Grafana dashboards, and a reference for every alert rule we've implemented.

(Navigate clicks to the "Operational Runbooks" documentation)

"Most importantly, we've created a detailed Operational Runbook. This isn't just a guide; it's a collection of actionable playbooks for real-world scenarios. As you can see, it covers everything from routine tasks like Restarting a Service or Renewing SSL Certificates, to critical incident response procedures like Handling High CPU Usage or Restoring a Database from Backup."
"We also have specific guides for troubleshooting, such as what to do when our automated deployment tool, Watchtower, fails, or how to analyze a CI test failure. By standardizing these procedures, we reduce human error, speed up response times, and ensure that anyone on the team can confidently manage the platform."

(Presenter clicks to the "Lessons Learned" slide)
Lessons Learned (2-3 minutes)
"This project was a significant undertaking, and we learned a great deal along the way. I'd like to share some of the key challenges we faced and the insights we gained."

(Presenter clicks to the "Challenges & Solutions" slide)

"Our first major challenge was the complexity of the monitoring stack. It's one thing to get Prometheus and Grafana running; it's another to effectively scrape metrics from multiple sources like Traefik, our custom AdonisJS app, and the node itself, and then turn that data into meaningful dashboards and alerts. We overcame this by creating a detailed metrics catalog and a query reference guide, which helped us standardize our dashboards and build very specific, actionable alerts."
"Second, security was a constant focus. Based on our extensive security setup, a key challenge was ensuring every layer was hardened—from the base OS with UFW and Fail2ban, to SSH hardening, to the application layer with Traefik's security headers and access controls. The solution was to automate this entire process using Ansible. This ensures every deployment is consistent and secure by default, turning a complex checklist into a single, repeatable command."
"Finally, we encountered some CI/CD pipeline flakiness. Early on, some tests that passed locally would fail intermittently in the GitHub Actions environment. We learned the importance of creating robust test failure analysis procedures, which are now part of our runbook. This includes capturing test artifacts like screenshots and videos and having a clear process for reproducing failures locally. This significantly improved the reliability of our automated pipeline."

(Presenter clicks to the "Future Improvements" slide)
"These lessons have directly informed our plans for future improvements. We aim to implement auto-scaling based on the rich metrics we're already collecting. We also plan to integrate a centralized logging solution like Loki to correlate metrics with specific log events, which will make troubleshooting even faster. And finally, we want to evolve our deployment strategy to include canary releases for even safer, zero-downtime updates."

(Presenter clicks to the final "Q&A" slide)
"This journey has been about building not just a platform, but a resilient, secure, and maintainable system. Thank you for your time. I'll now open the floor for any questions."