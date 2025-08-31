# StackBridge DevOps Dashboard

A production-grade DevOps dashboard built with React, Tailwind CSS, Docker, Jenkins, and Kubernetes. This project simulates real-world deployment pipelines, container health monitoring, and CI/CD metrics for infrastructure validation.

## Features

- Secure login and registration flow
- Dashboard with container status, pipeline metrics, and logs
- Protected routes using token-based authentication
- Responsive UI powered by Tailwind CSS
- Simulated CI/CD pipeline integration
- Dockerized frontend for deployment testing
- Kubernetes-ready structure for orchestration

## Tech Stack

| Layer        | Tools & Frameworks                     |
|--------------|----------------------------------------|
| Frontend     | React, Tailwind CSS                    |
| Auth         | Token-based (localStorage/session)     |
| CI/CD        | Jenkins, GitHub Actions (optional)     |
| Container    | Docker                                 |
| Orchestration| Kubernetes                             |

## Installation

```bash
# Clone the repo
git clone https://github.com/ganesh-cl7/stackbridge-devops-dashboard.git
cd stackbridge-devops-dashboard/frontend

# Install dependencies
npm install

# Start the development server
npm start
