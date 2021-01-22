yum update -y 
yum install -y httpd 
service httpd start 
chkconfig httpd on 
INSTANCE_ID="`wget -q -O - http://instance-data/latest/meta-data/instance-id`" &&  \
AZ_ID="`wget -q -O - http://instance-data/latest/meta-data/placement/availability-zone`" &&  \
echo "<h1>Welcome to your application $INSTANCE_ID in $AZ_ID</h1>" > /var/www/html/index.html && \
chmod 644 /var/www/html/index.html && \
chown root:root /var/www/html/index.html 
