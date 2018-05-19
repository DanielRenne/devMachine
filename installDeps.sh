sudo apt-get install -y curl

#Add yarn to Ubuntu Source List
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update
sudo apt-get install -y net-tools


sudo apt remove cmdtest
sudo apt-get install -y yarn

#Node JS and NPM
curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install -y nodejs
sudo apt-get install -y npm


#MongoDB
sudo mkdir -p /data/db
sudo dpkg --configure -a

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

sudo apt-get update
sudo apt-get install -y mongodb-org

#GO
wget https://storage.googleapis.com/golang/go1.10.1.linux-amd64.tar.gz
tar -xvf go1.10.1.linux-amd64.tar.gz
sudo mv go /usr/local