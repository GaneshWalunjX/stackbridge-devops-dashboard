provider "aws" {
  region = "ap-south-1"
}

module "network" {
  source = "./modules/network"
}

module "core_infra" {
  source              = "./modules/core_infra"
  ami_id              = var.ami_id
  instance_type       = var.instance_type
  subnet_id           = module.network.public_subnets[0]
  vpc_id              = module.network.vpc_id
  key_name            = var.key_name
  s3_bucket_name      = var.s3_bucket_name
  dynamodb_table_name = var.dynamodb_table_name
  tags                = var.tags
}
