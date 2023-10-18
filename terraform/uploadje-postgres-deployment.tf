resource "kubernetes_deployment" "uploadje-postgres" {
  metadata {
    name      = "uploadje-postgres"
    namespace = kubernetes_namespace.uploadje-api.metadata.0.name
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "uploadje-postgres"
      }
    }
    template {
      metadata {
        labels = {
          app = "uploadje-postgres"
        }
      }
      spec {
        container {
          image = "postgres:11"
          name  = "uploadje-postgres"
          port {
            container_port = 5432
          }
          env {
            name = "POSTGRES_PASSWORD"
            value_from {
              secret_key_ref {
                name = "uploadje-api-secret"
                key  = "password"
              }
            }
          }
          env {
            name  = "PGDATA"
            value = "/var/lib/postgresql/data/pgdata"
          }
          volume_mount {
            name       = "uploadje-api-volume"
            mount_path = "/var/lib/postgresql/data"
          }
        }
        volume {
          name = "uploadje-api-volume"
        }

      }
    }
  }
}
