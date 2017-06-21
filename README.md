TrueSight Pulse Kubernetes Integration Plugin
-------------------------

Collects metrics from Kubernetes instance.

### Prerequisites

|     OS    | Linux | Windows | OS X |
|:----------|:-----:|:-------:|:----:|
| Supported |   v   |    -    |  -   |


|  Runtime | node.js | Python | Java |
|:---------|:-------:|:------:|:----:|
| Required |    +    |        |      |

- [How to install node.js?](https://help.truesight.bmc.com/hc/en-us/articles/202360701)

### Plugin Setup
None

#### Plugin Configuration Fields

Litespeed writes server statistics to multiple report files in the /tmp/lshttpd folder by default, check your configuration to ensure that the path is correct.  The number of reports are based on the number of CPUs on your server and the number of CPUs that you have licences for.

|Field Name     |Description                                                    |
|:--------------|:--------------------------------------------------------------|
|Poll Interval  |How often (in miliseconds) to poll for collecting the metrics  |
|Base URL       |Basic URL to collect metrics from Hipster of Kubernetes        |

### Metrics Collected

Tracks the following metrics for the [kubernetes](https://kubernetes.io/) instance.

|Metric Name                        |Description                                             |
|:----------------------------------|:-------------------------------------------------------|
|Kubernetes Node CPU Utilization    |CPU utilization percentage for Kubernetes node          |
|Kubernetes Pod CPU Utilization     |CPU utilization in absolute units for Kubernetes pod    |
|Kubernetes Node Memory Utilization |Memory utilization percentage for Kubernetes node       |
|Kubernetes Pod Memory Utilization  |Memory utilization in absolute units for Kubernetes pod |
