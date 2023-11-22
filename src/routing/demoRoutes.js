import EditableTable from '../demos/EditableTable.vue'
import StaticData from '../demos/StaticData.vue'
import OdataExample from '../demos/OdataExample.vue'

const path = '/demos'

export default [
  {
    name: 'editable',
    path: `${path}/editable`,
    component: EditableTable
  },
  {
    name: 'staticData',
    path: `${path}/static`,
    component: StaticData
  },
  {
    name: 'odata',
    path: `${path}/odata`,
    component: OdataExample
  }
]
