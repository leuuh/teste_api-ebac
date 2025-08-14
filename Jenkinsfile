pipeline {
    agent any

    stages {
        stage('Clonar o repositório') {
            steps {
                git branch: 'main', url: 'https://github.com/leuuh/teste_api-ebac.git'
            }
        }

        stage('Instalar dependências') {
            steps {
                bat 'npm install'
            }
        }

        stage('Executar Testes') {
            steps {
                bat 'start /B npm start'
                bat 'timeout /t 5 /nobreak'
                bat 'set NO_COLOR=1 && npm run cy:run'
            }
        }
    }
}