import EditableTable from './demos/EditableTable.vue'
import StaticData from './demos/StaticData.vue'
import OdataExample from './demos/OdataExample.vue'

export const routes = [
  {
    name: 'editable',
    path: '/editable',
    component: EditableTable
  },
  {
    name: 'staticData',
    path: '/static',
    component: StaticData
  },
  {
    name: 'odata',
    path: '/odata',
    component: OdataExample
  }
]
