# krawler-job04

Download sentinel2 images according to criteria (type, clouds, ...) for a location using __Kalisio Krawler__ https://github.com/kalisio/krawler

It scrapes public Sentinel images data from ESA https://scihub.copernicus.eu/userguide/WebHome public server. 

The images information (id, name, url, quicklook) are stored in a MongoDB database.

![Krawler_ESA Sentinel_Sample](https://www.calysteau.fr/images/Krawler_ESA_Sentinel2_Sample.jpg)

## Setting up the environment

### git install
Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency.

Download and install : https://git-scm.com

### nvm install
nvm is a version manager for node.js, designed to be installed per-user, and invoked per-shell.

Download and install : https://github.com/coreybutler/nvm-windows

Then install Node 16

```bash
nvm install 16
nvm use 16.15.1
```

### yarn install
Yarn is a package manager that doubles down as project manager.

Download and install : https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable

Add yarn to Windows environment PATH variable

### MongoDB and MongoDBCompass install
From docker hub https://hub.docker.com/_/mongo
```bash
docker pull mongo
docker run --name some-mongo -d mongo:tag
```

Install compass to explore and manipulate your database
https://www.mongodb.com/try/download/compass

## Krawler install
Krawler is a minimalist ETL that make automated process of extracting and processing (geographic) data from heterogeneous sources with ease

In the working directory (e.g. c:\workspace), create a kalisio directory

```bash
cd c:\workspace\kalisio
git clone https://github.com/kalisio/krawler
cd krawler
yarn install
yarn link
```

## job04 install
In the kalisio directory ( ex: C:\workspace\kalisio)

```bash
git clone https://github.com/calysteau/krawler-job04
cd krawler-job04
yarn install
yarn link @kalisio/krawler
```

Set parameters in jobfile.js
```bash
const platformname = 'Sentinel - 2'
const producttype = 'S2MSI2A'
const latitude = '43.604652'
const longitude = '1.444209'
const cloudcoverpercentagemin = '0'
const cloudcoverpercentagemax = '5'

// Register Open Access Hub account on https://scihub.copernicus.eu/userguide/SelfRegistration and set your login/password credentials
const username = 'login'
const userpassword = 'password'
```

Run the job
```bash
krawler jobfile.js
```

## Notes

If you need to activate the Krawler DEBUG

```bash
set DEBUG= krawler*   (pour CMD)
```
or 
```bash
$env:DEBUG="krawler*"  (pour PowerShell)
```
