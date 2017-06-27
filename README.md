# my-toolbox
> this is a toolbox, and that's mine ! :+1:

## Feature List

### Diff
- [X] compare remote folders
- [X] display diff for remote files
- [X] diff files application configuration
- [ ] copy remote file to local
- [ ] copy remote file from source to target
- [X] modify and save remote file

### Get Server State
- [ ] scan server component (version, other info ...)
- [ ] scan servlet (version, other info ...)

### Monitor
- [ ] tail -f on remote files
- [ ] grep ERROR on remote files
- [ ] etc ...

### Maven repo Front
- [X] display module reference list
- [X] user select release/snapshot version
- [ ] configuration (evaluate nconf as replacement)
- [X] download war file to local folder

### Deploy to server
- [X] Ansible
- [X] SSH (Direct)
- [ ] implement alternate deploy strategy

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Install dependencies
npm install
# Run the app
npm start
```

Learn more about Electron and its API in the [documentation](http://electron.atom.io/docs/).

## To Debug

Make sure **node-debug** is installed globally.

```bash
npm run dev
node-debug
```
To run a test SSH server using Docker go to the `test/data` folder, ad from there start a Docker container for SSH server.

```bash
docker run --rm -v %cd%:/mnt --publish=2222:22 sickp/alpine-sshd:7.5
```
Then connect to `127.0.0.1 root/root`.

## To Test

Make sure **mocha** is installed globally.

```bash
mocha test
```

## To build EXE

Make sure you have [electron-pakager](https://github.com/electron-userland/electron-packager) installed globally :
```bash
npm install electron-packager -g
```

Then build the EXE for Windows x64 platform :

```bash
npm run buildEXE
```

The build is done in folder `my-toolbox-win32-x64`.
