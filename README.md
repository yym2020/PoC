# PoC Deliverables

This repository contains a collection of PoC demo and workshop hands on deliverables

## Demo

### A) Nested stacks
Use parent-template.yaml and child-template.yaml to show how to build nested stacks. You can upload parent-template.yaml to cloudformation as main stack by aws console and it will invoke child-template.yaml stored in aws s3 already. Please change child-template.yaml s3 link accordingly in parent-template.yaml if you store child-template.yaml to your own environment.
## PoC

### A) AWS Autoscaling PoC
1. Use VPC.json to build a new VPC that includes two public sunets, which bi-directly access to internet through aws internet gateway, two private subnets, which access to inernet through aws natgateway only and security group etc. 
2. Use EC2.json as main stack to create a full autoscaling environment including：
    - Autoscaling group
    - EC2 instance
    - Elastic loadbalancer
    - Launch config
3. Setup a simple web server on instance with a customized index.html to show instanceid and located AZ.
   
You may use web load test tool such as webbench to simulate 10000 users' access and trigger scaleup policy to start more instances, then find out different instanceid and AZ through ELB URL address