resource "kubernetes_secret" "uploadje-api" {
  metadata {
    name      = "uploadje-api-secret"
    namespace = kubernetes_namespace.uploadje-api.metadata.0.name
  }

  data = {
    port                  = "3000"
    my-database-url       = "postgresql://postgres:mysecretpassword@localhost:5432/uploadjedev"
    password              = "eG0zoGdYZXML"
    jwt-secret            = "2hqUcInAHvjY/qE4"
    aws-access-key-id     = "AKIA3IAOO4OGYF45ESN4"
    aws-secret-access-key = "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"
  }
}


