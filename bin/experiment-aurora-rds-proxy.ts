#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ExperimentAuroraRdsProxyStack, NetworkStack } from '../lib/experiment-aurora-rds-proxy-stack';

const app = new cdk.App();
const env: cdk.Environment = { 
  account: app.node.getContext('account'), 
  region: app.node.tryGetContext('region') ?? 'us-west-2'
};


const network = new NetworkStack(app, 'NetworkStack', { env });
new ExperimentAuroraRdsProxyStack(app, 'ExperimentAuroraRdsProxyStack', {
  env,
  vpc: network.vpc,
});

