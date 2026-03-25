pipeline {
    agent any

    tools {
        nodejs 'NodeJs'
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
                dir('Backend') {
                    script {
                        if (isUnix()) {
                            sh 'npm ci || npm install'
                        } else {
                            bat 'npm ci || npm install'
                        }
                    }
                }
                dir('Frontend') {
                    script {
                        if (isUnix()) {
                            sh 'npm ci || npm install'
                        } else {
                            bat 'npm ci || npm install'
                        }
                    }
                }
            }
        }

        stage('Build') {
            steps {
                dir('Frontend') {
                    script {
                        if (isUnix()) {
                            sh 'npm run build'
                        } else {
                            bat 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Test') {
            steps {
                dir('Frontend') {
                    script {
                        if (isUnix()) {
                            sh 'CI=true npm test -- --watchAll=false'
                        } else {
                            bat 'set CI=true&& npm test -- --watchAll=false'
                        }
                    }
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