import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { PublicSubnet, Subnet, Vpc } from '@aws-cdk/aws-ec2';
import { fsync } from 'fs';
// FileSystem access
import * as fs from 'fs';

export class CdkEc2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // vpc: Vpc;
    // The code that defines your stack goes here
  
    // Create a full new vpc
    const vpc = new ec2.Vpc(this, 'EC2Demo-CDKVPC', {
      enableDnsHostnames: true,
      enableDnsSupport: true,
      cidr: "10.0.0.0/16",
      maxAzs: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'EC2Demo-PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
        }
      ]
    });
    // create security group and open 80/22 ports
    const mysg = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      securityGroupName: "EC2Demo--cdktest-sg",
      description: 'Allow 80/22 from the world',
      allowAllOutbound: true
    });
    mysg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow remote ssh to port 22');
    mysg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'allow web access from the world');

    // define which AMI to use in new ec2 instance
    const awsAMI = new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2});
   
    // user data
    //const myuserdata = // method A
    //'#!/bin/bash';
    
    var bootscript:string = fs.readFileSync('assets/ec2_userdata.sh', 'utf8'); //method B
    
    // instance details
    const myec2instance = new ec2.Instance(this, 'Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: awsAMI,
      securityGroup: mysg,
    });
    myec2instance.addUserData(bootscript);

    // cloudformation outputs:
    new cdk.CfnOutput(this, 'Web Address', {value: "http://" + myec2instance.instancePublicIp})
  }
}
