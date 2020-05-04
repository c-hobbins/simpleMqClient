
# Using a "slim" base image ends up being about 100MB smaller than the regular ubuntu 
#FROM ubuntu:16.04
FROM debian:jessie-slim

# Set some parameters.
ENV NODE_APP_USER  app
ENV NODE_MQM_USER  mqm
ENV NODE_GROUP mqclient
ENV APP_DIR    /usr/local/nodejs/mqput

# This is a queue predefined in the MQ Developer Edition server container
#ENV DOCKER_Q    DEV.QUEUE.1
#ENV DOCKER_QMGR QM1

WORKDIR ${APP_DIR}

# Create the application directory so we can put stuff in there immediately
RUN mkdir -p ${APP_DIR}

# Copy project files into the container. In this source directory, the
# package file has been given a different name, to avoid any attempt to
# reference it with the rest of the samples. But it gets renamed to the
# correct name during this copy.
COPY samples ${APP_DIR}/samples
COPY package.json ${APP_DIR}/package.json
COPY irccTestMqPut.sh ${APP_DIR}/
COPY sendMsg.js ${APP_DIR}/

# Update the base image and make sure we've installed basic capabilities
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl gcc g++ make git ca-certificates apt-utils apt-file \
    && apt-file update \
    && apt-get install -y vim \
    && curl --silent -k --location https://deb.nodesource.com/setup_12.x | bash - \
    && apt-get install -y  nodejs  \
    && npm install -g npm \
# Define the userid and set up the location for the program
   && groupadd -r ${NODE_GROUP} \
   && useradd -r -m -g ${NODE_GROUP} ${NODE_APP_USER} \
   && useradd -r -m -g ${NODE_GROUP} ${NODE_MQM_USER} \
# Now get all the prereq packages installed and cleanup the
# pieces that are not needed after building the C interface pieces.
   && npm install \
   && apt-get autoremove -y curl make gcc g++ python git \
   && apt-get purge -y \
   && rm -rf /var/lib/apt/lists/* \
   && chmod a+rw ${APP_DIR}/* \
   && chmod a+rwx ${APP_DIR}/irccTestMqPut.sh \
   && chmod a+rwx ${APP_DIR}/sendMsg.js \
   && chmod a+rwx ${APP_DIR}/samples/*

USER ${NODE_APP_USER}
# Now ready to run the amqsput program.
#CMD node amqsput ${DOCKER_Q} ${DOCKER_QMGR}
ENTRYPOINT ["/sbin/init"]