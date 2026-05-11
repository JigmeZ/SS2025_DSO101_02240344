pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/JigmeZ/SS2025_DSO101_02240344.git',
                    credentialsId: 'github-creds'
            }
        }

        stage('Verify Node Environment') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'which node && node -v && npm -v'
                    } else {
                        bat 'where node'
                        bat 'node -v'
                        bat 'npm -v'
                    }
                }
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
                dir('Backend') {
                    script {
                        if (isUnix()) {
                            sh 'npm test'
                        } else {
                            bat 'npm test'
                        }
                    }
                }
                dir('Frontend') {
                    script {
                        if (isUnix()) {
                            sh 'npm test -- --watchAll=false --passWithNoTests'
                        } else {
                            bat 'npm test -- --watchAll=false --passWithNoTests'
                        }
                    }
                }
            }
            post {
                always {
                    junit '**/junit.xml'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo 'Building Docker images...'
                    if (isUnix()) {
                        sh 'docker-compose build'
                        sh 'docker-compose up -d'
                    } else {
                        bat 'docker-compose build'
                        bat 'docker-compose up -d'
                    }
                }
            }
        }
    }
}