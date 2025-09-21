pipeline {
  agent any

  environment {
    REGISTRY = "docker.io/ganesha7"
    IMAGE_BACKEND = "stackbridge-devops-dashboard-backend:${BUILD_NUMBER}"
    IMAGE_FRONTEND = "stackbridge-devops-dashboard-frontend:${BUILD_NUMBER}"
    HEALTHCHECK_BACKEND = "http://localhost:5000/ping"
    HEALTHCHECK_FRONTEND = "http://localhost:3000"
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
        withCredentials([usernamePassword(credentialsId: 'stackbridge-dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
        }
      }
    }

    stage('Build and Push Images') {
      steps {
        sh """
          docker build --pull --no-cache -t $REGISTRY/$IMAGE_BACKEND ./backend
          docker push $REGISTRY/$IMAGE_BACKEND

          docker build --pull --no-cache -t $REGISTRY/$IMAGE_FRONTEND ./frontend
          docker push $REGISTRY/$IMAGE_FRONTEND
        """
      }
    }

    stage('Healthcheck') {
      steps {
        sh """
	  docker-compose up -d db
	  sleep 10

          docker run -d --name backend -p 5000:5000 $REGISTRY/$IMAGE_BACKEND
          docker run -d --name frontend -p 3000:3000 $REGISTRY/$IMAGE_FRONTEND

          echo "Checking backend health..."
          curl -f $HEALTHCHECK_BACKEND || (echo "Backend failed healthcheck" && exit 1)

          echo "Checking frontend health..."
          curl -f $HEALTHCHECK_FRONTEND || (echo "Frontend failed healthcheck" && exit 1)
        """
      }
    }
  }

  post {
    success {
      echo 'CI/CD pipeline completed successfully!'
    }
    failure {
      echo 'Pipeline failed. Check logs and container status.'
    }
    cleanup {
      sh """
        docker logs backend > backend.log || true
        docker logs frontend > frontend.log || true
        docker rm -f backend frontend || true
      """
    }
  }
}
