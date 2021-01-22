"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoscalingStack = void 0;
const cdk = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const elb = require("@aws-cdk/aws-elasticloadbalancingv2");
const autoscaling = require("@aws-cdk/aws-autoscaling");
class AutoscalingStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        // iam
        const myinstancerole = new iam.Role(this, 'yyminstancerole', {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
        });
        myinstancerole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2RoleforSSM')); // SSM permission
        // vpc
        const myvpc = new ec2.Vpc(this, 'yymvpc');
        // security group
        const mywebsg = new ec2.SecurityGroup(this, 'yymwebsg', {
            vpc: myvpc,
            allowAllOutbound: true,
            description: "yym web server security group"
        });
        mywebsg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'all web access from the world');
        // autoscaling group configuration
        const myasg = new autoscaling.AutoScalingGroup(this, 'yymASG', {
            vpc: myvpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            maxCapacity: 6,
            minCapacity: 1,
            desiredCapacity: 3,
            role: myinstancerole
        });
        // add user data
        var myuserdata = '#!/bin/bash;;
        yum;
        update - y;
        yum;
        install - y;
        httpd;
        service;
        httpd;
        start;
        chkconfig;
        httpd;
        on;
        INSTANCE_ID = "`wget -q -O - http://instance-data/latest/meta-data/instance-id`" && ;
        ;
        AZ_ID = "`wget -q -O - http://instance-data/latest/meta-data/placement/availability-zone`" && ;
        ;
        echo;
        "<h1>Welcome to your application $INSTANCE_ID in $AZ_ID</h1>" > /var/www / html / index.html && ;
        ;
        chmod;
        644 / ;
        var ;
        /www/html / index.html && ;
        ;
        chown;
        root: root / ;
        var ;
        /www/html / index.html;
        ';;
        myasg.addUserData(myuserdata);
        // add security group to autoscaling group
        myasg.addSecurityGroup(mywebsg);
        // setup elb
        const myelb = new elb.ApplicationLoadBalancer(this, 'yymelb', {
            vpc: myvpc,
            internetFacing: true
        });
        const mylistener = myelb.addListener('yymlistener', {
            port: 80,
            open: true
        });
        mylistener.addTargets('yym-web-target', {
            port: 80,
            protocol: elb.ApplicationProtocol.HTTP,
            targets: [myasg]
        });
        // cloudformation outputs
        new cdk.CfnOutput(this, 'elb address', { value: myelb.loadBalancerDnsName });
    }
}
exports.AutoscalingStack = AutoscalingStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b3NjYWxpbmctc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhdXRvc2NhbGluZy1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFDckMsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4QywyREFBMkQ7QUFDM0Qsd0RBQXdEO0FBS3hELE1BQWEsZ0JBQWlCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDN0MsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4Qiw2Q0FBNkM7UUFFN0MsTUFBTTtRQUNOLE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDM0QsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDO1NBQ3pELENBQUMsQ0FBQztRQUVILGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLGtDQUFrQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtRQUVsSSxNQUFNO1FBQ04sTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUUxQyxpQkFBaUI7UUFDakIsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDdEQsR0FBRyxFQUFFLEtBQUs7WUFDVixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLFdBQVcsRUFBRSwrQkFBK0I7U0FDN0MsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLCtCQUErQixDQUFDLENBQUM7UUFFOUYsa0NBQWtDO1FBQ2xDLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDN0QsR0FBRyxFQUFFLEtBQUs7WUFDVixZQUFZLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFDdkYsWUFBWSxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixFQUFFO1lBQ3hDLFdBQVcsRUFBRSxDQUFDO1lBQ2QsV0FBVyxFQUFFLENBQUM7WUFDZCxlQUFlLEVBQUUsQ0FBQztZQUNsQixJQUFJLEVBQUUsY0FBYztTQUNyQixDQUFDLENBQUM7UUFFSCxnQkFBZ0I7UUFDaEIsSUFBSSxVQUFVLEdBQ1YsYUFBYSxDQUFBO1FBQ2IsR0FBRyxDQUFBO1FBQUMsTUFBTSxHQUFFLENBQUMsQ0FBQztRQUNkLEdBQUcsQ0FBQTtRQUFDLE9BQU8sR0FBRSxDQUFDLENBQUE7UUFBQyxLQUFLLENBQUM7UUFDckIsT0FBTyxDQUFBO1FBQUMsS0FBSyxDQUFBO1FBQUMsS0FBSyxDQUFDO1FBQ3BCLFNBQVMsQ0FBQTtRQUFDLEtBQUssQ0FBQTtRQUFDLEVBQUUsQ0FBQztRQUNuQixXQUFXLEdBQUMsa0VBQWtFLElBQUssQUFBRixDQUFBO1FBQUcsQ0FBQztRQUNyRixLQUFLLEdBQUMsa0ZBQWtGLElBQUssQUFBRixDQUFBO1FBQUcsQ0FBQztRQUMvRixJQUFJLENBQUE7UUFBQyw2REFBNkQsR0FBRyxRQUFRLEdBQUMsSUFBSSxHQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQUFBRCxDQUFBO1FBQUUsQ0FBQztRQUNuRyxLQUFLLENBQUE7UUFBQyxHQUFHLEdBQUUsQ0FBQTtRQUFBLElBQUcsQ0FBQTtRQUFBLFNBQVMsR0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEFBQUQsQ0FBQTtRQUFFLENBQUM7UUFDeEMsS0FBSyxDQUFBO1FBQUMsSUFBSSxFQUFDLElBQUksR0FBRSxDQUFBO1FBQUEsSUFBRyxDQUFBO1FBQUEsU0FBUyxHQUFDLEtBQUssQ0FBQyxJQUFJLENBQUE7UUFBQSxFQUFFLENBQUE7UUFFOUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUU5QiwwQ0FBMEM7UUFDMUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWhDLFlBQVk7UUFDWixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQzVELEdBQUcsRUFBRSxLQUFLO1lBQ1YsY0FBYyxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUU7WUFDbEQsSUFBSSxFQUFFLEVBQUU7WUFDUixJQUFJLEVBQUUsSUFBSTtTQUNYLENBQUMsQ0FBQztRQUVKLFVBQVUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUU7WUFDdEMsSUFBSSxFQUFFLEVBQUU7WUFDUixRQUFRLEVBQUUsR0FBRyxDQUFDLG1CQUFtQixDQUFDLElBQUk7WUFDdEMsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDO1NBQ2pCLENBQUMsQ0FBQztRQUVILHlCQUF5QjtRQUN6QixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsbUJBQW1CLEVBQUMsQ0FBQyxDQUFDO0lBSTVFLENBQUM7Q0FDRjtBQTdFRCw0Q0E2RUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBlbGIgZnJvbSAnQGF3cy1jZGsvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInO1xuaW1wb3J0ICogYXMgYXV0b3NjYWxpbmcgZnJvbSAnQGF3cy1jZGsvYXdzLWF1dG9zY2FsaW5nJztcbmltcG9ydCAqIGFzIGVsYnRhcmdldCBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mi10YXJnZXRzJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJzsgLy8gRmlsZXN5c3RlbSBhY2Nlc3NcbmltcG9ydCB7IFNlY3VyaXR5R3JvdXAgfSBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcblxuZXhwb3J0IGNsYXNzIEF1dG9zY2FsaW5nU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gVGhlIGNvZGUgdGhhdCBkZWZpbmVzIHlvdXIgc3RhY2sgZ29lcyBoZXJlXG5cbiAgICAvLyBpYW1cbiAgICBjb25zdCBteWluc3RhbmNlcm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAneXltaW5zdGFuY2Vyb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VjMi5hbWF6b25hd3MuY29tJylcbiAgICB9KTtcblxuICAgIG15aW5zdGFuY2Vyb2xlLmFkZE1hbmFnZWRQb2xpY3koaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdzZXJ2aWNlLXJvbGUvQW1hem9uRUMyUm9sZWZvclNTTScpKTsgLy8gU1NNIHBlcm1pc3Npb25cblxuICAgIC8vIHZwY1xuICAgIGNvbnN0IG15dnBjID0gbmV3IGVjMi5WcGModGhpcywgJ3l5bXZwYycpO1xuXG4gICAgLy8gc2VjdXJpdHkgZ3JvdXBcbiAgICBjb25zdCBteXdlYnNnID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHRoaXMsICd5eW13ZWJzZycsIHtcbiAgICAgIHZwYzogbXl2cGMsXG4gICAgICBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLFxuICAgICAgZGVzY3JpcHRpb246IFwieXltIHdlYiBzZXJ2ZXIgc2VjdXJpdHkgZ3JvdXBcIlxuICAgIH0pO1xuXG4gICAgbXl3ZWJzZy5hZGRJbmdyZXNzUnVsZShlYzIuUGVlci5hbnlJcHY0KCksIGVjMi5Qb3J0LnRjcCg4MCksICdhbGwgd2ViIGFjY2VzcyBmcm9tIHRoZSB3b3JsZCcpO1xuXG4gICAgLy8gYXV0b3NjYWxpbmcgZ3JvdXAgY29uZmlndXJhdGlvblxuICAgIGNvbnN0IG15YXNnID0gbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAodGhpcywgJ3l5bUFTRycsIHtcbiAgICAgIHZwYzogbXl2cGMsXG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuQlVSU1RBQkxFMywgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgbWF4Q2FwYWNpdHk6IDYsXG4gICAgICBtaW5DYXBhY2l0eTogMSxcbiAgICAgIGRlc2lyZWRDYXBhY2l0eTogMyxcbiAgICAgIHJvbGU6IG15aW5zdGFuY2Vyb2xlXG4gICAgfSk7XG5cbiAgICAvLyBhZGQgdXNlciBkYXRhXG4gICAgdmFyIG15dXNlcmRhdGE6c3RyaW5nID0gXG4gICAgICAgICcjIS9iaW4vYmFzaDtcbiAgICAgICAgeXVtIHVwZGF0ZSAteTtcbiAgICAgICAgeXVtIGluc3RhbGwgLXkgaHR0cGQ7XG4gICAgICAgIHNlcnZpY2UgaHR0cGQgc3RhcnQ7XG4gICAgICAgIGNoa2NvbmZpZyBodHRwZCBvbjsgXG4gICAgICAgIElOU1RBTkNFX0lEPVwiYHdnZXQgLXEgLU8gLSBodHRwOi8vaW5zdGFuY2UtZGF0YS9sYXRlc3QvbWV0YS1kYXRhL2luc3RhbmNlLWlkYFwiICYmICBcXDtcbiAgICAgICAgQVpfSUQ9XCJgd2dldCAtcSAtTyAtIGh0dHA6Ly9pbnN0YW5jZS1kYXRhL2xhdGVzdC9tZXRhLWRhdGEvcGxhY2VtZW50L2F2YWlsYWJpbGl0eS16b25lYFwiICYmICBcXDtcbiAgICAgICAgZWNobyBcIjxoMT5XZWxjb21lIHRvIHlvdXIgYXBwbGljYXRpb24gJElOU1RBTkNFX0lEIGluICRBWl9JRDwvaDE+XCIgPiAvdmFyL3d3dy9odG1sL2luZGV4Lmh0bWwgJiYgXFw7XG4gICAgICAgIGNobW9kIDY0NCAvdmFyL3d3dy9odG1sL2luZGV4Lmh0bWwgJiYgXFw7XG4gICAgICAgIGNob3duIHJvb3Q6cm9vdCAvdmFyL3d3dy9odG1sL2luZGV4Lmh0bWwnO1xuXG4gICAgbXlhc2cuYWRkVXNlckRhdGEobXl1c2VyZGF0YSk7XG5cbiAgICAvLyBhZGQgc2VjdXJpdHkgZ3JvdXAgdG8gYXV0b3NjYWxpbmcgZ3JvdXBcbiAgICBteWFzZy5hZGRTZWN1cml0eUdyb3VwKG15d2Vic2cpO1xuXG4gICAgLy8gc2V0dXAgZWxiXG4gICAgY29uc3QgbXllbGIgPSBuZXcgZWxiLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHRoaXMsICd5eW1lbGInLCB7XG4gICAgICB2cGM6IG15dnBjLFxuICAgICAgaW50ZXJuZXRGYWNpbmc6IHRydWVcbiAgICB9KTtcblxuICAgIGNvbnN0IG15bGlzdGVuZXIgPSBteWVsYi5hZGRMaXN0ZW5lcigneXltbGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA4MCxcbiAgICAgIG9wZW46IHRydWVcbiAgICB9KTtcblxuICAgbXlsaXN0ZW5lci5hZGRUYXJnZXRzKCd5eW0td2ViLXRhcmdldCcsIHtcbiAgICAgcG9ydDogODAsXG4gICAgIHByb3RvY29sOiBlbGIuQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQLFxuICAgICB0YXJnZXRzOiBbbXlhc2ddXG4gICB9KTtcblxuICAgLy8gY2xvdWRmb3JtYXRpb24gb3V0cHV0c1xuICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ2VsYiBhZGRyZXNzJywge3ZhbHVlOiBteWVsYi5sb2FkQmFsYW5jZXJEbnNOYW1lfSk7XG5cbiAgICBcblxuICB9XG59XG4iXX0=