# StackBridge — DevOps Deployment

**StackBridge** demonstrates a production-grade, end-to-end DevOps deployment for a full-stack web application using **Kubernetes** and **Jenkins**. The repository focuses on infrastructure, observability, secure configuration, and CI/CD.

---

## Quick Start

```bash
git clone <repo-url>
cd stackbridge

kubectl apply -f k8s/
```
---

## Objective

Deploy and maintain a **modular, production-minded infrastructure stack** with:

* Clear separation of concerns
* Secure secret injection via your CI/secrets manager
* CI-driven rollout and validation (Jenkins pipeline)
* Observability, autoscaling, and namespace hygiene

---

## Tech Stack

* **Frontend**: React (served via NGINX)
* **Backend**: Node.js (exposes `/metrics` on port `5000`)
* **Database**: PostgreSQL (PVC-backed)
* **Containerization**: Docker
* **Orchestration**: Kubernetes (manifests / Kustomize under `k8s/`)
* **CI/CD**: Jenkins (Pipeline-as-Code)
* **Monitoring**: Prometheus Operator + ServiceMonitor
* **Ingress**: NGINX Ingress Controller
* **Autoscaling**: HorizontalPodAutoscaler (autoscaling/v2, CPU-based)

---

## Run / Deploy (policy)

* **Single manual command**: `kubectl apply -f k8s/ -n stackbridge-lab` — use this to deploy the entire stack from the `k8s/` folder.
* **Recommended (automated)**: Jenkins pipeline handles build → tag → push → deploy. Jenkins injects kubeconfig/credentials and performs rollout validation. No changes to the app code are required.
---

## Notes 

* Keep secrets out of source control — use Vault, SealedSecrets, ExternalSecrets, or CI secret injection.
* Replace HostPath PVs (if present) with cloud/block storage in real production.
* Use Kustomize overlays under `k8s/` for environment-specific values (images, replica counts, resources).
* Ensure Jenkins (or CI) runs smoke tests and `kubectl rollout status` as part of deployment.
---

