output "ec2_public_ip" {
  value = aws_instance.generic_ec2.public_ip
}

output "s3_bucket_name" {
  value = aws_s3_bucket.artifact_bucket.id
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.state_lock_table.name
}
