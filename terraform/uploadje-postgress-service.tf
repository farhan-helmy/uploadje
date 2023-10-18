resource "kubernetes_service" "uploadje-postgres" {
  metadata {
    name      = "uploadje-postgres"
    namespace = kubernetes_namespace.uploadje-api.metadata.0.name
  }
  spec {
    selector = {
      app = kubernetes_deployment.uploadje-api.spec.0.template.0.metadata.0.labels.app
    }
    type = "NodePort"
    port {
      port = 5432
    }
  }
}
