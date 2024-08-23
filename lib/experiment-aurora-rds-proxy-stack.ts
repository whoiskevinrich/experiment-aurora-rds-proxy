import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { FckNatInstanceProvider } from 'cdk-fck-nat';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class NetworkStack extends cdk.Stack {

  public vpc: ec2.IVpc;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const natGatewayProvider = new FckNatInstanceProvider({
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO),
    });

    const vpc = new ec2.Vpc(this, 'Vpc', {
      natGatewayProvider,
    });

    this.vpc = vpc;
  }
}

export interface ExperimentAuroraRdsProxyStackProps extends cdk.StackProps {
  readonly vpc: ec2.IVpc;
}

export class ExperimentAuroraRdsProxyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ExperimentAuroraRdsProxyStackProps) {
    super(scope, id, props);

    const cluster = new rds.DatabaseCluster(this, 'DbCluster', {
      engine: rds.DatabaseClusterEngine.auroraMysql({
        version: rds.AuroraMysqlEngineVersion.VER_3_05_2,
      }),
      writer: rds.ClusterInstance.serverlessV2('write-instance'),
      readers: [rds.ClusterInstance.serverlessV2('read-instance')],
      vpc: props.vpc,
    });
  };
}
