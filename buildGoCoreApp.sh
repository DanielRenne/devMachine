cwd=$(pwd)
sudo rm -rf $GOPATH/src/github.com/DanielRenne/GoCore
sudo rm -rf $GOPATH/src/github.com/DanielRenne/addTranslation
sudo rm -rf $GOPATH/src/github.com/DanielRenne/updateTranslation

mkdir -p $GOPATH/src/github.com/DanielRenne/GoCore

git clone https://github.com/DanielRenne/GoCore $GOPATH/src/github.com/DanielRenne/GoCore
go install github.com/DanielRenne/GoCore/getCore
getCore

#Add Translation Tools
go get github.com/DanielRenne/addTranslation 
go get github.com/DanielRenne/updateTranslation 

./buildGoCoreApp_NoFetch.sh $1
