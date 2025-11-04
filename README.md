# StackBridge — DevOps Deployment

**StackBridge** demonstrates a production-grade, end-to-end DevOps deployment for a full-stack web application using **Docker**, **Kubernetes**, **Terraform**, **Jenkins**, and **Observability**. The repository focuses on infrastructure automation, observability, secure configuration, and CI/CD integration.

---

## Tech Stack

* **Frontend**: React (served via NGINX)
* **Backend**: Node.js (exposes `/metrics` on port `5000`)
* **Database**: PostgreSQL (PVC-backed)
* **Containerization**: Docker
* **Orchestration**: Kubernetes (manifests / Kustomize under `k8s/`)
* **Infrastructure as Code (IaC)**: Terraform
* **CI/CD**: Jenkins (Pipeline-as-Code)
* **Monitoring**: Prometheus Operator + ServiceMonitor
* **Ingress**: NGINX Ingress Controller
* **Autoscaling**: HorizontalPodAutoscaler (CPU-based) and VerticalPodAutoscaler (Memory-based)

---
### Clone the repository

```bash
git clone https://github.com/GaneshWalunjX/stackbridge-devops-dashboard.git
cd stackbridge-devops-dashboard
```

---

## Frontend (React + NGINX)

```bash
cd frontend
npm install
npm run build
```
---

## Backend (Node.js + PostgreSQL)

```bash
cd backend
npm install
npm start
```
---


## Docker Build & Run

### Frontend

```bash
docker build -t stackbridge-frontend:local ./frontend
docker run -p 3000:80 stackbridge-frontend:local
```

### Backend

```bash
docker build -t stackbridge-backend:local ./backend
docker run -p 5000:5000 stackbridge-backend:local
```

---

## Kubernetes Deployment

### Create namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

### Apply manifests

```bash
kubectl apply -f k8s/ -n stackbridge-lab
```

---

## Access Application

```bash
http://<ingress-ip>/frontend
http://<ingress-ip>/backend
```

---

## Objective

Deploy and maintain a **modular, production-minded infrastructure stack** with:

* Clear separation of concerns
* Secure secret injection via CI or a secrets manager
* CI-driven rollout and validation (Jenkins pipeline)
* Observability, autoscaling, and namespace hygiene
---

## **Kubernetes Architecture**

Kubernetes manages the deployments, services, ingress routing, and autoscaling for the application.
All manifests are organized in the `k8s/` directory, ensuring clean namespace structure, modular configuration, and reliable production-grade rollout.

---

## CI/CD Pipeline (Jenkins)

Jenkins automates Docker image builds, pushes images to the registry, triggers Terraform provisioning, and deploys workloads to Kubernetes.
Each commit runs automated build, test, and deployment pipelines for consistent delivery across environments.

---

## Terraform Integration

Terraform provisions the Kubernetes cluster, namespace, and persistent storage.
It integrates with Jenkins to maintain consistent, automated infrastructure setup across dev, staging, and production.

---

## Monitoring & Observability

* **Metrics Endpoint:** Backend exposes metrics at `/metrics` (port `5000`)
* **Prometheus Integration:** Scrapes backend metrics using a ServiceMonitor
* **Grafana Dashboards:** Visualize CPU, memory, and request metrics
* **Probes:** Readiness and Liveness probes ensure safe rolling updates
* **Autoscaling Validation:** HPA and VPA automatically adjust resources based on workload

---

## Notes

* Keep secrets out of source control — use Vault, SealedSecrets, ExternalSecrets, or CI secret injection.
* Replace HostPath PVs (used in testing) with cloud or block storage in production.
* Use Kustomize overlays under `k8s/` for environment-specific configurations.
* Ensure Jenkins (or CI) runs smoke tests and `kubectl rollout status` during deployments.

---