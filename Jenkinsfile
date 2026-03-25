pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/JigmeZ/SS2025_DSO101_02240344.git',
                    credentialsId: 'github-creds'
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    junit 'junit.xml'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-creds') {
                        // Build and push backend image
                        def backendImage = docker.build('jigmeoli/be-todo:02240344', 'Backend')
                        backendImage.push()

                        // Build and push frontend image
                        def frontendImage = docker.build('jigmeoli/fe-todo:02240344', 'Frontend')
                        frontendImage.push()
                    }
                }
            }
        }
    }
}