pipeline {
    agent any

    stages {
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
        stage('Deploy') {
            steps {
                sh 'rm -rf /opt/quote-web/build'
                sh 'cp -r build /opt/quote-web/'
            }
        }
    }
}