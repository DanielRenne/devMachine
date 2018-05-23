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

go build github.com/DanielRenne/addTranslation
go build github.com/DanielRenne/updateTranslation

mkdir -p $1

cp -r keys/ $1/keys
cp webConfig.json $1
cp main.go $1

cd $1

cp $GOPATH/bin/addTranslation addTranslation
cp $GOPATH/bin/updateTranslation updateTranslation

echo -e '{
    "key":"YourAPIKey",
    "path":"web/pages",
    "languages":[
        "es"
    ]
}' > yandex.json

directoryName=${PWD##*/} 

mkdir -p $1/bin
mkdir -p $1/db/schemas/1.0.0
mkdir -p $1/db/goFiles
mkdir -p $1/db/bootstrap

cd $cwd

./buildApp.sh $1

cd $1

# if which xdg-open > /dev/null
# then
#   xdg-open "localhost:8080"
# elif which gnome-open > /dev/null
# then
#   gnome-open "localhost:8080"
# fi

go run main.go


