resource "kubernetes_service" "uploadje-api" {
  metadata {
    name      = "uploadje-api"
    namespace = kubernetes_namespace.uploadje-api.metadata.0.name
  }
  spec {
    selector = {
      app = kubernetes_deployment.uploadje-api.spec.0.template.0.metadata.0.labels.app
    }
    type = "LoadBalancer"
    port {
      port        = 80
      target_port = 3000
    }
  }
}

# Create a local variable for the load balancer name.
locals {
  lb_name = split("-", split(".", kubernetes_service.uploadje-api.status.0.load_balancer.0.ingress.0.hostname).0).0
}

# Read information about the load balancer using the AWS provider.
data "aws_elb" "uploadje-api" {
  name = local.lb_name
}
