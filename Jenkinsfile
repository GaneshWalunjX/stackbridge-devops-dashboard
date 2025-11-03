pipeline {
  agent any

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
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build and Push Images') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker build -t ${REGISTRY}/${IMAGE_BACKEND} backend
            docker push ${REGISTRY}/${IMAGE_BACKEND}
            docker build -t ${REGISTRY}/${IMAGE_FRONTEND} frontend
            docker push ${REGISTRY}/${IMAGE_FRONTEND}
          '''
        }
      }
    }

    stage('Inject Image Tags') {
      steps {
        sh '''
          sed -i "s|stackbridge-backend:.*|stackbridge-backend:${BUILD_NUMBER}|" ${K8S_MANIFESTS}/backend-deployment.yaml
          sed -i "s|stackbridge-frontend:.*|stackbridge-frontend:${BUILD_NUMBER}|" ${K8S_MANIFESTS}/frontend-deployment.yaml
        '''
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        withCredentials([file(credentialsId: 'kubeconfig-stackbridge', variable: 'KUBECONFIG')]) {
          sh '''
            ls -l "$KUBECONFIG"
            kubectl version --client
            kubectl get nodes
            kubectl apply -f "${K8S_MANIFESTS}"
          '''
        }
      }
    }
  }

  post {
    success {
      echo 'Pipeline completed successfully.'
    }
    failure {
      echo 'Pipeline failed.'
    }
  }
}
