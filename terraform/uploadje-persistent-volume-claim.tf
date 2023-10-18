resource "kubernetes_persistent_volume_claim" "uploadje-api" {
  metadata {
    name = "uploadje-api-volume-claim"
  }
  spec {
    access_modes       = ["ReadWriteMany"]
    storage_class_name = "gp3"
    resources {
      requests = {
        storage = "5Gi"
      }
    }
    volume_name = kubernetes_persistent_volume.uploadje-api.metadata.0.name
  }
}
