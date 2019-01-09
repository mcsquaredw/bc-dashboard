# JB Dashboard
An upgraded dashboard for the Big Change Apps platform.

## Installation
1. Install mkcert from [https://github.com/FiloSottile/mkcert](https://github.com/FiloSottile/mkcert)
2. Install Node.js from [https://nodejs.org/en/](https://nodejs.org/en/)
3. Install Git from [https://git-scm.com/downloads](https://git-scm.com/downloads)
4. Clone Git repository
```
   git clone https://github.com/mcsquaredw/jb-dashboard
```
5. Install dependencies
```
   cd jb-dashboard && npm i
```
6. Create config.js file
```
   module.exports = {
     username: "<YOUR BIG CHANGE APPS USERNAME>",
     password: "<YOUR BIG CHANGE APPS PASSWORD>",
     api_key: "<YOUR BIG CHANGE APPS API KEY>"
   }
```
7. Create certs using mkcert in certs/ directory
```
   mkcert 127.0.0.1 ::1 localhost <hostname>
   
   The certificate is at "./<hostname>.pem" and the key at "./<hostname>-key.pem"
```
8. Start app
```
   # Development
   npm run start-development
```

```
   # Production
   npm run start-production
```
9. Go to site
```
   https://<hostname>:3000
```
