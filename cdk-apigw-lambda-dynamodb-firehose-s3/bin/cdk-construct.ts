#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkConstructStack } from '../lib/cdk-construct-stack';

const demoapp = new cdk.App();
new CdkConstructStack(demoapp, 'CdkConstructStack');
