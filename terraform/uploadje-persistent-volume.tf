resource "kubernetes_persistent_volume" "uploadje-api" {
  metadata {
    name = "uploadje-api-volume"
  }
  spec {
    capacity = {
      storage = "10Gi"
    }
    access_modes       = ["ReadWriteMany"]
    storage_class_name = "gp3"
    persistent_volume_source {
      vsphere_volume {
        volume_path = "/mnt/data"
      }
    }
  }
}