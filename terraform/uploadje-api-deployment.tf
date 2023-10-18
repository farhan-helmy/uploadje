resource "kubernetes_deployment" "uploadje-api" {
  metadata {
    name      = "uploadje-api"
    namespace = kubernetes_namespace.uploadje-api.metadata.0.name
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "uploadje-api"
      }
    }
    template {
      metadata {
        labels = {
          app = "uploadje-api"
        }
      }
      spec {
        container {
          image = "773124449165.dkr.ecr.ap-southeast-1.amazonaws.com/uploadjeapi:0.1.2"
          name  = "uploadje-api"
          env {
            name = "PORT"
            value_from {
              secret_key_ref {
                name = "uploadje-api-secret"
                key  = "port"
              }
            }
          }
          env {
            name = "DB_URL"
            value_from {
              secret_key_ref {
                name = "uploadje-api-secret"
                key  = "my-database-url"
              }
            }
          }
          env {
            name = "JWT_SECRET"
            value_from {
              secret_key_ref {
                name = "uploadje-api-secret"
                key  = "jwt-secret"
              }
            }
          }
          env {
            name = "AWS_ACCESS_KEY_ID"
            value_from {
              secret_key_ref {
                name = "uploadje-api-secret"
                key  = "aws-access-key-id"
              }
            }
          }
          env {
            name = "AWS_SECRET_ACCESS_KEY"
            value_from {
              secret_key_ref {
                name = "uploadje-api-secret"
                key  = "aws-secret-access-key"
              }
            }
          }
          port {
            container_port = 3000
          }
        }
      }
    }
  }
}
