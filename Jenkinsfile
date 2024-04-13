pipeline{
    environment{
        DATE=new Date().format('yy.M')
        TAG = "${DATE}.${BUILD_NUMBER}"
        ENV_FILE = ""
    }
    agent any
    stages{
        stage("Set Environment File"){
            steps{
                script {
                    // Set the environment file based on the branch
                    ENV_FILE = sh(returnStdout: true, script: 'if [ "$BRANCH_NAME" == "main" ]; then echo ".env.live"; else echo ".env.dev"; fi').trim()
                }
            }
        }
        stage("Build Docker Image"){
            steps{
                script{
                    // Copy the appropriate .env file into the context for Docker build
                    sh "cp ${ENV_FILE} .env"
                    // Build the Docker image with the appropriate .env file
                    docker.build("10.1.12.73:5000/react_container:${TAG}", "--build-arg config=${ENV_FILE} .")
                }
            }
        }
        stage("Push Docker Image to Local Registry"){
            steps{
                script{
                    docker.withRegistry("http://10.1.12.73:5000"){
                        docker.image("10.1.12.73:5000/react_container:${TAG}").push()
                        docker.image("10.1.12.73:5000/react_container:${TAG}").push("latest")
                    }
                }
            }
        }
        stage("Deliver for Development"){
            when{
                branch "develop"
            }
            steps{
                sshagent(['ebdev']) {
                    sh 'ssh -o StrictHostKeyChecking=no -l ebdevuat 10.1.22.72 "docker stop react_container | true; docker rm react_container | true; docker run -p 6005:80 -d --name react_container 10.1.12.73:5000/react_container:${TAG}"'
                }
            }
        }
        stage("Deploy for Production"){
            when{
                branch "main"
            }
            steps{
                sshagent(['enat-remedy-production']) {
                    sh 'ssh -o StrictHostKeyChecking=no -l administrator 10.1.12.70 "docker stop react_container | true; docker rm react_container | true; docker run -p 6005:80 -d --name react_container 10.1.12.73:5000/react_container:${TAG}"'
                }
            }
        }
    }
    post{
        always{
            cleanWs()
        }
        failure {
            sh """
            curl -X POST -H "Content-Type: application/json" -d '{"value1":"${JOB_NAME}","value2":"${BUILD_NUMBER}","value3":"Failed"}' https://maker.ifttt.com/trigger/Build_Notification/with/key/c9HE9K84X22YKOKsCiNivz
            """
        }
        success {
            sh """
            curl -X POST -H "Content-Type: application/json" -d '{"value1":"${JOB_NAME}","value2":"${BUILD_NUMBER}","value3":"Successful"}' https://maker.ifttt.com/trigger/Build_Notification/with/key/c9HE9K84X22YKOKsCiNivz
            """
        }
    }
}
