###
 # @Author: xkloveme
 # @Date: 2022-03-07 14:36:49
 # @LastEditTime: 2022-11-23 10:06:08
 # @LastEditors: xkloveme
 # @Description: 检测项目能否运行
 # @FilePath: /js-web/run.sh
 # @Copyright © xkloveme
###

#!/bin/bash
ENVIRONMENT='js-web'

docker build . -t ${ENVIRONMENT}
docker run --rm -it  -p 9527:3000/tcp ${ENVIRONMENT}:latest
# 运行脚本
# 内部端口为3000
# 运行之后端口外界为9527
# sh run.sh
# 打开链接
# http://localhost:9527/#/