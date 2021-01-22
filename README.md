# PoC Deliverables

This repository contains a collection of PoC hands on deliverables.

## Base

### A) Nested stacks -- Cloudformation/YAML
Use parent-template.yaml and child-template.yaml to show how to build nested stacks. You can upload parent-template.yaml to cloudformation as main stack by aws console and it will invoke child-template.yaml stored in aws s3 already. Please change child-template.yaml s3 link accordingly in parent-template.yaml if you store child-template.yaml to your own environment.

## Handover
### A) Single EC2 full stack -- AWS CDK/Typescript
Use AWS CDK to create a standalone EC2 environment including VPC,SecurityGroup,Instance and Userdata, please install all dependant npm libraries first or only download three files into your own cdk project folder:

    cdk-ec2/lib/cdk-ec2-stack.ts    // main stack file

    cdk-ec2/bin/cdk-ec2.ts          // stack initial entry and env file

    cdk-ec2/assets/ec2_userdata.sh  // ec2 userdata

### B) AWS Autoscaling PoC -- Cloudformation/JSON
Enable ops's team to automate application infrastructre environment setup process, thus reduce the time and manual error cost.
1. Use VPC.json to build a new VPC that includes two public sunets, which bi-directly access to internet through aws internet gateway, two private subnets, which access to inernet through aws natgateway only and security group etc. 
2. Use EC2.json as main stack to create a full autoscaling environment including：
    - Autoscaling group
    - EC2 instance
    - Elastic loadbalancer
    - Launch config
3. Setup a simple web server on instance with a customized index.html to show instanceid and located AZ.
   
You may use web load test tool such as webbench to simulate 10000 users' access and trigger scaleup policy to start more instances, then find out different instanceid and AZ through ELB URL address

### C) Reimplement AutoScaling PoC -- AWS CDK/Typescript
The development team's requirement is to integrate the whole infrastructre environment setup process into application code base, PoC B cloudformation based procedure is not enough. 

    cdk-autoscaling/lib/autoscaling-stack.ts // main stack file

    cdk-autoscaling/assets/asg-userdata      // userdata for new instances
