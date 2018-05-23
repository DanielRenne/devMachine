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

# echo -e '{
#   "appSettings": {
#       "developerGoTrace": false, 
#       "developerLogReact": false, 
#       "developerLogState": false, 
#       "developerLogStateChangePerformance": false, 
#       "developerLogTheseObjects": [], 
#       "developerMode": true, 
#       "developerUseDLV": false, 
#       "enableSimpleTrace": false, 
#       "isDemo": false, 
#       "serverAdmins": []
#   }, 
#   "application": {
#       "bootstrapData": true, 
#       "coreDebugStackTrace": false, 
#       "csrfSecret": "mySecretCSRF", 
#       "developerUseDLV": false, 
#       "disableRootIndex": true, 
#       "domain": "0.0.0.0", 
#       "flushCoreDebugToStandardOut": false, 
#       "htmlTemplates": {
#           "directory": "templates", 
#           "directoryLevels": 1, 
#           "enabled": false
#       }, 
#       "httpPort": 8080, 
#       "httpsPort": 443, 
#       "info": {
#           "contact": {
#               "email": "", 
#               "name": "Daniel Renne", 
#               "url": ""
#           }, 
#           "description": "", 
#           "license": {
#               "name": "MIT", 
#               "url": ""
#           }, 
#           "termsOfService": "http://127.0.0.1/terms", 
#           "title": "Sample Application"
#       }, 
#       "logGophers": false, 
#       "logJoinQueries": false, 
#       "logQueries": false, 
#       "logQueryStackTraces": false, 
#       "logQueryTimes": false, 
#       "productName": "sampleApp", 
#       "releaseMode": "development", 
#       "serverFQDN": "localhost", 
#       "sessionExpirationDays": 3650, 
#       "sessionKey": "*1234SampleApp", 
#       "sessionName": "sampleApp", 
#       "sessionSecureCookie": false, 
#       "talkDirty": false, 
#       "versionDot": "1.0.0.0", 
#       "versionNumeric": 1, 
#       "webServiceOnly": false
#   }, 
#   "dbConnections": [
#       {
#           "auditHistorySizeMax": 15000000, 
#           "connectionString": "mongodb://127.0.0.1:27017/sampleApp", 
#           "database": "sampleApp", 
#           "driver": "mongoDB", 
#           "transactionSizeMax": 500000000
#       }
#   ]
# }' > $1/webConfig.json

mkdir -p $1/bin
mkdir -p $1/db/schemas/1.0.0
mkdir -p $1/db/goFiles
mkdir -p $1/db/bootstrap
# mkdir -p $1/keys

# echo -e '
# -----BEGIN CERTIFICATE-----
# MIID7TCCAtWgAwIBAgIJANu9wYpLjpbdMA0GCSqGSIb3DQEBCwUAMIGMMQswCQYD
# VQQGEwJVUzERMA8GA1UECAwITWljaGlnYW4xEjAQBgNVBAcMCUthbGFtYXpvbzEY
# MBYGA1UECgwPU2lnbWEgU3RhY2sgTExDMRYwFAYDVQQDDA0xMjcuMC4wLjE6NDQz
# MSQwIgYJKoZIhvcNAQkBFhVEUmVubmVAc2lnbWFzdGFjay5jb20wHhcNMTYwMTMx
# MTUyNjA3WhcNMTcwMTMwMTUyNjA3WjCBjDELMAkGA1UEBhMCVVMxETAPBgNVBAgM
# CE1pY2hpZ2FuMRIwEAYDVQQHDAlLYWxhbWF6b28xGDAWBgNVBAoMD1NpZ21hIFN0
# YWNrIExMQzEWMBQGA1UEAwwNMTI3LjAuMC4xOjQ0MzEkMCIGCSqGSIb3DQEJARYV
# RFJlbm5lQHNpZ21hc3RhY2suY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
# CgKCAQEAutNVxjUqHns7VM0uzQ6O0KexXU0JwnTjxsx/aC9XVSyUqvVUW8nRNkID
# ke5+WNNaSg6rJfSf69C4zxq5frOeN43MXMFBW+xiqSDGssKGKYHiPJt9PyF8Lifz
# isYYa8hm4YJjFscGVp0VXTKJAPy3fiPP/LY3zS0LTMwJSqCs/jE2KEQZUiRcC/gV
# +2RPlBiUIdqNY1LbI02Na52sNi7QoKNiIinEOlYeHm/muIKO4Jey3TpYj8Dy21JY
# hVoUSCbWVTqV9xhoVAqZ7CWyebXmIOcg8YiLCU3YKBKDVskgyfjIETqhzF57IPXL
# 5v9vlU9H1CNNF7E1lFkPkJHM2FaoWwIDAQABo1AwTjAdBgNVHQ4EFgQUCDh2/a6U
# eyNfuxvnMk9wkxmNGm8wHwYDVR0jBBgwFoAUCDh2/a6UeyNfuxvnMk9wkxmNGm8w
# DAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAJARAQ7NdBRVZAU5kEMv8
# Igpd6P9bC8bhFCiMS4OZMhmZAMNwJ+RtTR5w5XEiD0qfzA/tthHD/TPSRrX/soaV
# afGA5A9bBEro7DsM2RKO6vYnE1wdDCBxwWrtWJnQa4JFJIYUiR9ng8UHB1XDi4cB
# Dt6IzOaauTxIK6zlTqVHiE+CdMr/d+F2b8fOvkhFAcSreFjcctA/G33sIlimV4X8
# q7EegYZEB1gv/guBpoK1aNdEntCDawCvgR165SPIPFo27BlnfQLcJHTd4/mm5Cqe
# ao4QZecgClFLxyr9R+GMwQkcQYilAeEhawa0qXpdh/gbMO7Zc8esilyD6b1V9i5A
# Aw==
# -----END CERTIFICATE-----
# ' > $1/keys/cert.pem

# echo -e '
# -----BEGIN PRIVATE KEY-----
# MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC601XGNSoeeztU
# zS7NDo7Qp7FdTQnCdOPGzH9oL1dVLJSq9VRbydE2QgOR7n5Y01pKDqsl9J/r0LjP
# Grl+s543jcxcwUFb7GKpIMaywoYpgeI8m30/IXwuJ/OKxhhryGbhgmMWxwZWnRVd
# MokA/Ld+I8/8tjfNLQtMzAlKoKz+MTYoRBlSJFwL+BX7ZE+UGJQh2o1jUtsjTY1r
# naw2LtCgo2IiKcQ6Vh4eb+a4go7gl7LdOliPwPLbUliFWhRIJtZVOpX3GGhUCpns
# JbJ5teYg5yDxiIsJTdgoEoNWySDJ+MgROqHMXnsg9cvm/2+VT0fUI00XsTWUWQ+Q
# kczYVqhbAgMBAAECggEACS3hBQAPtbewTpZWOlUAx1e16zOhyyAbIOVjTScmT1UF
# aPDs2CWuVdAghMcHBi48PW9DEXZXdSqoKeTSQFtq5qfc5qHIKFAQ+OZXXOkZ1mg/
# SWMKYFOw2kO0P5lEEeeixmm1nKTitta4+f9Fo/rGuTfhPDVnwHj6GSfdPQFv/n0u
# 60xqi8pzn9Kyleu725OG+Yn4iUZ3stMUyeXYupuD+AZkamqS6/Nsx7mR9duISRYh
# BDRQMDC5cMK/zor1OCiRhx6gZTaG/E15U/Z5E2sM69QIWY+U3Bij1f3gmSHyZKeN
# HMXe9faNskXfLJkqL8zqmq1qfJXn/T4vRfHnPQynYQKBgQDvtlZtmSNJwu8wnd2C
# M0GTf51en8ceapuTkOJE3EHEzHqG9c0POXw7lvMCs9dNkBebtbfGtw+j7uKKcqbk
# BpCP+/ktyn9So1Z6XdEmi12tMNTjKs1F849B3cO99HnuQc6Ek0bmYL5mZM3LzCRh
# XeG8/St1c+s5TXC5kOC3hIEdnwKBgQDHhQ/elpRbkLiQuZDWVmTzgq466IO1n1nq
# 1Hr01KjJZpNa8zNCUXCQjLULf02Wz4Nr4M45t4v4n8fZazSjcms1hM+Y18Y6CWR9
# ksxazoiIh6/2GMjAf9dlvj77hlxGCravRb6lLDhvnu72DNYQXakjMzCsjIb5Kh0V
# v/7m+x4DxQKBgGGUQf5/ViQSnDeYK7FymAEo87CvLekt0ILzeYg6ePNZoY8KxBys
# c+v1+JpjBwPl4hZalKLppg4/kix1m4Y7PeG+2qJPSiEjqHJLenZMSSfVNvP6WnFd
# QjW3xpSuzmu0khLZuQTS4O7hnfyV70FLbDb4gBZhx6Ed6wM+/Jr3729VAoGBAKbD
# H92C7GOQFcPZZibQNTaXXnscRqHym9w8Vrz2VlFn6/gT2B8xJK2c/eGrOLW5onXz
# g0sYj+Rx4D9obKnEg7lK1Z1BlIyDtzuCDE5F3DaJethuJLVI5UdD+S6QQeXFJKZg
# 3BUAXfdl1wNO/UjWj/081w0Rs+rkeUTpoet7rr2lAoGBAKO27wKy3TAA96LvxoGX
# 1sNoYUSpjjQ11R20FutYwR5AhXW3wDes3DRnNCksH/FZYWopBByW7frNqDDIHCwD
# wLMy63VlcDiQypUCTnHgW7M+IAXTKKBq1DtST3+HfudBD5VuodMAPp+59yFe34Ej
# XtCwUfWFlytxX+6IAljaOQwT
# -----END PRIVATE KEY-----
# ' > $1/keys/key.pem

# echo -e '
# package main

# import (
# 	"os"

# 	"github.com/DanielRenne/GoCore/core/app"
# 	"github.com/DanielRenne/GoCore/core/ginServer"
# 	"github.com/gin-gonic/gin"
# )

# func main() {
# 	goPath := os.Getenv("GOPATH")
# 	err := app.Initialize(goPath+"/src/github.com/DanielRenne/'$directoryName'", "webConfig.json")
# 	if err == nil {
# 		ginServer.Router.GET("/", func(c *gin.Context) {
# 			c.File(goPath + "/src/github.com/DanielRenne/'$directoryName'/web/dist/index.html")
# 		})
# 		ginServer.Router.GET("/page/:fileName", func(c *gin.Context) {
# 			c.File(goPath + "/src/github.com/DanielRenne/'$directoryName'/web/dist/index.html")
# 		})
# 		app.Run()
# 	}
# }

# ' > $1/main.go

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


