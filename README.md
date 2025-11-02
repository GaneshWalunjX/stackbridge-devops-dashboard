# StackBridge — DevOps Deployment

**StackBridge** demonstrates a production-grade, end-to-end DevOps deployment for a full-stack web application using **Kubernetes** and **Jenkins**.
The repository focuses on **infrastructure**, **observability**, **secure configuration**, and **CI/CD automation**.

---

## Run / Deploy Commands

```bash
# **1. Clone the repository**
git clone <repo-url>
cd stackbridge

# **2. Build Docker images**
docker build -t <registry>/stackbridge-frontend:1.0.0 ./frontend
docker build -t <registry>/stackbridge-backend:1.0.0 ./backend

# **3. Push images to registry**
docker push <registry>/stackbridge-frontend:1.0.0
docker push <registry>/stackbridge-backend:1.0.0

# **4. Deploy to Kubernetes**
# All manifests are stored inside the k8s/ directory.

# Step 1: Apply the namespace
kubectl apply -f k8s/namespace.yaml

# Step 2: Deploy the full stack
kubectl apply -f k8s/ -n stackbridge-lab

# **5. Verify Deployment**
kubectl get pods,svc,ingress -n stackbridge-lab
kubectl rollout status deployment/frontend -n stackbridge-lab
kubectl rollout status deployment/backend -n stackbridge-lab

# **6. Access Application**
http://<ingress-ip>/frontend
http://<ingress-ip>/backend
```

---

## Objective

Deploy and maintain a **modular**, **production-minded infrastructure stack** with:

* Clear separation of concerns
* Secure secret injection via CI or secrets manager
* CI-driven rollout and validation using Jenkins pipeline
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
* **Autoscaling**:
  * **HorizontalPodAutoscaler (HPA)** — CPU-based (`autoscaling/v2`)
  * **VerticalPodAutoscaler (VPA)** — Memory-based (`autoscaling/v2`)

---

## CI/CD Pipeline (Jenkins)

* Builds Docker images for frontend and backend
* Tags images with build numbers
* Pushes images to container registry
* Applies Kubernetes manifests using kubeconfig credentials
* Verifies rollout and service health

---

## Monitoring & Observability

* Backend exposes metrics at `/metrics` (port `5000`)
* Prometheus scrapes backend metrics
* Grafana visualizes CPU, memory, and request metrics
* HPA and VPA ensure automatic scaling based on load
* Readiness and Liveness probes enable safe rolling updates

---

## Notes

* Keep secrets out of source control — use Vault, SealedSecrets, ExternalSecrets, or CI secret injection.
* Replace HostPath PVs (if present) with cloud/block storage in real production.
* Use Kustomize overlays under `k8s/` for environment-specific values (images, replica counts, resources).
* Ensure Jenkins (or CI) runs smoke tests and `kubectl rollout status` as part of the deployment process.

---