import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as elb from '@aws-cdk/aws-elasticloadbalancingv2';
import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as elbtarget from '@aws-cdk/aws-elasticloadbalancingv2-targets';
import * as fs from 'fs'; // Filesystem access
import { SecurityGroup } from '@aws-cdk/aws-ec2';

export class AutoscalingStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // iam
    const myinstancerole = new iam.Role(this, 'Demoprefix-instancerole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    });

    myinstancerole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2RoleforSSM')); // SSM permission

    // vpc
    const myvpc = new ec2.Vpc(this, 'Demoprefix-vpc');

    // security group
    const mywebsg = new ec2.SecurityGroup(this, 'Demoprefix-websg', {
      vpc: myvpc,
      allowAllOutbound: true,
      description: "Demoprefix- web server security group"
    });

    mywebsg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'all web access from the world');

    // autoscaling group configuration
    const myasg = new autoscaling.AutoScalingGroup(this, 'Demoprefix-ASG', {
      vpc: myvpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      maxCapacity: 6,
      minCapacity: 1,
      desiredCapacity: 3,
      role: myinstancerole
    });

    // add user data
    var myuserdata:string = fs.readFileSync('assets/asg-userdata', 'utf8');

    myasg.addUserData(myuserdata);

    // add security group to autoscaling group
    myasg.addSecurityGroup(mywebsg);

    // setup elb
    const myelb = new elb.ApplicationLoadBalancer(this, 'Demoprefix-elb', {
      vpc: myvpc,
      internetFacing: true
    });

    const mylistener = myelb.addListener('Demoprefix-listener', {
      port: 80,
      open: true
    });

   mylistener.addTargets('Demoprefix--web-target', {
     port: 80,
     protocol: elb.ApplicationProtocol.HTTP,
     targets: [myasg]
   });

   // cloudformation outputs
   new cdk.CfnOutput(this, 'elb address', {value: myelb.loadBalancerDnsName});

    

  }
}
