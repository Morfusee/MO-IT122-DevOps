# **Demonstration Script: Monitoring System Overview**

**Objective:** Showcase the capabilities of our monitoring system in providing real-time insights into system health, application performance, and efficient problem resolution.

**Target Audience:** Stakeholders, Developers

**Time Allotment:** 10-15 minutes

---

**(Start - 0:00)**

**Presenter:** "Good morning/afternoon everyone, and welcome to this demonstration of our monitoring system. Today, we'll walk through how our system provides comprehensive visibility into our infrastructure and applications, enabling us to proactively identify issues and ensure smooth operations."

**1. Introduction & Overview (2 minutes)**

- **Presenter:** "Our monitoring system is built around Grafana dashboards, pulling data from Prometheus, which collects metrics from various exporters like Node Exporter for system resources and Traefik for our API gateway and service performance. This integrated approach gives us a holistic view of our environment."
- **Presenter:** "We'll be focusing on two main areas today: **Resource Utilization** and **Application Performance**."

**(Transition to Resource Dashboard - `resource-dashboard.png`)**

**2. Resource Utilization (4 minutes)**

- **Presenter:** "Let's start with our **System Stats Dashboard** (referencing `resource-dashboard.png`). This dashboard provides a high-level overview of our server's health."
- **Presenter:** "On the top left, we have a quick summary of **CPU, Memory, and I/O pressure**. As you can see, our CPU Busy is currently at 2.7%, Sys Load at 0.0%, and RAM Used at 55.4%. These are all within healthy limits."
- **Presenter:** "Below that, we have more detailed graphs for **CPU Basic**, **Memory Basic**, **Network Traffic Basic**, and **Disk Space Used Basic**. Notice the consistent CPU usage and memory consumption over time. The disk space usage is also stable at 18.1% for the root filesystem."
- **Presenter:** "This dashboard allows us to quickly identify any resource bottlenecks or anomalies that might impact our applications. For example, a sudden spike in CPU or RAM usage would immediately alert us to potential issues."

**(Transition to Main Dashboard - `main-dashboard-2.png`)**

**3. Application Performance - Traefik Overview (4 minutes)**

- **Presenter:** "Now, let's switch gears to our **DevOps Dashboard** (referencing `main-dashboard-2.png`). This dashboard focuses on the performance of our applications, specifically through Traefik, our API gateway."
- **Presenter:** "Here, we can see **Most Requested Services**. Currently, `webscorecom` and `web` are our most active services, showing their request rates."
- **Presenter:** "The **Connections per Entrypoint** graph is crucial for understanding user traffic. We can see a steady number of connections to `webscorecom`, `userdb`, and `web`. Notice the slight increase in connections around 17:42:00 for `webscorecom`, indicating increased activity."
- **Presenter:** "Below that, we have **2xx over 1m** and **Other codes over 1m**. 2xx responses indicate successful requests, and as you can see, we have a healthy rate of successful interactions. The 'Other codes' panel tracks non-2xx responses. We want to keep an eye on this to ensure minimal errors."

**(Transition to Error Dashboard - `error-dashboard-2.png`)**

**4. Deep Dive into Errors & Troubleshooting (3 minutes)**

- **Presenter:** "To delve deeper into potential issues, we use our **Traefik Dashboard** (referencing `error-dashboard-2.png`). This dashboard is designed to pinpoint and troubleshoot errors."
- **Presenter:** "Let's focus on the **HTTP Details** section. We have a clear separation of **2xx over 1m** and **5xx over 1m**. Ideally, we want to see very low or no 5xx errors, which represent server-side issues."
- **Presenter:** "Currently, we have 'No data' for 5xx errors, which is excellent! This indicates no major server-side failures at this moment. If there were errors, this panel would show trends, allowing us to quickly identify when the errors started and their frequency."
- **Presenter:** "The **Requests Size** and **Responses Size** graphs provide insights into the data transfer for our services. This can be helpful in identifying large requests or responses that might be impacting performance."

**5. Alerting Demonstration (1-2 minutes)**

- **Presenter:** "Now, let's briefly discuss how our system helps us react to issues. While we don't have a live alert to trigger right now, I can show you our current alert status."

**(Transition to the Alerts dashboard)**

- **Presenter:** "This is our Alerts Dashboard, specifically showing our `node-health-alerts`. As you can see, all 8 of our defined alerts — such as `NodeDown`, `HighMemoryUsage`, `HighCPUUsage`, and `HighTraefikErrorRate` — are currently in a 'Normal' state and their 'Health' is 'ok'. This indicates that all our systems are running smoothly and within expected parameters right now."

- **Presenter:** "However, if any of these conditions were to be met — for example, if a node went down, or if CPU usage consistently exceeded a threshold — the 'State' here would change from 'Normal' to 'Firing' (or 'Pending', depending on the alert configuration). This would trigger an alert."

- **Presenter:** "These triggered alerts are then sent to our Alertmanager, which handles routing these notifications to the appropriate on-call teams via various channels like Slack, email, or PagerDuty. This ensures that our team is immediately aware of any critical issues and can respond swiftly to minimize any impact on our users."

- **Presenter:** "Once the underlying issue is resolved, the alert would automatically resolve itself, and we would see its state revert to 'Normal' here on this dashboard."

- **Presenter:** "This proactive alerting mechanism ensures that we are immediately aware of critical issues and can respond swiftly to minimize any impact on our users."

**(Back to Main Dashboard - `main-dashboard-2.png` or `resource-dashboard.png` for a concluding shot)**

**6. Conclusion & Q&A (1 minute)**

- **Presenter:** "In summary, our monitoring system provides us with real-time visibility into both our infrastructure and application performance. From high-level resource utilization to granular HTTP error details, we have the tools to ensure the stability and reliability of our services."
- **Presenter:** "This comprehensive approach allows us to:
  - **Proactively identify and address potential issues.**
  - **Minimize downtime and service disruptions.**
  - **Optimize resource allocation.**
  - **Gain deeper insights into application behavior.**"
- **Presenter:** "Thank you for your time. Are there any questions?"

---

**Key Dashboards to Highlight:**

- **`resource-dashboard.png` (System Stats):** For overall system health, CPU, RAM, Disk, Network.
- **`main-dashboard-2.png` (DevOps Dashboard):** For Traefik overview, most requested services, connections, and overall request success/error rates.
- **`error-dashboard-2.png` (Traefik Dashboard - Error Focus):** For detailed HTTP response codes (especially 5xx), request/response sizes.

**Explanation for Important Visualizations:**

- **Gauge Charts (CPU Busy, RAM Used, etc.):** Show current state and quick health checks.
- **Time-Series Graphs (2xx over 1m, Connections per Entrypoint, CPU Basic):** Show trends over time, crucial for identifying patterns, spikes, and drops. Emphasize the X-axis (time) and Y-axis (metric value).
- **"No data" panels:** Explain that this is a _good_ thing when it comes to errors (like 5xx over 1m), as it means no data was reported for that metric, indicating no errors.
- **Mean/Max values in tables:** Explain how these provide quick numerical summaries of the data presented in the graphs.
- **Prometheus Ready/Targets/Alertmanagers:** Briefly explain their role in data collection and alert routing.