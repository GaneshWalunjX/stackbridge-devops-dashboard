pipeline {
  agent {
    docker {
      image 'docker:24.0.7-cli'
      args '-v /var/run/docker.sock:/var/run/docker.sock'
    }
  }

  environment {
    REGISTRY             = "docker.io/ganesha7"
    IMAGE_BACKEND        = "stackbridge-devops-dashboard-backend:${BUILD_NUMBER}"
    IMAGE_FRONTEND       = "stackbridge-devops-dashboard-frontend:${BUILD_NUMBER}"
    HEALTHCHECK_BACKEND  = "http://localhost:5000/ping"
    HEALTHCHECK_FRONTEND = "http://localhost:3000"
    K8S_MANIFESTS        = "k8s"
  }

  options {
    timestamps()
    retry(2)
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Prune Workspace') {
      steps {
        sh 'find . -type d -name "node_modules" -exec rm -rf {} +'
      }
    }

    stage('DockerHub Login') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
        }
      }
    }

    stage('Build and Push Images') {
      steps {
        catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
          timeout(time: 10, unit: 'MINUTES') {
            sh '''
              docker build --pull --no-cache -t ${REGISTRY}/${IMAGE_BACKEND} backend
              docker push ${REGISTRY}/${IMAGE_BACKEND}
              docker build --pull --no-cache -t ${REGISTRY}/${IMAGE_FRONTEND} frontend
              docker push ${REGISTRY}/${IMAGE_FRONTEND}
            '''
          }
        }
      }
    }

    stage('Healthcheck') {
      steps {
        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
          sh '''
            docker system prune -af || true
            docker network create stackbridge-net || true
            docker-compose up -d db || true
            sleep 20
            docker run -d --rm --name backend --network stackbridge-net -p 5000:5000 ${REGISTRY}/${IMAGE_BACKEND}
            docker run -d --rm --name frontend --network stackbridge-net -p 3000:3000 ${REGISTRY}/${IMAGE_FRONTEND}
            docker run --rm --network stackbridge-net curlimages/curl -fsS ${HEALTHCHECK_BACKEND} || (echo "Backend healthcheck failed" && exit 1)
            docker run --rm --network stackbridge-net curlimages/curl -fsS ${HEALTHCHECK_FRONTEND} || (echo "Frontend healthcheck failed" && exit 1)
          '''
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
          sh '''
            kubectl version --client || (echo "kubectl not available" && exit 1)
            kubectl apply -f ${K8S_MANIFESTS}/namespace.yaml

            # Database
            kubectl apply -f ${K8S_MANIFESTS}/db-pv.yaml
            kubectl apply -f ${K8S_MANIFESTS}/db-pvc.yaml
            kubectl apply -f ${K8S_MANIFESTS}/db-deployment.yaml
            kubectl apply -f ${K8S_MANIFESTS}/db-service.yaml
            kubectl apply -f ${K8S_MANIFESTS}/db-vpa.yaml

            # Backend
            kubectl apply -f ${K8S_MANIFESTS}/backend-deployment.yaml
            kubectl apply -f ${K8S_MANIFESTS}/backend-service.yaml
            kubectl apply -f ${K8S_MANIFESTS}/backend-vpa.yaml

            # Frontend
            kubectl apply -f ${K8S_MANIFESTS}/frontend-deployment.yaml
            kubectl apply -f ${K8S_MANIFESTS}/frontend-service.yaml
            kubectl apply -f ${K8S_MANIFESTS}/frontend-vpa.yaml
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
    always {
      sh '''
        docker logs backend > backend.log || true
        docker logs frontend > frontend.log || true
        docker rm -f backend frontend || true
        docker-compose down || true
        docker network rm stackbridge-net || true
      '''
    }
  }
}
