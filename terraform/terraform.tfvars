vpc_cidr = "10.0.0.0/16"

public_subnet_cidrs = [
  "10.0.1.0/24",
  "10.0.2.0/24"
]

private_subnet_cidrs = [
  "10.0.3.0/24",
  "10.0.4.0/24"
]

azs = [
  "ap-south-1a",
  "ap-south-1b"
]

enable_nat_gateway = true

tags = {
  Project     = "StackBridge"
  Environment = "Production"
  Owner       = "Ganesh"
}

ami_id              = "ami-0360c520857e3138f" 
instance_type       = "t2.micro"
key_name            = "stacbridge"        
s3_bucket_name      = "stackbridge-storage"
dynamodb_table_name = "stackbridge-locks"
