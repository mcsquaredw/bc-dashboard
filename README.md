# JB Dashboard
An upgraded dashboard for the Big Change Apps platform.

## Installation
1. Install mkcert from [https://github.com/FiloSottile/mkcert](https://github.com/FiloSottile/mkcert)
   a. If using Windows, install the Chocolatey package manager, then use:
     ```
        choco install mkcert
     ```
2. Install Node.js LTS release from [https://nodejs.org/en/](https://nodejs.org/en/)
3. Install Git from [https://git-scm.com/downloads](https://git-scm.com/downloads)
4. Clone Git repository
```
   git clone https://github.com/mcsquaredw/jb-dashboard
```
5. Install dependencies
```
   cd jb-dashboard && npm i
```
6. Create development.js file
```
   module.exports = {
       BC_USERNAME: <Big Change Username e.g. user@host.com>,
       BC_PASSWORD: <Big Change Password>,
       BC_API_KEY: <Big Change API Key>,
       EMAIL_OUTGOING_SERVER: <A valid SMTP server e.g. smtp.somemailprovider.co.uk>,
       EMAIL_USERNAME: <A valid username for the SMTP server above>,
       EMAIL_PASSWORD: <The password associated with the username above>, 
       EMAIL_DESTINATION: <A comma-separated list of email addresses to send alerts and reports to>,
       CERT: <The certificate created by mkcert e.g. certificate.pem>,
       KEY: <The key created by mkcert e.g. key.pem>,
       MONGO_URL: <The url to a MongoDB server (can include username and password) e.g. mongodb://localhost:1234>,
       MONGO_DBNAME: <The MongoDB database to store data in - will be created if it does not exist>,
       SURVEYORS: [
           <Comma separated list of Surveyors>
       ],
       ENGINEERS: [
           <Comma separated list of Engineers>
       ],
       COMPANY_NAME: <Name of company to appear in alert emails>
   }
```
7. Create certs using mkcert in server/certs/ directory
```
   mkcert <hostname> 127.0.0.1 ::1 localhost 
   
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
