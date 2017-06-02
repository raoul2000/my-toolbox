# my-toolbox
> this is a toolbox, and that's mine ! :+1:


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

## To Test

Make sure **mocha** is installed globally.

```bash
mocha test
```

## TODO
### Diff
- [ ] compare remote folders
- [ ] display diff for remote files
- [ ] diff files application configuration
- [ ] copy remote file to local
- [ ] copy remote file from source to target
- [ ] modify and save remote file

### Get Server State
- [ ] scan server component (version, other info ...)
- [ ] scan servlet (version, other info ...)

### Monitor
- [ ] tail -f on remote files
- [ ] grep ERROR on remote files
- [ ] etc ...

### Maven repo Front
- [X] display module reference list
- [ ] user select release/snapshot version
- [ ] configuration
- [ ] download war file to local folder
