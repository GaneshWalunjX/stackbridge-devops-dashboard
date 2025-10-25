pipeline {
  agent any

  environment {
    REGISTRY             = "docker.io/ganesha7"
    IMAGE_BACKEND        = "stackbridge-devops-dashboard-backend:${BUILD_NUMBER}"
    IMAGE_FRONTEND       = "stackbridge-devops-dashboard-frontend:${BUILD_NUMBER}"
    HEALTHCHECK_BACKEND  = "http://localhost:5000/ping"
    HEALTHCHECK_FRONTEND = "http://localhost:3000"
    K8S_MANIFESTS        = "k8s" // folder containing your .yaml files
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

    stage('DockerHub Login') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'stackbridge-dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
        }
      }
    }

    stage('Build and Push Images') {
      steps {
        sh '''
          docker build --pull --no-cache -t ${REGISTRY}/${IMAGE_BACKEND} backend
          docker push ${REGISTRY}/${IMAGE_BACKEND}
          docker build --pull --no-cache -t ${REGISTRY}/${IMAGE_FRONTEND} frontend
          docker push ${REGISTRY}/${IMAGE_FRONTEND}
        '''
      }
    }

    stage('Healthcheck') {
      steps {
        sh '''
          docker-compose up -d db || true
          sleep 20
          docker run -d --name backend -p 5000:5000 ${REGISTRY}/${IMAGE_BACKEND}
          docker run -d --name frontend -p 3000:3000 ${REGISTRY}/${IMAGE_FRONTEND}
          docker run --rm --network container:backend curlimages/curl -fsS ${HEALTHCHECK_BACKEND} || (echo "Backend healthcheck failed" && exit 1)
          docker run --rm --network container:frontend curlimages/curl -fsS ${HEALTHCHECK_FRONTEND} || (echo "Frontend healthcheck failed" && exit 1)
        '''
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh '''
          kubectl apply -f ${K8S_MANIFESTS}/namespace.yaml

          kubectl apply -f ${K8S_MANIFESTS}/db-pv.yaml
          kubectl apply -f ${K8S_MANIFESTS}/db-pvc.yaml
          kubectl apply -f ${K8S_MANIFESTS}/db-deployment.yaml
          kubectl apply -f ${K8S_MANIFESTS}/db-service.yaml
          kubectl apply -f ${K8S_MANIFESTS}/db-vpa.yaml

          kubectl apply -f ${K8S_MANIFESTS}/backend-deployment.yaml
          kubectl apply -f ${K8S_MANIFESTS}/backend-service.yaml
          kubectl apply -f ${K8S_MANIFESTS}/backend-vpa.yaml

          kubectl apply -f ${K8S_MANIFESTS}/frontend-deployment.yaml
          kubectl apply -f ${K8S_MANIFESTS}/frontend-service.yaml
          kubectl apply -f ${K8S_MANIFESTS}/frontend-vpa.yaml
        '''
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
      '''
    }
  }
}
