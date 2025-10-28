pipeline {
  agent none

  environment {
    REGISTRY       = "docker.io/ganesha7"
    IMAGE_BACKEND  = "stackbridge-devops-dashboard-backend:${BUILD_NUMBER}"
    IMAGE_FRONTEND = "stackbridge-devops-dashboard-frontend:${BUILD_NUMBER}"
    K8S_MANIFESTS  = "k8s"
  }

  options {
    timestamps()
    retry(2)
  }

  stages {
    stage('Build and Push Images') {
      agent {
        docker {
          image 'docker:24.0.7-cli'
          args '--entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock'
        }
      }
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            echo "[INFO] Logging into DockerHub"
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

            echo "[INFO] Building and pushing backend image"
            docker build --pull --no-cache -t ${REGISTRY}/${IMAGE_BACKEND} backend
            docker push ${REGISTRY}/${IMAGE_BACKEND}

            echo "[INFO] Building and pushing frontend image"
            docker build --pull --no-cache -t ${REGISTRY}/${IMAGE_FRONTEND} frontend
            docker push ${REGISTRY}/${IMAGE_FRONTEND}
          '''
        }
      }
    }

    stage('Inject Image Tags') {
      agent {
        docker {
          image 'alpine:3.19'
          args '--entrypoint=""'
        }
      }
      steps {
        sh '''
          echo "[INFO] Injecting image tags into Kubernetes manifests"
          apk add --no-cache sed
          sed -i "s|image: .*stackbridge-backend.*|image: ${REGISTRY}/${IMAGE_BACKEND}|" ${K8S_MANIFESTS}/backend-deployment.yaml
          sed -i "s|image: .*stackbridge-frontend.*|image: ${REGISTRY}/${IMAGE_FRONTEND}|" ${K8S_MANIFESTS}/frontend-deployment.yaml
        '''
      }
    }

    stage('Deploy to Kubernetes') {
      agent {
        docker {
          image 'bitnami/kubectl:1.27'
          args '--entrypoint=""'
        }
      }
      steps {
        sh 'echo "[DEBUG] Deploy stage started. Workspace: $(pwd)"'
        withCredentials([file(credentialsId: 'kubeconfig-stackbridge', variable: 'KUBECONFIG')]) {
          sh '''
            echo "[INFO] Validating kubeconfig file"
            ls -l $KUBECONFIG || { echo "[ERROR] kubeconfig not found"; exit 1; }
            head -n 10 $KUBECONFIG || { echo "[ERROR] kubeconfig unreadable"; exit 1; }

            echo "[INFO] Running kubectl commands"
            kubectl version --client
            kubectl get nodes
            kubectl apply -f ${K8S_MANIFESTS}/namespace.yaml
            kubectl apply -f ${K8S_MANIFESTS}/db-pv.yaml
            kubectl apply -f ${K8S_MANIFESTS}/db-pvc.yaml
            kubectl apply -f ${K8S_MANIFESTS}/db-deployment.yaml
            kubectl apply -f ${K8S_MANIFESTS}/db-service.yaml
            kubectl apply -f ${K8S_MANIFESTS}/backend-deployment.yaml
            kubectl apply -f ${K8S_MANIFESTS}/backend-service.yaml
            kubectl apply -f ${K8S_MANIFESTS}/frontend-deployment.yaml
            kubectl apply -f ${K8S_MANIFESTS}/frontend-service.yaml
          '''
        }
      }
    }
  }

  post {
    success {
      echo 'CI/CD pipeline completed successfully.'
    }
    failure {
      echo 'Pipeline failed. Check logs and container status.'
    }
  }
}
