#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AutoscalingStack } from '../lib/autoscaling-stack';

const app = new cdk.App();
new AutoscalingStack(app, 'AutoscalingStack');
