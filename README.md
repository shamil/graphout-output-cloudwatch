### About

This library is a **Graphout** module. It's not intended to be used alone.

The module adds support for outputing **Graphout** queries to Cloudwatch.
Where later can be used to generate Cloudwatch alerts for Auto-Scaling use.

### Configuration params

to use this module, make sure to configure it in **Graphout** config.
here are the available params:

```json
{
    "output": "graphout-output-zabbix",
    "params":
    {
        "accessKeyId": "",
        "secretAccessKey": "",
        "region": "us-east-1",
        "namespace": "Graphout",
        "dot_notation": true
    }
}
```

**`output`**

Set this to `graphout-output-cloudwatch`

**`params.accessKeyId`**

AWS access key, **required**.
Set to `""` (empty string) if Graphout runs from EC2 instance with IAM role

**`params.secretAccessKey`**

AWS secret access key, **required**.
Set to `""` (empty string) if Graphout runs from EC2 instance with IAM role

**`params.region`**

AWS region, the only **required** parameter.

**`params.namespace`**

CloudWatch global namespace, **default** is `Graphout`

**`params.dot_notation`**

When enabled, the namespace will be gerenated based on Graphout query key name (in addition to the global namespace),
which is splitted by dots. The string after the last dot will be used as a metric name.
If disabled, entire query key name will be used as the metric name. **Default** is `true`.
