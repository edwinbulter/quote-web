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
        stage('Stop service') {
            steps {
                echo 'Stop quote-web systemd service'
                sh 'sudo systemctl stop quote-web'
           }
        }
        stage('Deploy') {
            steps {
                sh 'rm -rf /opt/quote-web/build'
                sh 'cp -r build /opt/quote-web/'
            }
        }
        stage('Start service') {
            steps {
                echo 'Start quote-web systemd service'
                sh 'sudo systemctl start quote-web'
           }
        }
    }
}