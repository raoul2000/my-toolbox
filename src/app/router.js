const Desktop   = require('./component/desktop/main');
const Settings  = require('./component/settings/main');
const TCScanner = require('./component/tc-scan/main');
const TestPage  = require('./component/test-page/main');
const TestTask  = require('./component/test-task/main');

const Create   = require('./component/create/main');
const View     = require('./component/view/main');

const ItemView            = require('./component/desktop/item-view/main');
const ItemViewNotes       = require('./component/desktop/item-view/notes/main');
const ItemViewRepo        = require('./component/desktop/item-view/repo/main');
const ItemViewEntities    = require('./component/desktop/item-view/entities/main');
const ItemViewWebapps     = require('./component/desktop/item-view/webapps/main');
const ItemViewComponents  = require('./component/desktop/item-view/components/main');
const ItemViewCommands    = require('./component/desktop/item-view/commands/main');

const Deploy          = require('./component/deploy/main');
const MavenDownload   = require('./component/maven-download/main');
const NexusDownload   = require('./component/nexus-download/main');


// register routes
module.exports = new VueRouter({
  routes :[
    { path: '/test',             component: TestPage,         name : 'test'},
    { path: '/test-task',        component: TestTask,         name : 'test-task'},
    { path: '/deploy',           component: Deploy,           name : 'deploy'},
    { path: '/maven-download',   component: MavenDownload,    name : 'maven-download'},
    { path: '/nexus-download',   component: NexusDownload,    name : 'nexus-download'},
    { path: '/desktop',          component: Desktop,          name : 'desktop' },
    { path: '/settings',         component: Settings,         name : 'settings'},
    { path: '/create',           component: Create,           name : 'create'},
    { path: '/view',             component: View,             name : 'view'},
    { path: '/tc-scan/:id',      component: TCScanner,        name : 'tc-scan'},
    { path: '/item-view/:id',    component: ItemView,
      children : [
      {
        path      : 'notes',
        name      : 'server-notes',
        component : ItemViewNotes
      },
      {
        path      : 'repo',
        name      : 'server-repo',
        component : ItemViewRepo
      },
      {
        path      : 'entities',
        name      : 'server-entities',
        component : ItemViewEntities
      },
      {
        path      : 'webapps',
        name      : 'server-webapps',
        component : ItemViewWebapps
      },
      {
        path      : 'components',
        name      : 'server-components',
        component : ItemViewComponents
      },
      {
        path      : 'commands',
        name      : 'server-commands',
        component : ItemViewCommands
      }
    ]}
  ]
});