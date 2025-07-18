**(Presenter)**: "To start, I want to talk about the foundation of our entire operational strategy: our documentation. We treat it as **'The Single Source of Truth.'**"

"For us, this means our documentation is:"
*   "First, **Comprehensive**: It’s not an afterthought; it’s an integral part of our development process."
*   "Second, **Team-Focused**: It's built to empower everyone, from developers and operators to new team members who need to get up to speed quickly."
*   "And finally, **Well-Structured**: Everything is organized to be accessible and easy to navigate, so you can find what you need, when you need it."

---

#### **Slide 3: Documentation Structure**

**(Presenter)**: "To achieve this, we've organized our documentation into four key pillars."

*   "First, **System & Architecture**, which covers our containerized setup on OVHCloud, networking, and security layers."
*   "Next, **Deployment & CI/CD**, detailing our entire automated pipeline with GitHub Actions and our Docker configurations."
*   "Then, we have **Monitoring & Alerts**, which is a complete guide to our Prometheus and Grafana stack, including every metric and alert rule."
*   "And most importantly for today's discussion, **Operations & Support**. This pillar contains our playbooks for day-to-day tasks and incident response."

---

#### **Slide 4: Operational Runbooks (Live Demo Section)**

**(Presenter)**: "This brings me to our **Operational Runbooks**. These aren't just static documents; they are actionable playbooks for real-world scenarios. I want to actually walk you through how we use them."

**(Presenter brings up a terminal or speaks as if they are typing the commands)**

"Let's start with a routine operation. Imagine our backend API feels a bit sluggish, and we want to perform a controlled restart."

"Instead of guessing, we open the runbook. It tells us to run this exact command:"

```bash
docker-compose -f docker/compose.prod.yml restart adonisjs
```

"This command is precise. It tells Docker Compose to gracefully restart *only* the `adonisjs` container, leaving the database, frontend, and other services untouched. No widespread downtime, just a targeted refresh."

"Now, let's take a more critical scenario: **Incident Response**. Let's say we get a 'High CPU Usage' alert from our monitoring system."

"Panic is not an option. We turn to the runbook. **Step 1: Identify the source.**"

"The runbook tells us to SSH into the server and run:"

```bash
docker stats
```
"This gives us a live-updating dashboard of all running containers. In seconds, we can see which container is consuming all the CPU. Let's say it's our `adonisjs` backend."

"Okay, we know *which* container, but not *why*. **Step 2: Dig deeper.**"

"The runbook provides the next command:"

```bash
docker-compose -f docker/compose.prod.yml exec adonisjs top
```

"This powerful command lets us run the `top` utility *inside* the misbehaving container. Now we're not just looking at the container itself; we're seeing the specific Node.js process inside that's causing the spike. This is the difference between knowing your house is on fire and knowing it's the toaster in the kitchen."

"As you can see, our runbooks provide a clear, command-by-command path from problem to diagnosis, ensuring a fast, consistent, and effective response every time."

---

#### **Slide 5: Lessons Learned: Challenges & Solutions**

**(Presenter)**: "Building this system taught us a lot. We faced several key challenges that ultimately made our processes stronger."

*   "With **Monitoring**, the challenge wasn't just collecting data, but making sense of it. Our solution was to create a detailed metrics catalog and standardized dashboards, turning noise into actionable insights."
*   "For **Security**, hardening the full stack was complex. Automation through Ansible was our answer, allowing us to enforce security policies consistently on every deployment."
*   "And with our **CI/CD Pipeline**, we battled intermittent test failures. The solution was to develop robust failure analysis procedures, which are now part of our runbook, allowing us to quickly reproduce and fix bugs."

"The **key insight** from all of this was that proactive documentation—especially these runbooks and alert guides—was the tool that enabled us to solve these complex problems efficiently."

---

#### **Slide 6: Future Improvements**

**(Presenter)**: "We're proud of what we've built, and we have a clear vision for the future."

*   "First, we'll implement **Auto-Scaling**, using the rich metrics from Prometheus to dynamically adjust resources based on demand."
*   "Next, we'll enhance **Observability** by integrating a centralized logging tool like Loki, allowing us to correlate metrics directly with application logs."
*   "And finally, we plan to adopt **Advanced Deployment** strategies like Canary Releases to make our updates even safer and more seamless."

---

#### **Slide 7: Q&A**

**(Presenter)**: "That concludes our showcase. We’ve built a platform on a foundation of automation, observability, and operational excellence."

"Thank you for your time. I'd now like to open the floor for any questions you may have."
