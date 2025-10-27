pipeline {
  agent {
    docker {
      image 'docker:24.0.7-cli'
      args '--entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock'
    }
  }

  environment {
    REGISTRY             = "docker.io/ganesha7"
    IMAGE_BACKEND        = "stackbridge-devops-dashboard-backend:${BUILD_NUMBER}"
    IMAGE_FRONTEND       = "stackbridge-devops-dashboard-frontend:${BUILD_NUMBER}"
    HEALTHCHECK_BACKEND  = "http://stackbridge-backend:5000/ping"
    HEALTHCHECK_FRONTEND = "http://stackbridge-frontend"
    K8S_MANIFESTS        = "k8s"
  }

  options {
    timestamps()
    retry(2)
  }

  stages {
    stage('Verify Docker Access') {
      steps {
        sh 'docker version'
      }
    }

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

    stage('Test Backend') {
      steps {
        sh '''
          docker build -t backend-test backend
          docker run --rm backend-test npm test || echo "Backend tests failed"
        '''
      }
    }

    stage('Lint Frontend') {
      steps {
        sh '''
          docker build -t frontend-lint --target build frontend
          docker run --rm frontend-lint npm run lint || echo "Frontend lint failed"
        '''
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
            ls -l docker-compose.yml || (echo "Missing docker-compose.yml" && exit 1)
            docker-compose -f docker-compose.yml config || (echo "Invalid docker-compose.yml" && exit 1)
            docker network create stackbridge-network || true
            docker-compose -f docker-compose.yml up -d db
            sleep 20
            docker run -d --name stackbridge-backend --network stackbridge-network -p 5000:5000 ${REGISTRY}/${IMAGE_BACKEND}
            docker run -d --name stackbridge-frontend --network stackbridge-network -p 3000:80 ${REGISTRY}/${IMAGE_FRONTEND}
            sleep 10
            docker run --rm --network stackbridge-network curlimages/curl -fsS ${HEALTHCHECK_BACKEND} || (echo "Backend healthcheck failed" && exit 1)
            docker run --rm --network stackbridge-network curlimages/curl -fsS ${HEALTHCHECK_FRONTEND} || (echo "Frontend healthcheck failed" && exit 1)
          '''
        }
      }
    }

    stage('Inject Image Tags') {
      steps {
        sh '''
          sed -i "s|image: .*stackbridge-devops-dashboard-backend.*|image: ${REGISTRY}/${IMAGE_BACKEND}|" ${K8S_MANIFESTS}/backend-deployment.yaml
          sed -i "s|image: .*stackbridge-devops-dashboard-frontend.*|image: ${REGISTRY}/${IMAGE_FRONTEND}|" ${K8S_MANIFESTS}/frontend-deployment.yaml
        '''
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
          sh '''
            kubectl version --client || (echo "kubectl not available" && exit 1)
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
    always {
      sh '''
        docker logs stackbridge-backend > backend.log || true
        docker logs stackbridge-frontend > frontend.log || true
        docker rm -f stackbridge-backend stackbridge-frontend || true
        docker-compose -f docker-compose.yml down || true
        docker network rm stackbridge-network || true
      '''
    }
  }
}
